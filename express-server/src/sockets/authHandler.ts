import { Server } from "socket.io";
import Paths from "../routes/constants/Paths";
export function handleAuthorization(io: Server) {
    io.of(Paths.Auth.Login).on("connection", (socket) => {
        console.log("User connected with Auth Server", socket.id);
        socket.on("UserLogin", (...args: any[]) => {
            console.log(args);
        });
    });
}
