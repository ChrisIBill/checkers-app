import React, {useEffect, useState} from "react";
import logo from "./logo.svg";
import "./App.css";
import {io, Socket} from "socket.io-client";
import {CheckersPage} from "./pages/CheckersPage";
import {
	CheckersBoardJSON,
	ClientToServerEvents,
	ExpressServerConnectionEvent,
	ServerToClientEvents,
} from "./interfaces";
import {serverGameStateParse} from "./lib/serverHandlers";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
	io("/GameData/Checkers");

function App() {
	const test = 12;
	let args: any[];
	const [checkersServerData, setCheckersServerData] =
		useState<CheckersBoardJSON>();
	const [boardState, setBoardState] = useState<string[]>([]);
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
		console.log(socket.id);
		socket.emit("hello", "hello");
		socket.on("initServerHandshake", (moveDesc, gameState) => {
			if (moveDesc != "start") {
				console.log("Error: Bad Handshake");
			}
			setBoardState(serverGameStateParse(gameState));
		});
	});
	useEffect(() => {}, [boardState]);
	return (
		<div className="App">
			<CheckersPage board={boardState} />
		</div>
	);
}

export default App;
