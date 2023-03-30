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
