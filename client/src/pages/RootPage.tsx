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
	BaseServerToClientEvents,
	IPayloadCall,
} from "../interfaces/socketInterfaces";
import {IUser, UserData} from "../interfaces/userInterfaces";
import {Paths, PathsSet} from "../paths/SocketPaths";
import {onRedirect} from "../services/socketServices";
import {LoginPage} from "./LoginPage";
import {ISessionContext} from "../interfaces/SessionInterfaces";
import {DEFAULT_SESSION_DATA} from "../constants/SessionConsts";
import {onAuthTokenRes} from "../services/authServices";

const socket: Socket<BaseServerToClientEvents, ClientToServerEvents> = io(
	Paths.Base,
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
		autoConnect: false,
	}
);
export const RootPage = () => {
	const [userData, setUserData] = useState<IUser | null>();
	const [sessionData, setSessionData] =
		useState<ISessionContext>(DEFAULT_SESSION_DATA);
	const navigate = useNavigate();
	console.log("Loading Root");
	function onConnect() {
		console.log("Connected With Base Server: ", socket.id);
	}

	socket.on("connect", onConnect);
	socket.on("connect_error", (err) => {
		console.log("Error connecting to server: ", err);
	});

	socket.on("Auth:Token_Res", (args: IPayloadCall) => {
		const user: UserData = onAuthTokenRes(args);
		setSessionData({
			userData: user,
			isOnline: true,
		});
	});
	socket.on("redirect", (args: IPayload) => onRedirect(navigate, args));
	useEffect(() => {}, [sessionData]);
	return (
		<div className="RootWrapper">
			<Outlet context={{sessionData}} />
		</div>
	);
};
