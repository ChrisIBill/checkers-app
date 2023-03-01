import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    /* options */
});

app.get("/", (req, res) => {
    res.json([
        {
            move: 0,
            moveDesc: "start",
            boardState: "12w8n12b",
        },
    ]);
});
io.on("connection", (socket) => {
    console.log(socket.id);
});

httpServer.listen(3001);
