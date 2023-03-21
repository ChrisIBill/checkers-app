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
import Paths from "@src/routes/constants/Paths";

import EnvVars from "@src/constants/EnvVars";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import { NodeEnvs } from "@src/constants/misc";
import { RouteError } from "@src/other/classes";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { runCheckersRooms } from "./sockets/checkers-socket";
import jwt from "jsonwebtoken";

//import authSocket from "@src/sockets/authHandler"
import { findUserFromToken } from "./services/myAuthService";
import {
    authTokenResEmit,
    handleLoginRequest,
    handleSignUpRequest,
    userLoginAuth,
} from "./sockets/auth-socket";
import User, { IUser } from "./models/myUser";
import myUserService from "./services/myUserService";
import { redirectEmit } from "./sockets/emits";
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

io.use(async (socket, next) => {
    console.log("Validation Middleware firing for socket id: ", socket.id);
    const token = socket.handshake.auth.token;
    const user = await findUserFromToken(token);
    if (user) {
        console.log("User from token: ", user);
        //Do i need to redirect here?
        authTokenResEmit(socket, user);
        redirectEmit(socket, Paths.App, HttpStatusCodes.PERMANENT_REDIRECT);
    } else {
        console.log("No user found, redirecting");
        authTokenResEmit(socket);
        redirectEmit(socket, Paths.Auth.Login);
    }
    //If token doesnt exist reroute user to auth login
    //else send valid, maybe find where user should be?
    next();
});

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
app.get("/", (res, req) => {
    req.json({ message: "Connected with Root Server" });
    console.log("Root access detected");
});
app.get("/GameData/Checkers", (res, req) => {
    req.json({ message: "Connected with Checkers Server" });
    /* req.json({
        moveDesc: "start",
        boardState: "0::12w8n12b",
    }); */
});

const onConnection = (socket: Socket) => {
    //Default Connection, nav to current user pos?
    console.log("Base Connection Detected");
};

const authConnection = (socket: Socket) => {
    console.log("AuthConnection");
    socket.on("authTokenValReq", (tok: string) => {
        //Dont think i actually need to validate here, but maybe could use it to properly redirect?
        socket.emit("authTokenValRes", "ServerRes");
    });
    socket.on("authSignUpReq", handleSignUpRequest);
    socket.on("authLoginReq", handleLoginRequest);
};
const appConnection = async (socket: Socket) => {
    //Should already be valid user, if not should get immediately rerouted
    console.log("User connected with App");
    const token = socket.handshake.auth.token;
    const user = await findUserFromToken(token);
    if (!user) {
        console.log("ERROR: UNAUTHORIZED");
    } else {
        console.log("Server Side App User Context: ", user);
    }
};
const checkersConnection = (socket: Socket) => {
    console.log("checkersConnection");
};
io.of(Paths.Base).on("connection", onConnection);
io.of(Paths.Auth.Base).on("connection", authConnection);
io.of(Paths.App).on("connection", appConnection);
io.of(Paths.Games.Checkers).on("connection", checkersConnection);

// **** Export default **** //

export default httpServer;
