import { ClientJoinRoomReqType } from "@src/interfaces/SocketIO-Interfaces";
import HttpStatusCode from "../../../client/src/constants/HttpStatusCodes";
import { findCheckersRoom, joinCheckersRoom } from "./checkers-socket";

/**
 * Server searches for open games of specific type
 */

export async function onJoinGameRoomReq(
    this: any,
    args: ClientJoinRoomReqType
) {
    /* Route to appropriate function based on room type (Ex: checkers, chess, chat?) */
    const socket = this;
    const token = socket.handshake.auth.token;
    const userID = socket.handshake.auth.userID;
    console.log("JOIN TOKEN: " + token);
    console.log("JOIN USER ID: " + userID);
    console.log("Received request to join room from client");
    console.log("Socket ID: " + socket.id);
    console.log(args);
    if (!args.matchmakingType && !args.roomID) {
        console.log(
            "Improper request, require either matchmaking type or roomID"
        );
        socket.emit("gamesJoinRoomRes", { status: HttpStatusCode.BAD_REQUEST });
    }
    /* if matchmakingType */
    if (args.matchmakingType) {
        switch (args.gameType) {
            case "checkers":
                findCheckersRoom(socket, args.matchmakingType);
            /* Run checkers socket join room */
        }
    }
}
