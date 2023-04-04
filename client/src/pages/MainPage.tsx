import React, {useContext, useEffect, useState} from "react";
import logo from "./logo.svg";
import "../App.css";
import {io, Socket} from "socket.io-client";
import {CheckersPage} from "./CheckersPage";
import {
	CheckersBoardJSON,
	PlayerTokens,
	ValidTokens,
} from "../interfaces/interfaces";
import {zipGameState, unzipGameState} from "../lib/serverHandlers";
import {IUser, UserContextType, UserData} from "../interfaces/userInterfaces";
import {LoginPage} from "./LoginPage";
import {
	CheckersGameState,
	CheckersRoomState,
} from "../interfaces/checkersInterfaces";
import {PIECE_TOKENS} from "../constants/checkersData";
import {Paths} from "../paths/SocketPaths";
import {
	ServerToClientEvents,
	ClientToServerEvents,
	IPayload,
} from "../interfaces/socketInterfaces";
import {UserContext, UserRoles} from "../context/userContext";
import {ErrorBoundary} from "react-error-boundary";
import {UserPanel} from "../components/UserComponents";
import {useNavigate, useOutletContext} from "react-router-dom";
import {PlayGamesButton} from "../components/GameComponents";
import {AuthTypes, ISessionContext} from "../interfaces/SessionInterfaces";
import {AppHeader} from "../components/main-components/header";
import {adminSocket, baseSocket, guestSocket, userSocket} from "../socket";
import {LoginModal} from "../components/main-components/LoginModal";
import {DEFAULT_SESSION_DATA} from "../constants/SessionConsts";
import HttpStatusCode from "../constants/HttpStatusCodes";
/* const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	Paths.App.Base,
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	}
); */

/* Depending on session context, does different things
If offline, give user guest privs
if invalid, need to pass to header to handle login
if user, give regular access
if admin? */
export const MainPage = () => {
	const [sessionContext, setSessionContext]: any = useOutletContext();
	//const sessionContext = sessionData.
	const [userData, setUserData] = useState<UserData>(null);
	const [isOnline, setIsOnline] = useState<boolean>(false);
	const [socket, setSocket] = useState<Socket>();
	console.log("Main Session Context: ", sessionContext);
	const navigate = useNavigate();
	function onPlayGamesClick() {}
	useEffect(() => {
		if (sessionContext !== undefined) {
			if (sessionContext.isOnline) {
				setIsOnline(true);
			}
			if (sessionContext.userData) {
				console.log(
					"Setting Main Page user data: ",
					sessionContext.userData
				);
				setUserData(sessionContext.userData);
				if (sessionContext.userData.role !== UserRoles.Invalid) {
					const role = sessionContext.userData.role;
					console.log("Setting socket: ");
					switch (role) {
						case UserRoles.Guest:
							setSocket(guestSocket);
							break;
						case UserRoles.User:
							setSocket(userSocket);
							break;
						case UserRoles.Admin:
							setSocket(adminSocket);
							break;
						default:
							console.log("Invalid role: ", role);
							break;
					}
				}
			}
		}
	}, [sessionContext]);
	useEffect(() => {
		if (socket) {
			socket.connect();
			socket.on("connect", () => {
				console.log("Connected to server");
				socket.emit(
					"Test:Guest_Listener",
					{status: HttpStatusCode.OK, data: "Hello from client"},
					(res: any) => {
						console.log("Guest Listener Response: ", res);
					}
				);
			});
		}
		return () => {
			if (socket) {
				socket.off("connect");
				socket.disconnect();
			}
		};
	}, [socket]);
	console.log("Session Context: ", sessionContext);
	console.log("User data: ", userData);
	return (
		<div className="App">
			<ErrorBoundary fallback={<div>User Panel Error</div>}>
				<AppHeader userData={userData} />
			</ErrorBoundary>
			<ErrorBoundary fallback={<div>User Panel Error</div>}>
				<PlayGamesButton onClick={onPlayGamesClick} />
			</ErrorBoundary>
			{userData ? (
				userData.role !== UserRoles.Invalid ? null : (
					<LoginModal />
				)
			) : (
				<LoginModal />
			)}
		</div>
	);
};
