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
import {UserContext} from "../context/userContext";
import {ErrorBoundary} from "react-error-boundary";
import {UserPanel} from "../components/UserComponents";
import {useNavigate, useOutletContext} from "react-router-dom";
import {PlayGamesButton} from "../components/GameComponents";
import {SessionContext} from "../context/SessionContext";
import {ISessionData} from "../interfaces/SessionInterfaces";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	Paths.App.Base,
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	}
);

export const MainPage = () => {
	const sessionContext = useContext(SessionContext);
	const userData = sessionContext.userData;
	const isOnline = sessionContext.isOnline;
	const authType = sessionContext.authType;
	const navigate = useNavigate();
	console.log("In App");
	if (userData == undefined) {
		console.log("ERROR: User data is undefined");
	}
	socket.on("connect", () => {
		console.log("Connected with App Server: ", socket.id);
		//socket.emit("authTokenValidation", localStorage.token);
		//If auth, should move forward
		//else should login
	});
	function onPlayGamesClick() {
		navigate(Paths.Games.Base);
	}
	console.log("Session Context: ", sessionContext);
	console.log("User data: ", userData);
	return (
		<ErrorBoundary fallback={<div>Something went wrong in App Page</div>}>
			<div className="App">
				<ErrorBoundary fallback={<div>User Panel Error</div>}>
					<UserPanel userData={userData} />
				</ErrorBoundary>
				<ErrorBoundary fallback={<div>User Panel Error</div>}>
					<PlayGamesButton onClick={onPlayGamesClick} />
				</ErrorBoundary>
			</div>
		</ErrorBoundary>
	);
};
