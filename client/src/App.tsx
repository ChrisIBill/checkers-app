import React, {useEffect, useState} from "react";
import logo from "./logo.svg";
import "./App.css";
import {io, Socket} from "socket.io-client";
import {CheckersPage} from "./pages/CheckersPage";
import {
	CheckersBoardJSON,
	ClientToServerEvents,
	ExpressServerConnectionEvent,
	PlayerTokens,
	ServerToClientEvents,
	ValidTokens,
} from "./interfaces/interfaces";
import {zipGameState, unzipGameState} from "./lib/serverHandlers";
import {UserData} from "./interfaces/user";
import {LoginPage} from "./pages/loginPage";
import {
	CheckersGameState,
	CheckersRoomState,
} from "./interfaces/checkersInterfaces";
import {PIECE_TOKENS} from "./lib/checkersData";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
	io("/Games/Checkers");

function App() {
	const test = 12;
	let args: any[];
	const [userData, setUserData] = useState<UserData>();
	const [checkersServerData, setCheckersServerData] =
		useState<CheckersBoardJSON>();
	const [player, setPlayer] = useState<PlayerTokens>();
	const [gameState, setGameState] = useState<CheckersGameState>();
	/* socket.on("connect", () => {
        console.log(socket.id);
    });
    socket.on("error", () => {
        console.log("Error");
    }); */

	/* useEffect(() => {
        request("/GameData/Checkers").then((serverData) =>
            console.log("Connected with server: " + serverData)
        );
    }); */
	socket.on("connect", () => {
		console.log("Connected with Checkers Server: ", socket.id);
		socket.emit("hello", "hello");
		socket.on("initServerHandshake", (moveDesc, gameState) => {
			/* Should use to pass any existing cookies? */
			if (moveDesc != "start") {
				console.log("Error: Bad Handshake");
			}
			//setGameState(unzipGameState(gameState));
		});
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

	return (
		<div className="App">
			{userData ? <CheckersPage game={gameState!} /> : <LoginPage />}
		</div>
	);
}

export default App;
