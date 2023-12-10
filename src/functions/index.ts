import * as functions from "firebase-functions";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, conf: { distDir: "next" } });
const handle = app.getRequestHandler();

export const supercell = functions.https.onRequest((req, res) => {
  console.log("File: " + req.originalUrl);
  // @ts-ignore
  return app.prepare().then(() => handle(req, res));
});
