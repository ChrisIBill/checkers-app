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

//import authSocket from "@src/sockets/authHandler"
import { findUserFromToken } from "./services/myAuthService";
import { handleLoginRequest, handleSignUpRequest } from "./sockets/auth-socket";
import User, { IUser, UserRoles } from "./models/User";
import {
    adminAuthMw,
    authMw,
    guestAuthMw,
    userAuthMw,
} from "./routes/middleware/authMw";
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

const onConnection = async (socket: Socket) => {
    //Default Connection, need to find users  role and send to them
    console.log("Base Connection: ", socket.id);
    const token = socket.handshake.auth.token;
    const user = await findUserFromToken(token);
    if (user && user.role) {
        socket.emit(
            "Auth:Token_Res",
            {
                status: HttpStatusCodes.OK,
                data: user,
            },
            (res: any) => {
                console.log(
                    "Received Client Callback for Auth:Token_Res: ",
                    res
                );
            }
        );
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

// **** Export default **** //

export default httpServer;
