import {Socket, io} from "socket.io-client";
import {
	ClientToServerEvents,
	ServerToClientEvents,
} from "../interfaces/socketInterfaces";
import {Paths} from "../paths/SocketPaths";
import HttpStatusCode from "./HttpStatusCodes";

export const GAME_STATUS_TYPES = [
	"selecting",
	"connecting",
	"loading",
	"waiting",
	"active",
	"error",
] as const;

export const DEFAULT_PAYLOAD = {
	status: HttpStatusCode.OK,
};
