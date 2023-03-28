import {
    ClientJoinRoomReqType,
    ClientPaths,
} from "@src/interfaces/SocketIO-Interfaces";
import Paths from "@src/routes/constants/Paths";
import { findUserFromToken } from "@src/services/myAuthService";
import HttpStatusCode from "../../../client/src/constants/HttpStatusCodes";
import { findCheckersRoom, findPVPCheckersRoom } from "./checkers-socket";
import { zipGameState } from "../util/CheckersUtil";

/**
 * Server searches for open games of specific type
 */

export async function onJoinGameRoomReq(
    this: any,
    args: ClientJoinRoomReqType,
    callback: (arg: any) => void
) {
    /* Route to appropriate function based on room type (Ex: checkers, chess, chat?) */
    const socket = this;
    const token = socket.handshake.auth.token;
    const user = await findUserFromToken(token);
    console.log(callback);
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
        callback({ status: HttpStatusCode.BAD_REQUEST });
        //socket.emit("gamesJoinRoomRes", { status: HttpStatusCode.BAD_REQUEST });
    } else if (args.matchmakingType) {
        /* if matchmakingType */
        switch (args.gameType) {
            case "checkers":
                try {
                    const roomData = await findCheckersRoom(
                        socket,
                        args.matchmakingType,
                        user.name
                    );
                    if (roomData) {
                        console.log("Emitting room data: ", roomData);
                        callback({ status: HttpStatusCode.OK });
                        socket.emit("gamesJoinRoomRes", {
                            status: HttpStatusCode.OK,
                            data: {
                                path: Paths.Games.Checkers,
                            },
                        });
                    } else {
                        callback({ status: HttpStatusCode.NOT_FOUND });
                    }
                } catch (err) {
                    console.log("Error: ", err);
                    callback({ status: HttpStatusCode.INTERNAL_SERVER_ERROR });
                }

            /* Run checkers socket join room */
        }
    }
}
