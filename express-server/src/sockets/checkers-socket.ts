import { CheckersRoom } from "@src/interfaces/checkersInterfaces";
import { createServer } from "http";
import { Server } from "socket.io";
import Paths from "../routes/constants/Paths";
export function runCheckersRooms(io: Server) {
    const numRooms = 1;
    const playersInRooms: number[] = [0];
    const checkersRooms: CheckersRoom[] = [];
    io.of(Paths.Games.Checkers).on("connection", (socket) => {
        console.log("a user connected");
        console.log("Socket ID: " + socket.id);
        let roomsFull = false;
        for (let i = 0; i < checkersRooms.length; i++) {
            if (checkersRooms[i].numPlayers < 2) {
                checkersRooms[i].numPlayers += 1;
                socket.join(`checkers-room${i}`);
                console.log("Found Room for player");
            } else roomsFull = true;
        }
        if (roomsFull) {
            socket.join(`checkers-room${playersInRooms.length}`);
            playersInRooms.push(1);
        }
        const rooms = io.of(Paths.Games.Checkers).adapter.rooms;
        socket.emit("initCheckers", "p12/E8/P12", 0, "PK");
        socket.on("ClientTurn", (args) => {
            console.log(args);
        });
    });
    /* io.of(Paths.Games.Checkers).adapter.on("join-room", (room, id) => {
        const players = io.of(Paths.Games.Checkers).adapter.rooms.get(room);
        //Emit player joined, gamestate to both players
        console.log(`socket ${id} has joined room ${room}`);
    });
    io.of(Paths.Games.Checkers).adapter.on("create-room", (room, id) => {
        console.log(`room ${room} was created`);
    }); */
}
