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
import {IUser, UserContextType, UserData} from "./interfaces/userInterfaces";
import {LoginPage} from "./pages/LoginPage";
import {
	CheckersGameState,
	CheckersRoomState,
} from "./interfaces/checkersInterfaces";
import {PIECE_TOKENS} from "./constants/checkersData";
import {Paths} from "./paths/SocketPaths";
import {
	ServerToClientEvents,
	ClientToServerEvents,
	IPayload,
} from "./interfaces/socketInterfaces";
import {UserContext} from "./context/userContext";
import {ErrorBoundary} from "react-error-boundary";
import {UserPanel} from "./components/UserComponents";
import {useNavigate, useOutletContext} from "react-router-dom";
import { PlayGamesButton } from "./components/GameComponents";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	Paths.App.Base,
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	}
);

function App() {
	const test = 12;
	let args: any[];
	//User Info
	const userContext = useOutletContext<UserContextType>();
	const userData: UserData = userContext.userData;
	const navigate = useNavigate();
	const [userToken, setUserToken] = useState<string>();
	const [checkersServerData, setCheckersServerData] =
		useState<CheckersBoardJSON>();
	const [player, setPlayer] = useState<PlayerTokens>();
	const [gameState, setGameState] = useState<CheckersGameState>();
	console.log("In App");
	if (userData == undefined) {
		console.log("ERROR: User data is undefined");
	}
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
	function onPlayCheckersClick() {
		navigate(Paths.Games.Base)
	}
	console.log("User Context: ", userContext);
	console.log("User data: ", userData);
	return (
		<ErrorBoundary fallback={<div>Something went wrong in App Page</div>}>
			<div className="App">
				<ErrorBoundary fallback={<div>User Panel Error</div>}>
					<UserPanel userData={userData} />
				</ErrorBoundary>
				<ErrorBoundary fallback={<div>User Panel Error</div>}>
					<PlayGamesButton onClick={onPlayCheckersClick} />
				</ErrorBoundary>
				{/* {userData ? <CheckersPage game={gameState!} /> : <LoginPage />} */}
			</div>
		</ErrorBoundary>
	);
}

export default App;
