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
import {baseSocket} from "../socket";
import {LoginModal} from "../components/main-components/LoginModal";
import {DEFAULT_SESSION_DATA} from "../constants/SessionConsts";
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
	//console.log("Session Context: ", sessionContext);
	/* if (sessionContext) {
		if (sessionContext.isOnline) {
			setIsOnline(true);
		}
		if (sessionContext.userData) {
			setUserData(sessionContext.userData);
		}
	} */
	const role: UserRoles =
		userData !== null ? userData.role : UserRoles.Invalid;
	if (!isOnline) {
	}
	const navigate = useNavigate();
	console.log("In App");
	if (userData == undefined) {
		console.log("ERROR: User data is undefined");
	}
	/* baseSocket.on("connect", () => {
		console.log("Connected with App Server: ", baseSocket.id);
		//socket.emit("authTokenValidation", localStorage.token);
		//If auth, should move forward
		//else should login
	}); */
	function onPlayGamesClick() {
		navigate(Paths.Games.Base);
	}

	useEffect(() => {
		if (sessionContext !== undefined) {
			if (sessionContext.isOnline) {
				setIsOnline(true);
			}
			if (sessionContext.userData) {
				setUserData(sessionContext.userData);
			}
		}
	}, [sessionContext]);
	console.log("Session Context: ", sessionContext);
	console.log("User data: ", userData);
	return (
		<div className="App">
			<ErrorBoundary fallback={<div>User Panel Error</div>}>
				<AppHeader />
			</ErrorBoundary>
			<ErrorBoundary fallback={<div>User Panel Error</div>}>
				<PlayGamesButton onClick={onPlayGamesClick} />
			</ErrorBoundary>
			{role == UserRoles.Invalid ? <LoginModal /> : null}
		</div>
	);
};
