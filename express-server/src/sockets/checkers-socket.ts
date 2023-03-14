import { CheckersPlayer, CheckersRoom } from "@src/models/CheckersRoom";
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
        let roomsFull = true;
        for (let i = 0; i < checkersRooms.length; i++) {
            if (checkersRooms[i].status == "waitingForPlayers") {
                const numPlayers = checkersRooms[i].addPlayer(socket.id);
                socket.join(`checkers-room${i}`);
                socket
                    .to(socket.id)
                    .emit("checkers room data", checkersRooms[i]);
                console.log("Found Room for player");
                roomsFull = false;
                if (numPlayers == 2) {
                    socket
                        .to(`checkers-room${i}`)
                        .emit("checkersRoomInit", checkersRooms[i]);
                }
                break;
            } else roomsFull = true;
        }
        if (roomsFull) {
            socket.join(`checkers-room${playersInRooms.length}`);
            const newRoom = new CheckersRoom(
                checkersRooms.length,
                "waitingForPlayers"
            );
            newRoom.addPlayer(socket.id);
            checkersRooms.push(newRoom);
            socket
                .to(`checkers-room${playersInRooms.length}`)
                .emit("checkers room data", checkersRooms.at(-1));
            console.log("Created new room", checkersRooms);
        }
        const rooms = io.of(Paths.Games.Checkers).adapter.rooms;
        socket.emit("initCheckers", "p12/E8/P12", 0, "PK");
        socket.on("PlayerTurn", (args) => {
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

/* function addPlayer(userName: string, players: ): boolean {
        console.log("Adding Player");
        for (let p of players) {
            if (p == undefined) {
                p = {
                    id: userName,
                    status: "connected",
                };
                if (!players.includes(undefined)) {
                    this.status = "initializing";
                }
                return true;
            }
        }
        console.log("Error");
        return false;
} */
