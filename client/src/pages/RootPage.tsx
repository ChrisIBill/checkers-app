import {createContext, useContext, useEffect, useState} from "react";
import {
	Navigate,
	NavigateFunction,
	Outlet,
	useNavigate,
} from "react-router-dom";
import {Socket, io} from "socket.io-client";
import HttpStatusCode from "../constants/HttpStatusCodes";
//import { UserContext } from "../context/userContext";
import {
	ServerToClientEvents,
	ClientToServerEvents,
	IPayload,
} from "../interfaces/socketInterfaces";
import {IUser, UserData} from "../interfaces/userInterfaces";
import {Paths, PathsSet} from "../paths/SocketPaths";
import {onRedirect} from "../services/socketServices";
import {LoginPage} from "./LoginPage";
import {ISessionData} from "../interfaces/SessionInterfaces";
import {DEFAULT_SESSION_DATA} from "../constants/SessionConsts";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	Paths.Base,
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	}
);
export const RootPage = () => {
	//const [userData, setUserData] = useState<IUser | null>();
	const [sessionData, setSessionData] =
		useState<ISessionData>(DEFAULT_SESSION_DATA);
	const navigate = useNavigate();
	console.log("Loading Root");
	function onConnect() {
		console.log("Connected With Base Server: ", socket.id);
	}
	function onAuthTokenRes(args: IPayload) {
		if (args.status != HttpStatusCode.OK) {
			console.log("ERROR: BAD HTTP RESPONSE ", args.status);
			setSessionData({
				isOnline: true,
				authType: "invalid",
				userData: null,
			});
		} else if (args.data.user && localStorage.getItem("token")) {
			setSessionData({
				isOnline: true,
				authType: "user",
				userData: {
					name: args.data.user.name,
					token: args.data.user.token,
				},
			});
			console.log("Setting user data: ", args.data.user);
		} else {
			console.log("No user data in payload: ", args);
			setSessionData({
				isOnline: true,
				authType: "invalid",
				userData: null,
			});
			/* navigate(Paths.Auth.Login); */
		}
	}
	socket.on("connect", onConnect);
	socket.on("authTokenValRes", onAuthTokenRes);
	socket.on("redirect", (args: IPayload) => onRedirect(navigate, args));
	return (
		<div className="RootWrapper">
			<Outlet context={{sessionData}} />
		</div>
	);
};
