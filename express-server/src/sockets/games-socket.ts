import { ClientJoinRoomReqType } from "@src/interfaces/socketIO";
import HttpStatusCode from "../../../client/src/constants/HttpStatusCodes";

/**
 * Server searches for open games of specific type
 */

export function onJoinGameRoomReq(this: any, args: ClientJoinRoomReqType) {
    /* Route to appropriate function based on room type (Ex: checkers, chess, chat?) */
    const socket = this;
    console.log("Received request to join room from client");
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

            /* Run  */
        }
    }
}
