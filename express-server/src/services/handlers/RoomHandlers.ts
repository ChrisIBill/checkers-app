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

/* handles rerouting to appropriate room handler */
export const roomPayloadRouter = (roomType: RoomTypes) => {
    switch (roomType) {
        case "basic":
            console.log("Error: Basic Room Type");
            return;
        case "checkers":
            return; /* privateRoomHandler; */
        default:
            return () => {};
    }
};
export const registerGuestRoomHandlers = (
    io: Server<GuestClientToServerEvents, GuestServerToClientEvents>,
    socket: Socket
) => {
    console.log("Guest Room Connection: ", socket.id);
    socket.on("Room:JoinReq", (args: IPayload, cb: (res: any) => void) => {});
    socket.on("Room:Find_Req", (args: IPayload, cb: (res: any) => void) => {});
    socket.on("Room:Leave_Req", (args: IPayload, cb: (res: any) => void) => {});
    socket.on(
        "Room:List_Public_Req",
        (args: IPayload, cb: (res: any) => void) => {}
    );
    socket.on(
        "Room:Update_Server",
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
