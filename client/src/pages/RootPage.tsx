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
import {onConnectError, onRedirect} from "../services/socketServices";
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
		socket.on("Auth:Token_Res", (args: IPayloadCall) => {
			console.log("Token Res: ", args);
		});
	}
	function onDisconnect(this: Socket) {
		const socket = this;
		console.log("Disconnected From Base Server: ", socket.id);
		setSessionData({
			userData: sessionData.userData,
			isOnline: false,
		});
	}

	//baseSocket.on("redirect", (args: IPayload) => onRedirect(navigate, args));
	/* authSocket.on("Auth:Token_Res", (args: IPayloadCall) => {
		const user: UserData = onAuthTokenRes(args);
		setSessionData({
			userData: user,
			isOnline: true,
		});
	}); */
	/* Should only fire on launch and when user data is changed
	user data is only changed when user signs up, or logs in or out */
	useEffect(() => {
		console.log("Token: ", localStorage.token);
		if (!localStorage.token) {
			console.log("No Token Found");
			navigate(Paths.App.Base);
		} else {
			console.log("Token Found, Attempting Connection with Base Server");
			baseSocket.connect();
			baseSocket.on("connect", onConnect);
			baseSocket.on("connect_error", onConnectError);
			baseSocket.on("disconnect", onDisconnect);
		}

		return () => {
			if (localStorage.token) {
				baseSocket.off("connect", onConnect);
				baseSocket.off("connect_error", onConnectError);
				baseSocket.off("disconnect", onDisconnect);
				baseSocket.disconnect();
			}
		};
	}, [sessionData.userData]);
	return (
		<div className="RootWrapper">
			<Outlet context={[sessionData, setSessionData]} />
		</div>
	);
};
