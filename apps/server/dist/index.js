import express from "express";
import dotenv from "dotenv";
import ws from "ws";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const wss = new ws.Server({ port: 8080 });
class Room {
    constructor() {
        this.sockets = [];
    }
    addSocket(ws) {
        this.sockets.push(ws);
        this.sendMessage("Joined");
    }
    sendMessage(message) {
        this.sockets.forEach((socket) => {
            socket.send("User Joined");
        });
    }
}
const globalRoom = new Room();
wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    ws.on("message", function message(data, meta) {
        console.log(meta);
        console.log("received: %s", data);
    });
    ws.send("something");
    globalRoom.addSocket(ws);
});
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server 125");
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
