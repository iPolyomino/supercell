import { createHash } from "crypto";
import { isIP } from "net";
import { Database } from "firebase-admin/database";
import { HttpsError } from "firebase-functions/v1/https";

// This endpoint is called directly on the first-generation cloudfunctions.net URL.
// Use the address appended by the ingress, never a client-supplied XFF prefix.
export function clientIp(forwarded: string | undefined, remote: string | undefined, emulator: boolean): string {
  const address = emulator ? remote : forwarded?.split(",").pop()?.trim();
  if (!address || !isIP(address)) {
    throw new HttpsError("failed-precondition", "接続元を確認できませんでした。");
  }
  const normalized = address.startsWith("::ffff:") && isIP(address.slice(7)) === 4
    ? address.slice(7) : address;
  return isIP(normalized) === 6
    ? new URL(`http://[${normalized}]/`).hostname.slice(1, -1) : normalized;
}

export async function savePost(db: Database, input: unknown, ip: string) {
  const data = input as { name?: unknown; comment?: unknown; id?: unknown } | null;
  if (!data || typeof data !== "object" || Array.isArray(data) ||
      Object.keys(data).some(key => !["name", "comment", "id"].includes(key)) ||
      typeof data.name !== "string" || data.name.length > 40 ||
      typeof data.comment !== "string" || !data.comment.trim() || data.comment.length > 1000 ||
      typeof data.id !== "string" || !/^[A-Za-z0-9]{16}$/.test(data.id)) {
    throw new HttpsError("invalid-argument", "名前は40文字、コメントは1〜1000文字で入力してください。");
  }
  const now = Date.now();
  const key = createHash("sha256").update(ip).digest("hex");
  const reservation = await db.ref(`chatRateLimits/${key}`).transaction(last => {
    if (typeof last === "number" && now - last < 10000) return;
    return now;
  });
  if (!reservation.committed) {
    throw new HttpsError("resource-exhausted", "同じ接続元からの投稿は10秒間隔でお願いします。");
  }
  const postId = db.ref("chat").push().key;
  if (!postId) throw new HttpsError("internal", "投稿IDを生成できませんでした。");
  // A single atomic update prevents a public post without its private metadata.
  await db.ref().update({
    [`chat/${postId}`]: { name: data.name, comment: data.comment, id: data.id, time: new Date(now).toISOString() },
    [`chatPrivate/${postId}`]: { ip, recordedAt: now }
  });
  return { postId };
}
