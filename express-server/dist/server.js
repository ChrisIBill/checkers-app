"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
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
//# sourceMappingURL=server.js.map