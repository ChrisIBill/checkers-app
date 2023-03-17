import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Socket, io} from "socket.io-client";
import {
	ServerToClientEvents,
	ClientToServerEvents,
} from "../interfaces/interfaces";
import {Paths} from "../paths/SocketPaths";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	Paths.Base,
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	}
);

export const Root = () => {
	const [display, setDisplay] = useState<number>(0);
	const navigate = useNavigate();
	function onConnect() {
		console.log("Connected With Base Server: ", socket.id);
	}
	function onRedirect(red: string) {
		console.log("Redirect Requested", red);
		navigate(red);
	}
	socket.on("connect", onConnect);
	socket.on("redirect", onRedirect);
	return <h1>Loading...{display}</h1>;
};
