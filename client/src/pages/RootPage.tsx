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
import {authSocket, baseSocket} from "../socket";

const socket: Socket<BaseServerToClientEvents, ClientToServerEvents> = io("/", {
	auth: (cb) => {
		cb({token: localStorage.token});
	},
});
export const RootPage = () => {
	const [userData, setUserData] = useState<IUser | null>();
	const [sessionData, setSessionData] =
		useState<ISessionContext>(DEFAULT_SESSION_DATA);
	const navigate = useNavigate();
	console.log("Loading Root");
	function onConnect(this: Socket) {
		const socket = this;
		console.log("Connected With Base Server: ", socket.id);
		setSessionData({
			userData: null,
			isOnline: true,
		});
	}
	//baseSocket.connect();
	if (baseSocket.connected) {
		console.log("Connected with Base Server: ", baseSocket.id);
	}

	//baseSocket.on("redirect", (args: IPayload) => onRedirect(navigate, args));
	/* authSocket.on("Auth:Token_Res", (args: IPayloadCall) => {
		const user: UserData = onAuthTokenRes(args);
		setSessionData({
			userData: user,
			isOnline: true,
		});
	}); */
	authSocket.on("redirect", (args: IPayload) => onRedirect(navigate, args));
	useEffect(() => {
		console.log("Connection Attempted");
		baseSocket.connect();
		baseSocket.on("connect", onConnect);
		baseSocket.on("connect_error", (err) => {
			console.log("Error connecting to server: ", err.message);
			console.log(err);
			navigate(Paths.App.Base);
		});

		return () => {
			baseSocket.off("connect", onConnect);
			baseSocket.disconnect();
		};
	}, [sessionData]);
	return (
		<div className="RootWrapper">
			<Outlet context={[sessionData, setSessionData]} />
		</div>
	);
};
