import { Server, Socket } from "socket.io";

import myUserRepo from "@src/repos/myUserRepo";
import Paths from "../routes/constants/Paths";
import { IUser } from "@src/models/User";

async function userLoginAuth(user: IUser): Promise<boolean> {
    const persists = await myUserRepo.uNamePersists(user.name);
    if (!persists) {
        console.log("ERROR: COULD NOT FIND USER");
        console.log("User: ", user);
        return false;
    } else {
        //TODO
        //Check if in rooms
        console.log("User found", user);
        return true;
    }
}
async function userSignupAuth(user: IUser): Promise<boolean> {
    const persists = await myUserRepo.uNamePersists(user.name);
    if (persists) {
        console.log("ERROR: User already exists");
        console.log("User: ", user);
        return false;
    } else {
        console.log("Unique user received. Registering new User");
        console.log("User: ", user);
        myUserRepo.add(user);
        return true;
    }
}
export async function handleAuthorization(io: Server, socket: Socket) {
    /* io.of(Paths.Auth.Login).on("connection", (socket) => {
        console.log("User connected with Auth Server", socket.id);
        socket.on("auth:user-login", (...args: any[]) => {
            console.log(args);
        });
        socket.on("auth:user-signup", () => {});
    }); */
    //socket.on("")
}

/* module.exports = (io: Server) => {
    const handleLoginRequest = function (payload) {
        const socket = this;
    }
}
 */
