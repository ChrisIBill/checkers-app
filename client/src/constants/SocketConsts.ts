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

export const baseSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
	io(Paths.App.Base, {
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	});
