import { CheckersRoom } from "@src/models/CheckersRoom";
import { IUser } from "@src/models/User";
import { findUserFromToken } from "@src/services/myAuthService";
import { createServer } from "http";
import randomstring from "randomstring";
import { Namespace, Server, Socket } from "socket.io";
import Paths from "../routes/constants/Paths";
import { IPayload } from "../interfaces/SocketIO-Interfaces";
import HttpStatusCode from "../../../client/src/constants/HttpStatusCodes";
import { MatchmakingTypes } from "../../../client/src/interfaces/GameInterfaces";
import { CheckersRoomConnectPayload } from "../../../client/src/interfaces/socketInterfaces";
import { connect } from "http2";
import { zipGameState } from "../util/CheckersUtil";
import { PIECE_TOKENS } from "../../../client/src/constants/checkersData";
import { getCheckersRoom } from "@src/services/CheckersService";
/**
 *
 * @param io CheckersRoomPath
 * @param socket Client Socket
 */
// const playersInRooms = new Map<string, string>();
// const checkersRooms = new Map<string, CheckersRoom>();
// const openRoomsSet = new Set<string>();
// export async function findCheckersRoom(
//     socket: Socket,
//     matchType: MatchmakingTypes,
//     user: string
// ): Promise<CheckersRoom | null> {
//     if (matchType == "pvp") {
//         const roomID = await findPVPCheckersRoom(socket, user);
//         if (roomID) {
//             const room = checkersRooms.get(roomID);
//             if (!room) {
//                 return null;
//             } else {
//                 /* socket.join(roomID); */
//                 return room;
//             }
//         } else {
//             return null;
//         }
//     } else {
//         console.log("ERROR: Invalid Matchmaking Type, type: ", matchType);
//         return null;
//     }
//     /* else if (args.type === "local") {
//         findLocalCheckersRoom(socket, user);
//     } else if (args.type === "computer") {
//         findComputerCheckersRoom(socket, user);
//     } */
// }
// export async function findPVPCheckersRoom(
//     socket: Socket,
//     user: string
// ): Promise<string | null> {
//     /* Checks if open room exists, if so routes them to room.
//     else if matchmaking type is pvp, search for open room and add,
//         if no open rooms found, make new room and add player
//     elif matchmaking type is local, make new room with same player twice?
//     elif matchmaking type is computer, make new room with bot as player? */
//     const roomID = playersInRooms.get(user);
//     if (roomID) {
//         const success = await joinCheckersRoom(socket, roomID, user);
//         if (success) return roomID;
//         else {
//             console.log("ERROR: Could not join checkers room: ", roomID);
//         }
//     } else if (openRoomsSet.size > 0) {
//         console.log("Found open room, joining room");
//         const openRoomID: string = openRoomsSet.values().next().value;
//         const suc = await joinCheckersRoom(socket, openRoomID, user);
//         if (suc && suc == true) return openRoomID;
//         else {
//             console.log(
//                 "ERROR: Could not join open room, room-id: ",
//                 openRoomID
//             );
//             console.log("Room Data: ", checkersRooms.get(openRoomID));
//             return null;
//         }
//     } else {
//         console.log("No Checkers Rooms available, creating new room");
//         let newID = "default";
//         while (checkersRooms.has(newID)) {
//             newID = randomstring.generate(10);
//         }
//         const newRoom = new CheckersRoom(newID, "open");
//         newRoom.addPlayer(user);
//         playersInRooms.set(user, newID);
//         checkersRooms.set(newID, newRoom);
//         openRoomsSet.add(newID);
//         /* Need better checking for any potential issues */
//         return newID;
//     }
//     return null;
//     /* const payload: IPayload = {
//         status: success
//             ? HttpStatusCode.OK
//             : HttpStatusCode.INTERNAL_SERVER_ERROR,
//         data: roomID
//     };
//     console.log("Sending gamesJoinRoomRes to client: ", payload);
//     socket.emit("gamesJoinRoomRes", payload); */
// }
// export async function findOpenRoom(
//     socket: Socket,
//     roomID: string,
//     user: string
// ): Promise<boolean> {
//     const room = checkersRooms.get(openRoomsSet.values().next().value);
//     if (room) {
//         if (await joinCheckersRoom(socket, roomID, user)) return true;
//     } else {
//         console.log("ERROR: Couldnt join open room");
//         openRoomsSet.delete(roomID);
//         return false;
//     }
//     console.log("ERROR: open room doesnt exist");
//     return false;
// }
// export async function joinCheckersRoom(
//     socket: Socket,
//     roomID: string,
//     user: string
// ): Promise<boolean> {
//     /* Attempts to add player to given roomID, if full or otherwise fails,
//         returns false */
//     const room = checkersRooms.get(roomID);
//     if (room) {
//         console.log("Room found, joining room");
//         if (["empty", "open", "missingPlayer"].includes(room.status)) {
//             if (room.addPlayer(user) == false) return false;
//             /* socket.emit("checkers room data", room); */
//             if (room.data.players.includes(null)) room.status = "open";
//             else {
//                 /* Room is full, run init function */
//                 console.log("Room is full, running init function");
//                 const init = await connectCheckersRoom(socket, roomID);
//                 if (!init) return false;
//                 else room.status = "full";
//             }
//             return true;
//         } else {
//             console.log("Bad room status, status: ", room.status);
//             return false;
//         }
//     } else {
//         console.log("ERROR: Room does not exist");
//         return false;
//     }
// }

// export async function connectCheckersRoom(
//     socket: Socket,
//     roomID: string
// ): Promise<boolean> {
//     const roomData = checkersRooms.get(roomID);
//     if (!roomData) {
//         socket.emit("gamesCheckersRoomConnect", {
//             status: HttpStatusCode.INTERNAL_SERVER_ERROR,
//         });
//         console.log("ERROR: Room does not exist");
//         return false;
//     }
//     const data = {
//         boardState: zipGameState(roomData.data.gameState.boardState),
//         playerTokens: PIECE_TOKENS[0],
//         curPlayer: roomData.data.players[0]!,
//         turnNum: 0,
//     };
//     const payload: CheckersRoomConnectPayload = {
//         status: HttpStatusCode.OK,
//         data: data,
//     };
//     console.log("Sending gamesCheckersRoomConnect to client: ", payload);
//     socket.emit("gamesCheckersRoomConnect", payload);
//     return true;
// }

/* export function onCheckersClientReady(this: Socket, args: IPayload) {
    const socket = this;
    console.log("onCheckersClientReady", args);
    socket.emit("checkersRoomConnect");
} */
export = (io: Namespace, socket: Socket) => {
    const token = socket.handshake.auth.token;
    console.log("User Token: ", token);
    const onCheckersClientLoaded = async (args: any) => {
        console.log("onCheckersClientReady", args);
        const user = await findUserFromToken(token);
        if (!user) {
            /* Will fire if user doesnt exist, need to redirect to auth
            Shouldnt ever happen with proper middleware on namespace */
            console.log("ERROR: User not found");
            return;
        }
        const room: CheckersRoom | null = await getCheckersRoom(user.name);
        if (room && room.id) {
            console.log("Found Checkers Room, joining room", room.id);
            console.log("Room Data: ", room);
            socket.join(room.id);
            socket.emit("checkersClientInit", {
                status: HttpStatusCode.OK,
                data: {
                    boardState: zipGameState(room.data.gameState.boardState),
                },
            });
        } else {
            /* Need to redirect to game creation */
            console.log("User not in room", user.name);
        }
    };
    const onCheckersClientReady = (args: IPayload) => {
        console.log("onCheckersClientReady", args);
    };
    const onCheckersUpdateServer = (args: IPayload) => {
        console.log("onCheckersUpdateServer", args);
    };
    const onCheckersMove = (args: IPayload) => {
        console.log("onCheckersMove", args);
    };
    /* Room managment */
    io.adapter.on("create-room", (room) => {
        console.log(`room ${room} was created`);
    });
    io.adapter.on("join-room", (room) => {
        console.log(`user joined room ${room}`);
        io.to(room);
    });
    io.adapter.on("leave-room", (room) => {
        console.log(`user left room ${room}`);
    });
    io.adapter.on("delete-room", (room) => {
        console.log(`room ${room} was deleted`);
    });
    socket.on("checkersClientLoaded", onCheckersClientLoaded);
    socket.on("checkersClientReady", onCheckersClientReady);
    socket.on("checkersUpdateServer", onCheckersUpdateServer);
    socket.on("checkersMove", onCheckersMove);
};
