import { Socket } from "socket.io";

export const utilMw = (socket: Socket, next: (err: any) => void) => {
    socket.onAnyOutgoing((event, ...args) => {
        console.log("Outgoing event: ", event, args);
    });
};
