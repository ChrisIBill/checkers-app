import { Server, Socket } from "socket.io";

import myUserRepo from "@src/repos/myUserRepo";
import Paths from "../routes/constants/Paths";
import User, { IUser } from "@src/models/myUser";
import httpServer from "@src/server";
import { userSignupAuth } from "@src/services/myAuthService";
import { ClientPaths, IPayload } from "@src/interfaces/socketIO";
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { USER_NOT_FOUND_ERR } from "@src/services/myUserService";

export async function userLoginAuth(user: string): Promise<IUser | null> {
    console.log("User Login Authentication");
    const persists = await myUserRepo.uNamePersists(user);
    if (!persists) {
        console.log("ERROR: COULD NOT FIND USER");
        console.log("User: ", user);
        return null;
    } else {
        //TODO
        //Check if in rooms
        console.log("User found", user);
        return myUserRepo.getOne(user);
    }
}
export async function handleLoginRequest(this: Socket, payload: IPayload) {
    const socket = this;
    console.log("Handling Login Request");
    console.log("Payload: ", payload);
    if (!payload.data.name) {
        throw new RouteError(
            HttpStatusCodes.NOT_ACCEPTABLE,
            USER_NOT_FOUND_ERR
        );
    }
    const user = await userLoginAuth(payload.data.name);
    if (!user) {
        throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
    } else {
        console.log(user);
        socket.emit("authLoginRes", {
            data: user,
            status: HttpStatusCodes.ACCEPTED,
        });
        socket.emit("redirect", {
            data: Paths.App,
            status: 200,
        });
    }
}
export async function handleSignUpRequest(this: Socket, payload: IPayload) {
    const socket = this;
    console.log(payload);
    if (!payload.data.name) {
        console.log("Error: Bad Response");
    }
    const user = await userSignupAuth(payload.data.name);
    if (!user) {
        console.log("Valid signup");
    }
    socket.emit("authSignUpRes", {
        data: user,
        status: HttpStatusCodes.CREATED,
    });
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

export async function authTokenResEmit(socket: Socket, user?: IUser) {
    const stat = user ? HttpStatusCodes.OK : HttpStatusCodes.TEMPORARY_REDIRECT;
    const path: ClientPaths = user ? Paths.App : Paths.Auth.Login;
    const payload: IPayload = {
        data: {
            path,
            user,
        },
        status: stat,
    };
    console.log("Auth Token Res Emit: ", payload);
    socket.emit("authTokenValRes", payload);
}
/* module.exports = (io: Server) => {
    const handleLoginRequest = function (payload) {
        const socket = this;
    }
}
 */

//export default httpServer
