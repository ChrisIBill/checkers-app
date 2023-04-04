import {
    AdminClientToServerEvents,
    AdminServerToClientEvents,
    GuestClientToServerEvents,
    GuestServerToClientEvents,
    IPayloadCall,
    UserClientToServerEvents,
    UserServerToClientEvents,
} from "@src/interfaces/SocketIO-Interfaces";
import { Server, Socket } from "socket.io";

export const registerGuestUsersHandlers = (
    io: Server<GuestClientToServerEvents, GuestServerToClientEvents>,
    socket: Socket
) => {
    socket.on("Test:Guest_Listener", (args: IPayloadCall) => {
        console.log("Test:Guest_Listener", args);
        args.callback("Guest_Listener");
    });
};

export const registerUserUsersHandlers = (
    io: Server<UserServerToClientEvents, UserClientToServerEvents>,
    socket: Socket
) => {
    registerGuestUsersHandlers(io, socket);
    socket.on("Users:Get_Me_Req", (args: IPayloadCall) => {
        console.log("Users:Get_Me_Req", args);
        args.callback("Users:Get_Me_Req");
    });
};

export const registerAdminUsersHandlers = (
    io: Server<AdminServerToClientEvents, AdminClientToServerEvents>,
    socket: Socket
) => {
    registerUserUsersHandlers(io, socket);
};
