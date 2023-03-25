import { ClientJoinRoomReqType } from "@src/interfaces/SocketIO-Interfaces";
import Paths from "@src/routes/constants/Paths";
import { findUserFromToken } from "@src/services/myAuthService";
import HttpStatusCode from "../../../client/src/constants/HttpStatusCodes";
import { findCheckersRoom, findPVPCheckersRoom } from "./checkers-socket";

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
    const user = await findUserFromToken(token);
    if (user == null) {
        socket.emit("redirect", {
            status: HttpStatusCode.UNAUTHORIZED,
            data: { path: Paths.Auth.Login },
        });
        throw new Error("Error: User not found");
    } else {
        console.log("User: ", user);
    }
    console.log("Received request to join room from client");
    console.log("Socket ID: " + socket.id);
    console.log(args);
    if (!args.matchmakingType && !args.roomID) {
        console.log(
            "Improper request, require either matchmaking type or roomID"
        );
        socket.emit("gamesJoinRoomRes", { status: HttpStatusCode.BAD_REQUEST });
    } else if (args.matchmakingType) {
    /* if matchmakingType */
        switch (args.gameType) {
            case "checkers":
                findCheckersRoom(socket, args.matchmakingType, user.name);
            /* Run checkers socket join room */
        }
    }
}
