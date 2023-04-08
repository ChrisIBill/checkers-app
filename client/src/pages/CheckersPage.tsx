import {useState, useEffect} from "react";
import {findValidMoves, getReqSelections} from "../lib/checkersClientLogic";
import {
	COMPRESSED_DEFAULT_GAME_STATE,
	DEFAULT_CHECKERS_BOARD,
	NUM_PLAYER_TOKEN_TYPES,
	PIECE_TOKENS,
} from "../constants/checkersData";
import {zipGameState, unzipGameState} from "../lib/serverHandlers";
import "./CheckersPage.scss";
import {
	CheckersBoardProps,
	PlayerTokens,
	ValidTokens,
	RequiredMoves,
	CheckersHistoryProps,
} from "../interfaces/interfaces";
import {Socket, io} from "socket.io-client";
import {
	CheckersGameState,
	CompressedCheckersGameState,
} from "../interfaces/checkersInterfaces";
import {
	ClientToServerCheckersEvents,
	ServerToClientCheckersEvents,
} from "../interfaces/socketInterfaces";
import {Paths} from "../paths/SocketPaths";
import HttpStatusCode from "../constants/HttpStatusCodes";
import {onCheckersClientInit} from "../services/gamesServices";
import {
	IPayload,
	CheckersRoomConnectPayload,
} from "../interfaces/socketInterfaces";
import {
	onCheckersClientUpdateRes,
	onCheckersRoomConnect,
	onCheckersUpdateClient,
} from "../services/gamesServices";

const socket: Socket<
	ServerToClientCheckersEvents,
	ClientToServerCheckersEvents
> = io(Paths.Games.Checkers, {
	auth: (cb) => {
		cb({token: localStorage.token});
	},
});
const CheckersSquare = ({
	elem,
	index,
	status,
	onSquareClick,
}: {
	elem: string;
	index: number;
	status: string;
	onSquareClick: () => void;
}) => {
	const selectedStyle = {
		backgroundColor: "brown",
	};
	const validStyle = {
		backgroundColor: "grey",
	};
	let squareStyle = undefined;
	switch (status) {
		case "selected":
			squareStyle = selectedStyle;
			break;
		case "valid":
			squareStyle = validStyle;
	}
	switch (elem) {
		case "E":
			return (
				<div
					className="EmptySquare"
					style={squareStyle}
					onClick={onSquareClick}
				>
					<p>{index}</p>
				</div>
			);
		case "p":
			return (
				<div
					className="FullSquare"
					style={squareStyle}
					onClick={onSquareClick}
				>
					<div
						className="CheckersPiece"
						style={{backgroundColor: "white"}}
					>
						<p>{index}</p>
					</div>
				</div>
			);
		case "k":
			return (
				<div
					className="FullSquare"
					style={squareStyle}
					onClick={onSquareClick}
				>
					<div
						className="CheckersPiece"
						style={{backgroundColor: "white", border: "thick solid gold"}}
					>
						<p>{index}</p>
					</div>
				</div>
			);
		case "P":
			return (
				<div
					className="FullSquare"
					style={squareStyle}
					onClick={onSquareClick}
				>
					<div className="CheckersPiece" style={{backgroundColor: "red"}}>
						<p>{index}</p>
					</div>
				</div>
			);
		case "K":
			return (
				<div
					className="FullSquare"
					style={squareStyle}
					onClick={onSquareClick}
				>
					<div
						className="CheckersPiece"
						style={{backgroundColor: "red", border: "thick solid gold"}}
					>
						<p>{index}</p>
					</div>
				</div>
			);
		default:
			return <div className="EmptySquare">Error</div>;
	}
};

const CheckersBoard: React.FC<CheckersBoardProps> = (props) => {
	const [status, setStatus] = useState("select"); //populate?, select, move, submit
	const [selectIndex, setSelectIndex] = useState<number>(-1);
	const [validMoves, setValidMoves] = useState<number[]>([]);
	const [piecesToTake, setPiecesToTake] = useState<number[] | undefined>([]);
	console.log("ReqSels: ", props.reqSels);
	//let validMoves: number[] = [];
	let board = props.board;
	let isFlippedRow = true;
	function handleSquareClick(sel: number) {
		console.log("click: ", sel);
		console.log("Status: ", status);
		if (validMoves.length && validMoves.includes(sel)) {
			//If validMoves has been set and includes selection
			let jump = "move";
			setStatus(jump);
			if (jump == "move") {
				const index = validMoves.indexOf(sel);
				console.log("valid move");
				[board[sel], board[selectIndex]] = [board[selectIndex], board[sel]];
				if (piecesToTake && piecesToTake[index]) {
					//if jump
					const remIndex = piecesToTake[index];
					board[remIndex] = "E";
				}
				//Logic for Kinging
				board[sel] =
					board[sel] == "p" && sel >= 28
						? "k"
						: board[sel] == "P" && sel <= 3
						? "K"
						: board[sel];
				if (piecesToTake) {
					const [moves, canTake] = findValidMoves(board, sel);
					if (canTake) {
						setPiecesToTake(canTake);
						setValidMoves(moves);
					}
				} else {
					jump = "select";
					setStatus("select");
				}
			}
			//do while valid moves for selection available?
			props.onMove(board);
		} else if (
			!props.playerTokens?.includes(board[sel]) ||
			(props.reqSels && !props.reqSels.includes(sel))
		) {
			console.log("Invalid Selection.");
			console.log("Required Selections: ", props.reqSels);
		} else if (status == "select") {
			//Selection is valid
			console.log("Valid Selection.");
			setSelectIndex(sel);
			const [valid, canTake] = findValidMoves(board, sel);
			setPiecesToTake(canTake);
			console.log("Valid Moves: ", valid);
			setValidMoves(valid);
		}
	}
	const GameBoard = board.map((elem, index) => {
		if (index % 4 == 0) {
			isFlippedRow = !isFlippedRow;
		}
		let squareStatus = "default";
		if (index == selectIndex) {
			squareStatus = "selected";
		} else if (validMoves.includes(index)) {
			squareStatus = "valid";
		}

		if (isFlippedRow) {
			return (
				<div className="CheckersSquares" key={index}>
					<CheckersSquare
						elem={elem}
						index={index}
						status={squareStatus}
						onSquareClick={() => handleSquareClick(index)}
					/>
					<div className="DeadSquare"></div>
				</div>
			);
		}
		return (
			<div className="CheckersSquares" key={index}>
				<div className="DeadSquare"></div>
				<CheckersSquare
					elem={elem}
					index={index}
					status={squareStatus}
					onSquareClick={() => handleSquareClick(index)}
				/>
			</div>
		);
	});
	console.log(GameBoard);
	return <ul id="CheckersBoard">{GameBoard}</ul>;
};
const GameHistory: React.FC<CheckersHistoryProps> = (props) => {
	const histList = props.history.map((elem, index) => {
		return (
			<div key="index">
				<li onClick={() => props.onElementClick(props.history[index])}>
					{index}
				</li>
			</div>
		);
	});
	return <div id="MoveListWrapper">{histList}</div>;
};
export const CheckersWindow = ({
	roomID,
	onRoomDataChange,
}: {
	roomID: string;
	onRoomDataChange: (args: any) => void;
}) => {
	const [gameHistory, setGameHistory] = useState<
		CompressedCheckersGameState[]
	>([COMPRESSED_DEFAULT_GAME_STATE]); //Stored in compressed format?
	const [gameBoard, setGameBoard] = useState<ValidTokens[]>();
	const [status, setStatus] = useState("loading"); //loading, init, waiting, playing, over, error
	const [playerTokens, setPlayerTokens] = useState<PlayerTokens>();
	const [isCurPlayer, setIsCurPlayer] = useState<boolean>(false);

	socket.on("checkersClientInit", (args: IPayload) => {
		console.log("Received checkersClientInit", args);
		const boardState = onCheckersClientInit(args);
		if (boardState) {
			console.log("Board State: ", boardState);
			setGameBoard(boardState);
			setStatus("init");
		} else {
			console.log("Error initializing game.");
		}
	});
	socket.on("checkersRoomConnect", (args: CheckersRoomConnectPayload) => {
		const gameState = onCheckersRoomConnect(args);
		if (gameState) {
			setGameBoard(gameState.boardState);
			setPlayerTokens(gameState.player);
			setStatus(gameState.status);
		} else {
			console.log("Error connecting to room.");
		}
	});
	socket.on("checkersUpdateClient", (args: IPayload) => {
		setPlayerTokens(onCheckersUpdateClient(args));
	});
	socket.on("checkersClientUpdateRes", onCheckersClientUpdateRes);
	const [turnNum, setTurnNum] = useState<number>(0);
	/* 	function handleHistoryClick(compGameState: CompressedCheckersGameState) {
		const boardState = unzipGameState(compGameState.boardState);
		setGameBoard(boardState);
		setCurPlayer(compGameState.curPlayer);
		//setTurnNum(turn);
	} */
	function handleMove(board: ValidTokens[]) {
		socket.emit(
			"checkersUpdateServer",
			zipGameState(board),
			(res: HttpStatusCode) => {
				if (res == HttpStatusCode.OK) {
					console.log("Move Successful.");
				} else {
					console.log("Move Failed.");
				}
			}
		);
		setGameBoard(board);
	}
	useEffect(() => {
		if (status == "loading") {
			console.log("Emitting checkersClientLoaded");
			socket.emit("checkersClientLoaded", {status: HttpStatusCode.OK});
		} else if (status == "init") {
			console.log("Emitting checkersClientReady");
			socket.emit("checkersClientReady", {status: HttpStatusCode.OK});
		}
	});
	useEffect(() => {
		/* socket.emit("Room:Join_Req", {roomID})
		socket.on("Room:ClientConnect", ) */
	}, []);
	return (
		<div id="CheckersPageWrapper">
			{/* <div id="CheckersHistoryWrapper">
				<GameHistory
					history={gameHistory}
					onElementClick={handleHistoryClick}
				/>
			</div> */}
			<div id="CheckersBoardWrapper">
				{status == "loading" ? (
					<div>Initializing...</div>
				) : (
					<CheckersBoard
						board={gameBoard!}
						isCurPlayer={true}
						playerTokens={playerTokens}
						onMove={handleMove}
						/* reqSels={getReqSelections(PIECE_TOKENS[curPlayer], gameBoard)} */
					/>
				)}
			</div>
		</div>
	);
};
/* const CheckersPage2 = () => {
	const [game, setGame] = useState<CheckersGameState>();
	const [boardState, setBoardState] = useState<ValidTokens[]>([]);
	const [player, setPlayer] = useState<PlayerTokens>();
	const [isCurPlayer, setIsCurPlayer] = useState<boolean>(false);
	socket.on("checkersRoomConnect", onCheckersRoomConnect);
	socket.on("checkersServerUpdate", (args: IPayload) => {
		setPlayer(onCheckersServerUpdate(args));
	});
	socket.on("checkersClientUpdateRes", onCheckersClientUpdateRes);
	return (
		<div id="CheckersPage">
			{game ? <CheckersApp game={game} /> : <div>Loading...</div>}
		</div>
	);
}; */
