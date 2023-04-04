import {
    AdminClientToServerEvents,
    AdminServerToClientEvents,
    GuestClientToServerEvents,
    GuestServerToClientEvents,
    IPayload,
    UserClientToServerEvents,
    UserServerToClientEvents,
} from "@src/interfaces/SocketIO-Interfaces";
import { Server, Socket } from "socket.io";

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
