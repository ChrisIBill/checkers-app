/* 
Handles Listeners for all Room Calls
    Each authorization level implements the previous level's handlers
    Guest -> User -> Admin
    Guest: Join, Find, Leave List_Public and Update_Server

All "Room:" calls from client follow the structure
{
    status?: httpstatuscode,
    data?: {
        type | id: type/identification of room
        roomState?: state of room for client
        

    }
}

each listener restructures data and reroutes to appropriate room manager
 */

import {
    AdminClientToServerEvents,
    AdminServerToClientEvents,
    GuestClientToServerEvents,
    GuestServerToClientEvents,
    IPayload,
    RoomTypes,
    UserClientToServerEvents,
    UserServerToClientEvents,
} from "@src/interfaces/SocketIO-Interfaces";
import { Server, Socket } from "socket.io";
import { CheckersRoomsManager } from "../room-managers/checkers-manager";
import { findUserFromToken } from "../myAuthService";
import { findRoomForClient } from "../GamesService";
import { ISocketRoomsManager } from "../room-managers/room-manager";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { unzipGameState } from "@src/util/CheckersUtil";
import { IRoomInfo } from "../../../../client/src/interfaces/RoomInterfaces";
import { SocketRoomStatus } from "@src/models/SocketRoom";

/* handles rerouting to appropriate room handler */
export const roomPayloadRouter = (
    roomType: RoomTypes
): ISocketRoomsManager | null => {
    switch (roomType) {
        case "basic":
            console.log("Error: Basic Room Type");
            return null;
        case "checkers":
            return CheckersRoomsManager as ISocketRoomsManager; /* privateRoomHandler; */
        default:
            return null;
    }
};
export const registerBaseRoomHandlers = (
    io: Server<GuestClientToServerEvents, GuestServerToClientEvents>,
    socket: Socket
) => {
    console.log("Base Room Handler");
    socket.on("Room:Find_Req", async (args: any, cb: (res: any) => void) => {
        const userToken = socket.handshake.auth.token;
        const username = await findUserFromToken(userToken);
        console.log("Received Find Room Request", args);
        const { roomType, roomStyle } = args;
        console.log("type: ", roomType, "id: ", roomStyle);
        const roomManager = roomPayloadRouter(roomType);
        if (!roomManager || !roomStyle) {
            cb({ status: 400, data: { message: "Invalid Request" } });
            return;
        }
        const roomID = roomManager.findRoom(userToken, username);
        if (roomID) {
            cb({
                status: 200,
                data: { roomID },
            });
        }
    });

    /* Listener for Room join requests */
    socket.on("Room:Join_Req", async (args: any, cb: (res: any) => void) => {
        console.log("Received Join Room Request", args);
        const { socketRoomType, roomID } = args;
        const roomManager = roomPayloadRouter(socketRoomType);
        if (!roomManager) {
            cb({ status: 400, data: { message: "Invalid Room Type" } });
            return;
        }
        const token = socket.handshake.auth.token;
        try {
            const roomData = roomManager.joinRoom(token, roomID);
            console.log("Adding Socket to room: ", socketRoomType, roomID);
            socket.join(`${socketRoomType} ${roomID}`);
            cb({ status: 200, message: roomID });
            socket.emit("Room:Join_Res", roomData, (res: any) => {
                console.log(
                    "Received Client Callback for Room:Join_Res, ",
                    res
                );
                if (res !== HttpStatusCodes.OK) {
                    console.log("Error: Client Callback Error", res);
                    return;
                }
                const status = roomManager.memberConnected(token, roomID);
                if (status === SocketRoomStatus.active) {
                    const payload = roomManager.startRoom(roomID);
                    console.log("Starting Room: ", payload);
                    io.to(`${socketRoomType} ${roomID}`).emit("Room:Init", {
                        roomInfo: payload.roomInfo,
                        data: payload.data,
                        callback: (res: any) => {
                            console.log("Room:Init Callback: ", res);
                        },
                    });
                }
            });
        } catch (error) {
            console.log("Error in Room:Join_Req Listener: ", error);
            cb({ status: 400, data: { message: error.message } });
            return;
        }
    });

    socket.on("Room:Leave_Req", (args: IPayload, cb: (res: any) => void) => {
        console.log("Received Leave Room Request", args);
    });
    socket.on(
        "Room:List_Public_Req",
        (args: IPayload, cb: (res: any) => void) => {
            const { type } = args.data;
            const roomManager = roomPayloadRouter(type);
            if (!roomManager) {
                cb({ status: 400, data: { message: "Invalid Room Type" } });
                return;
            }
            const rooms = roomManager.listRooms();
            cb({ status: 200, data: { rooms } });
        }
    );
    socket.on(
        "Room:Update_Server",
        async (args: any, cb: (res: any) => void) => {
            const { roomID, roomType } = args.roomInfo;
            const { boardState, moves } = args.data;
            const token = socket.handshake.auth.token;
            const board = unzipGameState(boardState);
            console.log("Received Update Server", args);
            const roomManager = roomPayloadRouter(roomType);
            if (!roomManager) {
                cb({ status: 400, data: { message: "Invalid Room Type" } });
                return;
            }
            try {
                const payload = roomManager.manageRoomUpdate(
                    token,
                    roomID,
                    board
                );
                if (!payload) {
                    console.log("BAD_ERROR: room update payload is null");
                    return;
                }
                io.to(`${roomType} ${roomID}`).emit("Room:Update_Room", {
                    roomInfo: payload.roomInfo,
                    data: payload.data,
                    callback: (res: any) => {
                        console.log("Received Update callback: ", res);
                    },
                });
            } catch (error) {
                console.log("Error: ", error);
                cb({ status: 400, data: { message: error } });
                return;
            }
            cb({ status: 200 });
        }
    );
    socket.on(
        "Room:Update_Req",
        (args: IPayload, cb: (res: any) => void) => {}
    );
};

export const registerUserRoomHandlers = (
    io: Server<UserServerToClientEvents, UserClientToServerEvents>,
    socket: Socket
) => {
    //registerGuestRoomHandlers(io, socket);
    console.log("User Room Handler");
};

export const registerAdminRoomHandlers = (
    io: Server<AdminServerToClientEvents, AdminClientToServerEvents>,
    socket: Socket
) => {
    //registerUserRoomHandlers(io, socket);
    console.log("Admin Room Handler");
};
