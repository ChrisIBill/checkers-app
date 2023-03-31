import { Server, Socket } from "socket.io";

import myUserRepo from "@src/repos/UserRepo";
import Paths from "../routes/constants/Paths";
import User, { IUser } from "@src/models/User";
import httpServer from "@src/server";
import { userSignupAuth } from "@src/services/myAuthService";
import { ClientPaths, IPayload } from "@src/interfaces/SocketIO-Interfaces";
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
    if (!payload.data) {
        throw new RouteError(
            HttpStatusCodes.NOT_ACCEPTABLE,
            USER_NOT_FOUND_ERR
        );
    }
    const user = await userLoginAuth(payload.data);
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
    if (!payload.data) {
        console.log("Error: Bad Response");
        socket.emit("authSignUpRes", {
            status: HttpStatusCodes.BAD_REQUEST,
            data: null,
        });
        return;
    }
    const user = await userSignupAuth(payload.data);
    if (!user) {
        console.log("Valid signup");
    } else {
        socket.emit("authSignUpRes", {
            data: user,
            status: HttpStatusCodes.CREATED,
        });
    }
}
export async function authUser(socket: Socket, user: any) {
    const token = socket.handshake.auth.token;
}

export async function authTokenResEmit(socket: Socket, user?: IUser) {
    const stat = user ? HttpStatusCodes.OK : HttpStatusCodes.TEMPORARY_REDIRECT;
    const path: ClientPaths = user ? Paths.App.Base : Paths.Auth.Login;
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
