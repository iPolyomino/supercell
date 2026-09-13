import * as functions from "firebase-functions";
import { default as next, NextApiRequest, NextApiResponse } from "next";
import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { clientIp, savePost } from "./chat";

initializeApp();

export const postChat = functions.https.onCall(async (data, context) => {
  const ip = clientIp(context.rawRequest.get("x-forwarded-for"),
    context.rawRequest.socket.remoteAddress, process.env.FUNCTIONS_EMULATOR === "true");
  return savePost(getDatabase(), data, ip);
});

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

export const supercell = functions.https.onRequest(
  // @ts-ignore
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await app.prepare();
      await handle(req, res);
    } catch (error) {
      console.error("functions error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);
