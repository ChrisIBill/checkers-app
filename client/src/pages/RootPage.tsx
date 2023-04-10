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
import {ISessionContext} from "../interfaces/SessionInterfaces";
import {DEFAULT_SESSION_DATA} from "../constants/SessionConsts";
import {getAuthSocket} from "../lib/SocketLib";

const baseSocket: Socket<BaseServerToClientEvents, ClientToServerEvents> = io(
	"/",
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	}
);
export const RootPage = () => {
	const [userData, setUserData] = useState<IUser | null>();
	const [token, setToken] = useState<string | undefined>(localStorage.token);
	const [sessionData, setSessionData] =
		useState<ISessionContext>(DEFAULT_SESSION_DATA);
	const navigate = useNavigate();

	function onConnect(this: Socket) {
		const socket = this;
		console.log("Connected With Base Server: ", socket.id);
		/* setSessionData({
			userData: null,
			isOnline: true,
		}); */
		socket.on("Auth:Token_Res", (args: IPayload, cb: (res: any) => void) => {
			console.log("Token Res: ", args);
			const user: UserData = args.data ? args.data : null;
			if (!user) {
				console.log("No User Data");
				cb({
					statusCode: HttpStatusCode.UNAUTHORIZED,
				});
				return;
			}
			console.log("User: ", user);
			setSessionData({
				userData: user,
				isOnline: true,
				socket: socket,
			});
			cb({
				statusCode: HttpStatusCode.OK,
			});
		});
	}

	function onDisconnect(this: Socket) {
		const socket = this;
		console.log("Disconnected From Base Server: ", socket.id);
	}

	/* Should only fire on launch and when user data is changed
	user data is only changed when user signs up, or logs in or out */
	useEffect(() => {
		function checkForToken() {
			console.log("Checking For Token");
			const item = localStorage.getItem("token");
			if (item) {
				setToken(item);
			}
		}
		window.addEventListener("storage", checkForToken);
		return () => {
			window.removeEventListener("storage", checkForToken);
		};
	}, []);

	useEffect(() => {
		if (sessionData.userData) {
			console.log("User Data Found: ", sessionData.userData);
			navigate(Paths.Games.Base);
		} else if (token) {
			console.log("Token Found, Attempting Connection with Base Server");
			baseSocket.connect();
			baseSocket.on("connect", onConnect);
			baseSocket.on("connect_error", onConnectError);
			baseSocket.on("disconnect", onDisconnect);
		} else if (!token) {
			console.log("No Token Found");
		}
		return () => {
			baseSocket.off("connect", onConnect);
			baseSocket.off("connect_error", onConnectError);
			baseSocket.off("disconnect", onDisconnect);
			baseSocket.disconnect();
		};
	}, [token]);
	return (
		<div className="RootWrapper">
			<Outlet context={[sessionData, setSessionData]} />
		</div>
	);
};
