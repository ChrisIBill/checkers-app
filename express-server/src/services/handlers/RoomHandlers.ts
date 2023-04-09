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

each listener restructures data and reroutes to appropriate room handler
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
export const registerGuestRoomHandlers = (
    io: Server<GuestClientToServerEvents, GuestServerToClientEvents>,
    socket: Socket
) => {
    console.log("Guest Room Handler");
    socket.on("Room:Find_Req", async (args: any, cb: (res: any) => void) => {
        console.log("Received Find Room Request", args);
        const { roomType, roomStyle } = args;
        console.log("type: ", roomType, "id: ", roomStyle);
        const roomManager = roomPayloadRouter(roomType);
        if (!roomManager || !roomStyle) {
            cb({ status: 400, data: { message: "Invalid Request" } });
            return;
        }
        const token = socket.handshake.auth.token;
        const user = await findUserFromToken(token);
        if (!user) {
            cb({ status: 400, data: { message: "Invalid User" } });
            return;
        }
        const roomID = roomManager.findRoom(user.name);
        if (roomID) {
            cb({
                status: 200,
                data: { roomID },
            });
        }
    });
    /* args: {type: 'checkers', id?: roomID} */
    socket.on("Room:Join_Req", async (args: any, cb: (res: any) => void) => {
        console.log("Received Join Room Request", args);
        const { socketRoomType, roomID } = args;
        const roomManager = roomPayloadRouter(socketRoomType);
        if (!roomManager) {
            cb({ status: 400, data: { message: "Invalid Room Type" } });
            return;
        }
        const room = roomManager.managerRoomsMap.get(roomID);
        const token = socket.handshake.auth.token;
        const user = await findUserFromToken(token);
        if (!user) {
            cb({ status: 400, data: { message: "Invalid User" } });
            return;
        } else {
            const payload = await roomManager.joinRoom(user.name, roomID);
            console.log("Room Join Res Payload: ", payload);
            if (!payload) {
                cb({ status: 400, data: { message: "Invalid Room" } });
                return;
            } else {
                socket.join(roomID);
                cb({ status: 200 });
                socket.emit("Room:Join_Res", { data: payload }, (res: any) => {
                    console.log(
                        "Received Client Callback for Room:Join_Res, ",
                        res
                    );
                    if (!room) {
                        console.log("BAD_ERROR: Joined Room not found");
                        return;
                    }
                    if (res === HttpStatusCodes.OK) {
                        room.playerConnected(user.name);
                        if (room.status === "init") {
                            console.log("Room is init, starting game", room);
                            const roomType = room.roomType;
                            socket.to(roomID).emit("Room:Initialize", {
                                roomInfo: {
                                    roomType,
                                    roomID,
                                },
                                data: {},
                            });
                        }
                        console.log("User Joined Room: ", roomID);
                    }
                });
            }
        }

        /* TODO!!!!!!
            !!!!!!!!!!!!!!!!
            !!!!!!!!!!!!!!!! */
    });

    socket.on("Room:Leave_Req", (args: IPayload, cb: (res: any) => void) => {});
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
        (args: IPayload, cb: (res: any) => void) => {}
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
    registerGuestRoomHandlers(io, socket);
    console.log("User Room Handler");
};

export const registerAdminRoomHandlers = (
    io: Server<AdminServerToClientEvents, AdminClientToServerEvents>,
    socket: Socket
) => {
    registerUserRoomHandlers(io, socket);
    console.log("Admin Room Handler");
};
