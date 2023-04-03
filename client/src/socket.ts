import {io} from "socket.io-client";

const URL =
	process.env.NODE_ENV === "production" ? undefined : "http://localhost:3001";
const opts = {
	auth: (cb: (data: Object) => void) => {
		cb({token: localStorage.token});
	},
	autoConnect: false,
};
export const baseSocket = io("https://localhost:3001", opts);
export const authSocket = io("https://localhost:3001/auth", opts);
export const guestSocket = io("https://localhost:3001/guest", opts);
export const userSocket = io("https://localhost:3001/user", opts);
export const adminSocket = io("https://localhost:3001/admin", opts);
