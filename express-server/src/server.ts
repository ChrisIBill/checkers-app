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
    //Default Connection, nav to auth
    socket.emit("redirect-path", Paths.Auth.Login);
    console.log("Base Connection Detedcted: Rerouting to Auth");
    //socket.on("order:create", create)
};
io.of(Paths.Base).on("connection", onConnection);
/* io.of(Paths.Games.Checkers).on("connection", (socket) => {
    console.log("a user connected");
    console.log("Socket ID: " + socket.id);
    let roomsFull = false;
    for (let i = 0; i < playersInRooms.length; i++) {
        if (playersInRooms[i] < 2) {
            playersInRooms[i] += 1;
            socket.join(`checkers-room${i}`);
            console.log("Found Room for player");
        } else roomsFull = true;
    }
    if (roomsFull) {
        socket.join(`checkers-room${playersInRooms.length}`);
        playersInRooms.push(1);
    }
    const rooms = io.of(Paths.Games.Checkers).adapter.rooms;
    socket.emit("initCheckers", "p12/E8/P12", 0, "PK");
    socket.on("ClientTurn", (args) => {
        console.log(args);
    });
}); */
runCheckersRooms(io);
/* io.of(Paths.Games.Checkers).adapter.on("create-room", (room, id) => {
    console.log(`room ${room} was created`);
});
io.of(Paths.Games.Checkers).adapter.on("join-room", (room, id) => {
    //Emit player joined, gamestate to both players
    console.log(`socket ${id} has joined room ${room}`);
}); */

//io.emit("initServerHandshake", "start", "a12n8b12");
// Set views directory (html)
/* const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Nav to login pg by default
app.get("/", (_: Request, res: Response) => {
    res.sendFile("login.html", { root: viewsDir });
});

// Redirect to login if not logged in.
app.get("/users", (req: Request, res: Response) => {
    const jwt = req.signedCookies[EnvVars.CookieProps.Key];
    if (!jwt) {
        res.redirect("/");
    } else {
        res.sendFile("users.html", { root: viewsDir });
    }
}); */

// **** Export default **** //

export default httpServer;
