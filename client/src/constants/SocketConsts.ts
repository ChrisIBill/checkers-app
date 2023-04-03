import {Socket, io} from "socket.io-client";
import {
	ClientToServerEvents,
	ServerToClientEvents,
} from "../interfaces/socketInterfaces";
import {Paths} from "../paths/SocketPaths";

export const GAME_STATUS_TYPES = [
	"selecting",
	"connecting",
	"loading",
	"waiting",
	"active",
	"error",
] as const;
