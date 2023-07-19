import express from "express";
import dotenv from "dotenv";
import ws, { type WebSocket } from "ws";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const wss = new ws.Server({ port: 8080 });

type User = {
  id: string;
  username: string;
  ws: WebSocket;
};

class Chat {
  users: User[] = [];

  addUser(id: string, username: string, ws: WebSocket) {
    const newUser = {
      id: id,
      username: username,
      ws: ws,
    };
    this.users.push(newUser);
  }

  sendMessage(id: string, message: string) {
    const user = this.users.find((a) => a.id === id);

    for (let i = 0; i < this.users.length; i++) {
      this.users[i].ws.send(
        JSON.stringify({
          username: user?.username,
          message: message,
        })
      );
    }
  }
}

const chat = new Chat();

wss.on("connection", function connection(ws: WebSocket, req) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);

    const parsedData = JSON.parse(data.toString());

    if (parsedData.username) {
      let clientId =
        req.headers["sec-websocket-key"] || chat.users.length.toString();
      chat.addUser(clientId, parsedData.username, ws);
    }

    if (parsedData.message) {
      let clientId =
        req.headers["sec-websocket-key"] || chat.users.length.toString();
      chat.sendMessage(clientId, parsedData.message);
    }
  });

  ws.send("something");
});

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server 125");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
