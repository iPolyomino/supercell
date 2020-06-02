import * as functions from "firebase-functions";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, conf: { distDir: "next" } });
const handle = app.getRequestHandler();

export const note_polyomino_jp = functions.https.onRequest((req, res) => {
  console.log("File: " + req.originalUrl);
  return app.prepare().then(() => handle(req, res));
});
