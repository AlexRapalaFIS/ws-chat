import express from "express";
import dotenv from "dotenv";
import ws, { type WebSocket } from "ws";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const wss = new ws.Server({ port: 8080 });

wss.on("connection", function connection(ws: WebSocket) {
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
