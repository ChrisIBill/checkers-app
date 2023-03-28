import {Box} from "@mui/material";
import {Container} from "@mui/system";
import {useState} from "react";
import {Outlet, redirect, useNavigate} from "react-router-dom";
import {Socket, io} from "socket.io-client";
import {PlayGamesButton} from "../components/GameComponents";
import {DEFAULT_CHECKERS_BOARD} from "../constants/checkersData";
import HttpStatusCode from "../constants/HttpStatusCodes";
import {GAME_STATUS_TYPES} from "../constants/SocketConsts";
import {
	GameStatusType,
	GameTypes,
	MatchmakingTypes,
} from "../interfaces/GameInterfaces";
import {
	CheckersRoomConnectPayload,
	ClientToServerGameEvents,
	ServerToClientGameEvents,
} from "../interfaces/socketInterfaces";
import {Paths} from "../paths/SocketPaths";
import {
	onCheckersRoomConnect,
	onJoinGameRoomRes,
	onLeaveGameRoomRes,
} from "../services/gamesServices";
import {CheckersPage} from "./CheckersPage";

const socket: Socket<ServerToClientGameEvents, ClientToServerGameEvents> = io(
	Paths.Games.Base,
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	}
);
/* 
Ask User How they would like to play (local, ai or pvp)
Emit room req w game and choice

*/
function displayGameSelection(stat: GameStatusType) {
	if (GAME_STATUS_TYPES.slice(0, 3).includes(stat)) return "";
	else return "None";
}
export const GamesPage = () => {
	/* Need to implement status state in way that grabs game type and room id from url if it matches and is legal */
	const [status, setStatus] = useState<GameStatusType>("selecting");
	const [gameType, setGameType] = useState<GameTypes>();
	const [playType, setPlayType] = useState<MatchmakingTypes>();
	const navigate = useNavigate();
	function onPlayTypeClick(vsSel: MatchmakingTypes) {
		/* if (vsSel == "local") {
            setStatus("")
        } */
		setStatus("connecting");
		setPlayType(vsSel);
		socket.emit(
			"gamesJoinRoomReq",
			{
				gameType: gameType,
				matchmakingType: vsSel,
			},
			(res: any) => {
				console.log("Games Join Room Res: ", res);
				if (res.status == HttpStatusCode.OK) {
					console.log("Found Room");
					setStatus("connecting");
				} else {
					console.log("ERROR finding room");
					setStatus("selecting");
				}
			}
		);
	}
	socket.on("connect", () => {
		console.log("Connected to Games Page");
		console.log("Socket ID: ", socket.id);
	});
	socket.on("gamesJoinRoomRes", (args: any) => {
		console.log("Found room data: ", args);
		console.log("Path: ", args.data.path);
		navigate(args.data.path);
	});
	socket.on("gamesLeaveRoomRes", onLeaveGameRoomRes);
	console.log("Game Page States: ", status, gameType, playType);
	return (
		<Container sx={{display: () => displayGameSelection(status)}}>
			<Box>
				<PlayGamesButton
					onClick={() => setGameType("checkers")}
					text="Checkers"
				/>
			</Box>
			<Box>
				<PlayGamesButton
					onClick={() => onPlayTypeClick("local")}
					text="Local"
					isDisabled={gameType ? false : true}
				/>
				<PlayGamesButton
					onClick={() => onPlayTypeClick("computer")}
					text="vs Computer"
					isDisabled={gameType ? false : true}
				/>
				<PlayGamesButton
					onClick={() => onPlayTypeClick("pvp")}
					text="vs Player"
					isDisabled={gameType ? false : true}
				/>
			</Box>
			<Outlet />
		</Container>
	);
};
