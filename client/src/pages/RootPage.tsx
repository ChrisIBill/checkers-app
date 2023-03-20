import {useEffect, useState} from "react";
import {
	Navigate,
	NavigateFunction,
	Outlet,
	useNavigate,
} from "react-router-dom";
import {Socket, io} from "socket.io-client";
import {
	ServerToClientEvents,
	ClientToServerEvents,
	IPayload,
} from "../interfaces/socketInterfaces";
import {Paths, PathsSet} from "../paths/SocketPaths";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	Paths.Base,
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	}
);
function onRedirect(this: any, args: IPayload) {
	const navigate = useNavigate();
	console.log("Redirect Requested here", args);
	if (PathsSet.includes(args.data.path)) navigate(args.data.path);
}
export const RootPage = () => {
	const [navLink, setNavLink] = useState<string>("");
	const navigate = useNavigate();
	console.log("Loading Root");
	function onConnect() {
		console.log("Connected With Base Server: ", socket.id);
	}

	socket.on("connect", onConnect);
	socket.on("redirect", onRedirect);
	return <Outlet />;
};
