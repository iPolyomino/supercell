// Stop posting and temporarily disable /chat reads before applying this migration.
const { initializeApp, applicationDefault, deleteApp } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const fs = require('node:fs');
const url = process.env.CHAT_DATABASE_URL;
if (!url) throw new Error('Set CHAT_DATABASE_URL explicitly to the target database URL');
const credential = process.argv.includes('--firebase-cli') ? {
  async getAccessToken() {
    const auth = require('firebase-tools/lib/auth');
    const account = auth.getProjectDefaultAccount(process.cwd());
    if (!account) throw new Error('Sign in with firebase login first');
    const token = await auth.getAccessToken(account.tokens.refresh_token, []);
    return { access_token: token.access_token, expires_in: token.expires_in || 3600 };
  }
} : applicationDefault();
const app = initializeApp({ credential, databaseURL: url });
// User OAuth credentials from the CLI work with the REST API; the Admin SDK's
// persistent connection expects a different credential type.
async function rest(path, method = 'GET', body) {
  const token = await credential.getAccessToken();
  const response = await fetch(`${url.replace(/\/$/, '')}/${path}.json`, {
    method,
    headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`Database ${method} failed: HTTP ${response.status}`);
  return response.json();
}
async function main() {
  // Fail promptly on invalid credentials instead of retrying the database connection forever.
  if (!process.env.FIREBASE_DATABASE_EMULATOR_HOST) await credential.getAccessToken();
  const db = getDatabase(app);
  const cli = process.argv.includes('--firebase-cli');
  const posts = cli ? await rest('chat') : (await db.ref('chat').get()).val();
  let count = 0;
  for (const child of Object.values(posts || {})) {
    if (child && Object.prototype.hasOwnProperty.call(child, 'ip')) count++;
  }
  console.log(`${count} posts have legacy IP data. IP values are not printed.`);
  if (!process.argv.includes('--apply')) {
    console.log('Dry run only. Back up the database and stop reads/writes before using --apply.');
    return;
  }
  const backupIndex = process.argv.indexOf('--backup');
  if (backupIndex !== -1) {
    const backupPath = process.argv[backupIndex + 1];
    if (!backupPath || backupPath.startsWith('--')) throw new Error('--backup requires a file path');
    const backup = cli ? await rest('') : (await db.ref().get()).val();
    fs.writeFileSync(backupPath, JSON.stringify(backup), { mode: 0o600, flag: 'wx' });
    console.log('Database backup saved with owner-only permissions.');
  }
  // One atomic update per post: retain the legacy value without treating it as verified.
  for (const [id, value] of Object.entries(posts || {})) {
    if (!value || !Object.prototype.hasOwnProperty.call(value, 'ip')) continue;
    const update = {
      [`chatPrivate/${id}/legacyClientIp`]: value.ip,
      [`chat/${id}/ip`]: null
    };
    if (cli) await rest('', 'PATCH', update);
    else await db.ref().update(update);
  }
  console.log(`Migrated ${count} posts. Verify /chat has no IP fields before reopening reads.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => deleteApp(app));
