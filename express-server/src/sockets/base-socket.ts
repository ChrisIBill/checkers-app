import { Server, Socket } from "socket.io";
import Paths from "../routes/constants/Paths";
export function handleAuthorization(io: Server, socket: Socket) {
    console.log("User connected with Auth Server", socket.id);
    socket.on("authTokenValidation", (tok) => {});
    socket.on("UserLogin", (...args: any[]) => {
        console.log(args);
    });
}
