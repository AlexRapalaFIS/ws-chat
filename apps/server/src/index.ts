import express from "express";
import dotenv from "dotenv";
import ws, { type WebSocket } from "ws";
import { IncomingMessage } from "http";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const wss = new ws.Server({ port: 8887 });

wss.on("connection", function connection(ws: WebSocket, req: IncomingMessage) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });
  ws.send("something");
});

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server 125");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
