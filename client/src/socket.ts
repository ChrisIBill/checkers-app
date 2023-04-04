import {Socket, io} from "socket.io-client";
import {
	AuthClientToServerEvents,
	AuthServerToClientEvents,
	BaseClientToServerEvents,
	BaseServerToClientEvents,
	GuestClientToServerEvents,
	GuestServerToClientEvents,
	UserClientToServerEvents,
	UserServerToClientEvents,
} from "./interfaces/socketInterfaces";
import {SERVER_PATHS} from "./paths/SocketPaths";
import {
	SocketNamespaces,
	AdminServerToClientEvents,
	AdminClientToServerEvents,
} from "./interfaces/socketInterfaces";

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
export const guestSocket: Socket<
	GuestServerToClientEvents,
	GuestClientToServerEvents
> = io("/Guest", opts);
export const userSocket: Socket<
	UserServerToClientEvents,
	UserClientToServerEvents
> = io("/User", opts);
export const adminSocket: Socket<
	AdminServerToClientEvents,
	AdminClientToServerEvents
> = io("/Admin", opts);

export const SocketMap = {
	baseSocket: baseSocket,
	authSocket: authSocket,
	guestSocket: guestSocket,
	userSocket: userSocket,
	adminSocket: adminSocket,
} as const;
