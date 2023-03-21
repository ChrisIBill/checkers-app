import React, {useContext, useEffect, useState} from "react";
import logo from "./logo.svg";
import "./App.css";
import {io, Socket} from "socket.io-client";
import {CheckersPage} from "./pages/CheckersPage";
import {
	CheckersBoardJSON,
	PlayerTokens,
	ValidTokens,
} from "./interfaces/interfaces";
import {zipGameState, unzipGameState} from "./lib/serverHandlers";
import {UserData} from "./interfaces/user";
import {LoginPage} from "./pages/LoginPage";
import {
	CheckersGameState,
	CheckersRoomState,
} from "./interfaces/checkersInterfaces";
import {PIECE_TOKENS} from "./lib/checkersData";
import {Paths} from "./paths/SocketPaths";
import {
	ServerToClientEvents,
	ClientToServerEvents,
	IPayload,
} from "./interfaces/socketInterfaces";
import {UserContext} from "./context/userContext";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	Paths.App,
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	}
);

function App() {
	const test = 12;
	let args: any[];
	const user = useContext(UserContext);
	const [userData, setUserData] = useState<UserData>();
	const [userToken, setUserToken] = useState<string>();
	const [checkersServerData, setCheckersServerData] =
		useState<CheckersBoardJSON>();
	const [player, setPlayer] = useState<PlayerTokens>();
	const [gameState, setGameState] = useState<CheckersGameState>();

	socket.on("connect", () => {
		console.log("Connected with App Server: ", socket.id);
		//socket.emit("authTokenValidation", localStorage.token);
		//If auth, should move forward
		//else should login
		socket.on("checkersRoomInit", (gameState) => {
			console.log("init: ", gameState);
			const init: CheckersRoomState = JSON.parse(gameState);
			setPlayer(PIECE_TOKENS[init.player]);
			setGameState({
				roomID: init.roomID,
				player: PIECE_TOKENS[init.player],
				status: init.status,
				boardState: unzipGameState(init.boardState),
			});
		});
	});
	console.log("User Context: ", user);
	return (
		<div className="App">
			{user}
			{/* {userData ? <CheckersPage game={gameState!} /> : <LoginPage />} */}
		</div>
	);
}

export default App;
