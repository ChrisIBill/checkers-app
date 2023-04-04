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

export async function userLoginAuth(user: IUser): Promise<IUser | null> {
    console.log("User Login Authentication");
    const persists = await myUserRepo.uNamePersists(user.name);
    if (!persists) {
        console.log("User Login Attempt Failed");
        console.log("User: ", user);
        return null;
    } else {
        //TODO
        //Check if in rooms
        console.log("User found", user.name);
        const dbUser = await myUserRepo.getOne(user.name);
        if (!dbUser) {
            console.log("BAD ERROR: USER SHOULD HAVE JUST BEEN ADDED TO DB");
            throw new Error("Could not find user in database");
        } else {
            return dbUser;
        }
    }
}
export async function handleLoginRequest(
    this: Socket,
    payload: IPayload,
    cb: (res: any) => void
) {
    const socket = this;
    console.log("Handling Login Request");
    console.log("Payload: ", payload);
    if (!payload.data) {
        console.log("Received Bad Request From Client: ", socket.id);
        cb({
            status: HttpStatusCodes.BAD_REQUEST,
        });
        return;
    }
    const user = await userLoginAuth(payload.data);
    if (!user) {
        cb({
            status: HttpStatusCodes.UNAUTHORIZED,
        });
        return;
    } else {
        cb({
            status: HttpStatusCodes.OK,
            data: user.id,
        });
    }
}
export async function handleSignUpRequest(
    this: Socket,
    payload: IPayload,
    cb: (res: any) => void
) {
    const socket = this;
    console.log(payload);
    if (!payload.data) {
        console.log("Error: Bad Response");
        cb({
            status: HttpStatusCodes.BAD_REQUEST,
        });
        /* socket.emit("authSignUpRes", {
            status: HttpStatusCodes.BAD_REQUEST,
            data: null,
        }); */
        return;
    }
    try {
        const user = await userSignupAuth(payload.data);
        if (!user) {
            console.log("BAD_ERROR: USER SHOULD EXIST");
            cb({
                status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            });
        } else {
            console.log("User ID: ", user.id);
            cb({
                status: HttpStatusCodes.CREATED,
                data: user.id,
            });
        }
    } catch (error) {
        cb({
            status: HttpStatusCodes.CONFLICT,
        });
        return;
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
