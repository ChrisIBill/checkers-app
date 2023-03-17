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
import {LoginPage} from "./pages/LoginPage";
import {
	CheckersGameState,
	CheckersRoomState,
} from "./interfaces/checkersInterfaces";
import {PIECE_TOKENS} from "./lib/checkersData";
import {Paths} from "./paths/SocketPaths";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	Paths.Base,
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	}
);

function App() {
	const test = 12;
	let args: any[];
	const [userData, setUserData] = useState<UserData>();
	const [userToken, setUserToken] = useState<string>();
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
	/* const initHandshake = (token: string) => {
		localStorage.setItem("token", token);
	}; */
	socket.on("connect", () => {
		console.log("Connected with Server: ", socket.id);
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
	socket.on("redirect", (red) => {
		console.log("Redirecting: ", red);
	});
	socket.on("authTokenValidation", (...args) => {
		console.log("Valid Token Received In App: ", args);
		if (args[0] > 0) {
			setUserData(args[1]);
		}
	});

	return (
		<div className="App">
			{userData ? <CheckersPage game={gameState!} /> : <LoginPage />}
		</div>
	);
}

export default App;
