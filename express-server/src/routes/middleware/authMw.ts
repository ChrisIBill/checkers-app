import { findUserFromToken } from "@src/services/myAuthService";
import { Socket } from "socket.io";

async function authMw(socket: Socket, next: (err?: any) => void) {
    const token = socket.handshake.auth.token;
    const user = await findUserFromToken(token);
    if (!user) {
        console.log("ERROR: UNAUTHORIZED");
        next(new Error("UNAUTHORIZED"));
    } else {
        console.log("Server Side App User Context: ", user);
        next();
    }
}
