import { Server, Socket } from "socket.io";

import myUserRepo from "@src/repos/myUserRepo";
import Paths from "../routes/constants/Paths";
import User, { IUser } from "@src/models/myUser";
import httpServer from "@src/server";

async function userLoginAuth(user: string): Promise<boolean> {
    console.log("Authenticating User: ", user);
    const persists = await myUserRepo.uNamePersists(user);
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
export async function userSignupAuth(
    socket: Socket,
    user: string
): Promise<boolean> {
    console.log("User Signup Authentication");
    const persists = await myUserRepo.uNamePersists(user);
    console.log("Persists: ");
    if (persists) {
        console.log("ERROR: User already exists");
        console.log("User: ", user);
        return false;
    } else {
        console.log("Unique user received. Registering new User");
        console.log("User: ", user);
        const newUser: IUser = {
            name: user,
        };
        myUserRepo.add(newUser);
        socket.emit("authSignUpRes", "ret");
        return true;
    }
}

export async function handleAuthorization(io: Server, socket: Socket) {
    const authNamespace = io.of(Paths.Auth.Base);
    const loginNamespace = io.of(Paths.Auth.Login);
    console.log("User connected with Auth Server", socket.id);
    socket.on("authTokenValidation", (tok) => {});
    socket.on("UserLogin", (...args: any[]) => {
        console.log(args);
    });
    /* io.of(Paths.Auth.Login).on("connection", (socket) => {
        console.log("User connected with Auth Server", socket.id);
        socket.on("auth:user-login", (...args: any[]) => {
            console.log(args);
        });
        socket.on("auth:user-signup", () => {});
    }); */
}

/* module.exports = (io: Server) => {
    const handleLoginRequest = function (payload) {
        const socket = this;
    }
}
 */

//export default httpServer
