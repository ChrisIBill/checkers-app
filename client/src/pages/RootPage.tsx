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
import {UserData} from "../interfaces/user";
import {Paths, PathsSet} from "../paths/SocketPaths";
import {onRedirect} from "../services/socketServices";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	Paths.Base,
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	}
);
const UserContext = createContext<UserData>({});
export const RootPage = () => {
	const [userData, setUserData] = useState<UserData>();
	const user = useContext(UserContext);
	const navigate = useNavigate();
	console.log("Loading Root");
	function onConnect() {
		console.log("Connected With Base Server: ", socket.id);
	}
	function onAuthTokenRes(args: IPayload) {
		if (args.status != HttpStatusCode.OK) {
			console.log("ERROR: BAD HTTP RESPONSE ", args.status);
		} else if (args.data.user && localStorage.getItem("token")) {
			setUserData({
				name: args.data.user.name,
				token: localStorage.token,
			});
			console.log("Setting user data: ", args.data.user);
		} else {
			console.log("No user data in payload: ", args);
			navigate(Paths.Auth.Login);
		}
	}
	socket.on("connect", onConnect);
	socket.on("authTokenValRes", onAuthTokenRes);
	socket.on("redirect", (args: IPayload) => onRedirect(navigate, args));
	return (
		<UserContext.Provider value={userData ?? {}}>
			<Outlet />
		</UserContext.Provider>
	);
};
