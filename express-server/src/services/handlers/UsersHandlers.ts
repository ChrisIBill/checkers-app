import {
    AdminClientToServerEvents,
    AdminServerToClientEvents,
    GuestClientToServerEvents,
    GuestServerToClientEvents,
    IPayload,
    IPayloadCall,
    UserClientToServerEvents,
    UserServerToClientEvents,
} from "@src/interfaces/SocketIO-Interfaces";
import { Server, Socket } from "socket.io";

export const registerGuestUsersHandlers = (
    io: Server<GuestClientToServerEvents, GuestServerToClientEvents>,
    socket: Socket
) => {
    /* socket.on(
        "Test:Guest_Listener",
        (payload: IPayload, cb: (res: any) => void) => {
            console.log("Test:Guest_Listener", payload);
            cb({ message: "Test:Guest_Listener" });
        }
    ); */
};

export const registerUserUsersHandlers = (
    io: Server<UserServerToClientEvents, UserClientToServerEvents>,
    socket: Socket
) => {
    registerGuestUsersHandlers(io, socket);

    socket.on("Users:Get_Me_Req", (args: IPayload, cb: (res: any) => void) => {
        console.log("Users:Get_Me_Req", args);
    });
    socket.on(
        "Users:Delete_Me_Req",
        (args: IPayload, cb: (res: any) => void) => {}
    );
    socket.on(
        "Users:Update_Me_Req",
        (args: IPayload, cb: (res: any) => void) => {}
    );
};

export const registerAdminUsersHandlers = (
    io: Server<AdminServerToClientEvents, AdminClientToServerEvents>,
    socket: Socket
) => {
    registerUserUsersHandlers(io, socket);

    socket.on(
        "Users:List_All_Req",
        (args: IPayload, cb: (res: any) => void) => {}
    );
    socket.on(
        "Users:Delete_Req",
        (args: IPayload, cb: (res: any) => void) => {}
    );
    socket.on(
        "Users:Update_Req",
        (args: IPayload, cb: (res: any) => void) => {}
    );
};
