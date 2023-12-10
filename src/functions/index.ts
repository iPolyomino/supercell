import * as functions from "firebase-functions";
import { default as next, NextApiRequest, NextApiResponse } from "next";

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
