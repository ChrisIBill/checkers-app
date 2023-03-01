const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = 3001;

app.get("/", (req, res) => {
    res.json([
        {
            move: 0,
            moveDesc: "start",
            boardState: "12w8n12b",
            isPlayersTurn: true,
        },
    ]);
    //res.sendFile(__dirname + '/index.html');
});

io.on("connection", (socket) => {
    console.log(socket.id);
});
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
