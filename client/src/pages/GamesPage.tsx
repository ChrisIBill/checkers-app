import {Box} from "@mui/material";
import {Container} from "@mui/system";
import {useState} from "react";
import {Socket, io} from "socket.io-client";
import {PlayGamesButton} from "../components/GameComponents";
import {DEFAULT_CHECKERS_BOARD} from "../constants/checkersData";
import {GAME_STATUS_TYPES} from "../constants/SocketConsts";
import {
	GameStatusType,
	GameTypes,
	MatchmakingTypes,
} from "../interfaces/GameInterfaces";
import {
	ServerToClientEvents,
	ClientToServerEvents,
} from "../interfaces/socketInterfaces";
import {Paths} from "../paths/SocketPaths";
import {CheckersPage} from "./CheckersPage";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
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
	function onPlayTypeClick(gameSel: GameTypes, vsSel: MatchmakingTypes) {
		/* if (vsSel == "local") {
            setStatus("")
        } */
		setStatus("connecting");
	}
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
					onClick={() => setPlayType("local")}
					text="Local"
					isDisabled={gameType ? false : true}
				/>
				<PlayGamesButton
					onClick={() => setPlayType("computer")}
					text="vs Computer"
					isDisabled={gameType ? false : true}
				/>
				<PlayGamesButton
					onClick={() => setPlayType("pvp")}
					text="vs Player"
					isDisabled={gameType ? false : true}
				/>
			</Box>
		</Container>
	);
};
