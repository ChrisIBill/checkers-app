import {Socket, io} from "socket.io-client";
import {
	AuthClientToServerEvents,
	AuthServerToClientEvents,
	BaseClientToServerEvents,
	BaseServerToClientEvents,
} from "./interfaces/socketInterfaces";
import {SERVER_PATHS} from "./paths/SocketPaths";
import {SocketNamespaces} from "./interfaces/socketInterfaces";

const URL =
	process.env.NODE_ENV === "production" ? undefined : "http://localhost:3001";
const opts = {
	auth: (cb: (data: Object) => void) => {
		cb({token: localStorage.token});
	},
	autoConnect: false,
};
export const baseSocket: Socket<
	BaseServerToClientEvents,
	BaseClientToServerEvents
> = io("/", opts);
export const authSocket: Socket<
	AuthServerToClientEvents,
	AuthClientToServerEvents
> = io("/Auth", opts);
export const guestSocket = io("/Guest", opts);
export const userSocket = io("/User", opts);
export const adminSocket = io("/Admin", opts);
