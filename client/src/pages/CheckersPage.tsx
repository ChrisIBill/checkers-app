import {useState} from "react";
import {findValidMoves, getReqSelections} from "../lib/checkersClientLogic";
import {
	COMPRESSED_DEFAULT_GAME_STATE,
	DEFAULT_CHECKERS_BOARD,
	NUM_PLAYER_TOKEN_TYPES,
	PIECE_TOKENS,
} from "../lib/checkersData";
import {zipGameState, unzipGameState} from "../lib/serverHandlers";
import "./CheckersPage.scss";
import {
	CheckersBoardProps,
	PlayerTokens,
	ValidTokens,
	RequiredMoves,
	CheckersHistoryProps,
	ServerToClientEvents,
	ClientToServerEvents,
} from "../interfaces/interfaces";
import {Socket, io} from "socket.io-client";
import {
	CheckersGameState,
	CompressedCheckersGameState,
} from "../interfaces/checkersInterfaces";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
	io("/Games/Checkers");
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
			!props.curPlayer.includes(board[sel]) ||
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
const CheckersPage = ({game}: {game: CheckersGameState}) => {
	const [gameHistory, setGameHistory] = useState<
		CompressedCheckersGameState[]
	>([COMPRESSED_DEFAULT_GAME_STATE]); //Stored in compressed format?
	const [gameBoard, setGameBoard] = useState<ValidTokens[]>(game.boardState);
	const [status, setStatus] = useState("selecting"); //populate?, playing?, waitingForOtherPlayer?
	const [gameType, setGameType] = useState("PVP"); //local, pvp, AI
	const [curPlayer, setCurPlayer] = useState<number>(
		PIECE_TOKENS.indexOf(game.player)
	);
	const [turnNum, setTurnNum] = useState<number>(0);
	function handleHistoryClick(compGameState: CompressedCheckersGameState) {
		const boardState = unzipGameState(compGameState.boardState);
		setGameBoard(boardState);
		setCurPlayer(compGameState.curPlayer);
		//setTurnNum(turn);
	}
	function handleMove(board: ValidTokens[]) {
		setGameBoard(board);
		const turn: CompressedCheckersGameState = {
			boardState: zipGameState(board),
			curPlayer: curPlayer,
		};
		console.log("Compressed Game State: ", turn);
		setGameHistory([...gameHistory, turn]);
		setCurPlayer(curPlayer == PIECE_TOKENS.length - 1 ? 0 : curPlayer + 1);
	}
	return (
		<div id="CheckersPageWrapper">
			{/* <div id="CheckersHistoryWrapper">
				<GameHistory
					history={gameHistory}
					onElementClick={handleHistoryClick}
				/>
			</div> */}
			<div id="CheckersBoardWrapper">
				<CheckersBoard
					board={gameBoard}
					curPlayer={PIECE_TOKENS[curPlayer]}
					onMove={handleMove}
					reqSels={getReqSelections(PIECE_TOKENS[curPlayer], gameBoard)}
				/>
			</div>
		</div>
	);
};

export {CheckersPage};
