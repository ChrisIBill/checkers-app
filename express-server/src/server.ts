/**
 * Setup express server.
 */

import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";

import "express-async-errors";

import BaseRouter from "@src/routes/api";
import Paths, { NewPaths } from "@src/routes/constants/Paths";

import EnvVars from "@src/constants/EnvVars";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import { NodeEnvs } from "@src/constants/misc";
import { RouteError } from "@src/other/classes";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

//import authSocket from "@src/sockets/authHandler"
import { findUserFromToken } from "./services/myAuthService";
import {
    authTokenResEmit,
    handleLoginRequest,
    handleSignUpRequest,
    userLoginAuth,
} from "./sockets/auth-socket";
import User, { IUser, UserRoles } from "./models/User";
import myUserService from "./services/myUserService";
import { redirectEmit } from "./sockets/emits";
import { onJoinGameRoomRes } from "../../client/src/services/gamesServices";
import { onJoinGameRoomReq } from "./sockets/games-socket";
import registerCheckersHandlers from "./sockets/checkers-socket";
import {
    adminAuthMw,
    authMw,
    guestAuthMw,
    userAuthMw,
} from "./routes/middleware/authMw";
/* import { onCheckersClientReady, registerCheckersHandlers } from './sockets/checkers-socket'; */
/* import * as checkersSocket from "./sockets/checkers-socket"; */
import { IPayloadCall, NewClientPaths } from "./interfaces/SocketIO-Interfaces";
import { utilMw } from "./routes/middleware/utilMw";
import {
    registerGuestRoomHandlers,
    registerUserRoomHandlers,
    registerAdminRoomHandlers,
} from "./services/handlers/RoomHandlers";
import {
    registerGuestUsersHandlers,
    registerUserUsersHandlers,
    registerAdminUsersHandlers,
} from "./services/handlers/UsersHandlers";
// **** Variables **** //

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    /* Options */
});
/* const numRooms = 1;
const playersInRooms: number[] = [0];
const checkersRoomHandler = []; */
/* const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(httpServer, {
}); */

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev) {
    app.use(morgan("dev"));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production) {
    app.use(helmet());
}

/* Validation middleware */
/* io.use(async (socket, next) => {
    console.log("Validation Middleware firing for socket id: ", socket.id);
    const token = socket.handshake.auth.token;
    if (!token) {
        console.log("No token found ");
        socket.emit("Auth:ClientTokenRes", {
            status: HttpStatusCodes.NOT_FOUND,
        });
    }
    const user = await findUserFromToken(token);
    if (user) {
        console.log("User from token: ", user);
        //Do i need to redirect here?
        authTokenResEmit(socket, user);
        socket.emit("Auth:ClientTokenRes", {
            status: HttpStatusCodes.OK,
            data: user,
        });
    } else {
        console.log("No user found for token: ", token);
        socket.emit("Auth:ClientTokenRes", {
            status: HttpStatusCodes.UNAUTHORIZED,
        });
        authTokenResEmit(socket);
        redirectEmit(socket, Paths.Auth.Login);
    }
    //If token doesnt exist reroute user to auth login
    //else send valid, maybe find where user should be?
    next();
}); */
/* Validation Middleware */
io.use(async (socket, next) => {
    console.log("Handling base connection: ", socket.id);
    try {
        const role: UserRoles = await authMw(socket);
        if (!role) next(new Error("DATABASE_ERROR: INVALID TOKEN"));
        else next();
    } catch (error) {
        next(error);
    }
});
/* io.use(utilMw);
io.on("new_namespace", (namespace) => {
    namespace.use(utilMw);
}); */
io.of(NewPaths.Guest).use(guestAuthMw);
io.of(NewPaths.User).use(userAuthMw);
io.of(NewPaths.Admin).use(adminAuthMw);

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use(
    (
        err: Error,
        _: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: NextFunction
    ) => {
        if (EnvVars.NodeEnv !== NodeEnvs.Test) {
            logger.err(err, true);
        }
        let status = HttpStatusCodes.BAD_REQUEST;
        if (err instanceof RouteError) {
            status = err.status;
        }
        return res.status(status).json({ error: err.message });
    }
);

// ** Front-End Content ** //
/* app.get("/", (res, req) => {
    req.json({ message: "Connected with Root Server" });
    console.log("Root access detected");
});
app.get("/GameData/Checkers", (res, req) => {
    req.json({ message: "Connected with Checkers Server" });
}); */

const onConnection = async (socket: Socket) => {
    //Default Connection, need to find users  role and send to them
    console.log("Base Connection: ", socket.id);
    const token = socket.handshake.auth.token;
    const user = await findUserFromToken(token);
    if (user && user.role) {
        socket.emit("Auth:Token_Res", {
            status: HttpStatusCodes.OK,
            data: user,
            callback: () => {
                console.log("Received Client Callback for Auth:Token_Res");
            },
        });
    }
    console.log("here");
    socket.on("disconnect", (reason) => {
        console.log("User Disconnected: ", socket.id);
        console.log("Reason: ", reason);
    });
    socket.disconnect();
};

const authConnection = async (socket: Socket) => {
    console.log("Auth Connection: ", socket.id);
    socket.on("Auth:Sign_Up_Req", handleSignUpRequest);
    socket.on("Auth:Login_Req", handleLoginRequest);
};

const guestConnection = (socket: Socket) => {
    console.log("Guest Connection: ", socket.id);
    registerGuestRoomHandlers(io, socket);
    registerGuestUsersHandlers(io, socket);
};
const userConnection = (socket: Socket) => {
    console.log("User Connection: ", socket.id);
    registerUserRoomHandlers(io, socket);
    registerUserUsersHandlers(io, socket);
};
const adminConnection = (socket: Socket) => {
    console.log("Admin Connection: ", socket.id);
    registerAdminRoomHandlers(io, socket);
    registerAdminUsersHandlers(io, socket);
};
/* const authConnection = (socket: Socket) => {
    console.log("Auth Connection: ", socket.id);
    socket.on("authTokenValReq", (tok: string) => {
        //Dont think i actually need to validate here, but maybe could use it to properly redirect?
        socket.emit("authTokenValRes", "ServerRes");
    });
    socket.on("authSignUpReq", handleSignUpRequest);
    socket.on("authLoginReq", handleLoginRequest);
};
const appConnection = async (socket: Socket) => {
    //Should already be valid user, if not should get immediately rerouted
    console.log("App Connection: ", socket.id);
    const token = socket.handshake.auth.token;
    const user = await findUserFromToken(token);
    if (!user) {
        console.log("ERROR: UNAUTHORIZED");
    } else {
        console.log("Server Side App User Context: ", user);
    }
};
const gamesConnection = async (socket: Socket) => {
    console.log("Games Connection");
    const token = socket.handshake.auth.token;
    console.log(token);
    socket.on("gamesJoinRoomReq", onJoinGameRoomReq);
};
const checkersConnection = (socket: Socket) => {
    console.log("Checkers Connection: ", socket.id);
    console.log("Registering Checkers Handlers", registerCheckersHandlers);
    registerCheckersHandlers(io.of(Paths.Games.Checkers), socket);
    //socket.on("checkersClientReady", () => console.log("ADSGFHGADFSH"));
}; */
io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});
io.of(NewPaths.Base).on("connection", onConnection);
io.of(NewPaths.Auth).on("connection", authConnection);
io.of(NewPaths.Guest).on("connection", guestConnection);
io.of(NewPaths.User).on("connection", userConnection);
io.of(NewPaths.Admin).on("connection", adminConnection);
/* io.of(Paths.Auth.Base).on("connection", authConnection);
io.of(Paths.App.Base).on("connection", appConnection);
io.of(Paths.Games.Base).on("connection", gamesConnection);
io.of(Paths.Games.Checkers).on("connection", checkersConnection); */

// **** Export default **** //

export default httpServer;
