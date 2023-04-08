import {useState, useEffect} from "react";
import {findValidMoves, getReqSelections} from "../lib/checkersClientLogic";
import {
	COMPRESSED_DEFAULT_GAME_STATE,
	DEFAULT_CHECKERS_BOARD,
	EMPTY_CHECKERS_BOARD,
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
	ICheckersRoomInitPayload,
	ICheckersRoomUpdatePayload,
	ICheckersRoomJoinPayload,
} from "../interfaces/checkersInterfaces";
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
import {useOutletContext} from "react-router-dom";
import {useSessionContextType} from "../interfaces/SessionInterfaces";
import {ROOM_TYPES} from "../constants/RoomConsts";

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

/* const CheckersBoard: React.FC<CheckersBoardProps> = (props) => {
	const { onMove, gameState } = props;
	const { boardState, validSels, isCurPlayer, playerTokens } = gameState;

	const [selectIndex, setSelectIndex] = useState<number>(-1);
	const [validMoves, setValidMoves] = useState<number[]>([]);
	
	function handleSquareClick(index: number) {
		if (validSels)
	}

	let isFlippedRow = false;
	const GameBoard = boardState.map((elem, index) => {
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
	return <ul id="CheckersBoard">{GameBoard}</ul>; */

const CheckersBoard: React.FC<CheckersBoardProps> = (props) => {
	const {onMove, gameState} = props;
	const {boardState, validSels, reqSels, isCurPlayer, playerTokens} =
		gameState;
	const [boardStatus, setBoardStatus] = useState("select"); //populate?, select, move, submit
	const [selectIndex, setSelectIndex] = useState<number>(-1);
	const [validMoves, setValidMoves] = useState<number[]>([]);
	const [piecesToTake, setPiecesToTake] = useState<number[] | undefined>([]);
	const [playerPieces, setPlayerPieces] = useState<PlayerTokens>();
	if (playerTokens) {
		setPlayerPieces(playerTokens);
	}
	console.log("ReqSels: ", reqSels);
	//let validMoves: number[] = [];
	let board = boardState;
	let isFlippedRow = true;
	function handleSquareClick(sel: number) {
		console.log("click: ", sel);
		console.log("Status: ", boardStatus);
		if (!isCurPlayer) return;
		if (validMoves.length && validMoves.includes(sel)) {
			//If validMoves has been set and includes selection
			let jump = "move";
			setBoardStatus(jump);
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
					setBoardStatus("select");
				}
			}
			//do while valid moves for selection available?
			props.onMove(board);
		} else if (
			playerPieces?.includes(board[sel]) ||
			(reqSels && !reqSels.includes(sel))
		) {
			console.log("Invalid Selection.");
			console.log("Required Selections: ", reqSels);
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
	const [sessionContext, setSessionContext] =
		useOutletContext<useSessionContextType>();
	const {userData, isOnline, socket} = sessionContext;
	const [gameState, setGameState] = useState<CheckersGameState>();
	const [gameHistory, setGameHistory] = useState<
		CompressedCheckersGameState[]
	>([COMPRESSED_DEFAULT_GAME_STATE]); //Stored in compressed format?
	const [gameBoard, setGameBoard] =
		useState<ValidTokens[]>(EMPTY_CHECKERS_BOARD);
	const [status, setStatus] = useState("loading"); //loading, init, waiting, playing, over, error
	const [playerTokens, setPlayerTokens] = useState<PlayerTokens>();
	const [isCurPlayer, setIsCurPlayer] = useState<boolean>(false);
	const socketRoomType = ROOM_TYPES.checkers;

	if (!socket) {
		throw new Error("Bad Error: Socket not initialized.");
	}
	const [turnNum, setTurnNum] = useState<number>(0);
	function handleMove(board: ValidTokens[]) {
		setGameBoard(board);
	}
	useEffect(() => {
		console.log("Checkers Page RoomID: ", roomID);
		socket.emit(
			"Room:Join_Req",
			{socketRoomType, roomID},
			(res: ICheckersRoomJoinPayload) => {
				console.log("Checkers Join Response: ", res);
				if (res.status != HttpStatusCode.OK) {
					console.log("Error Joining Room: ", res.status);
					setStatus("error");
				}
				if (res.roomID == roomID) {
					setGameState({
						status: res.roomStatus,
						boardState: unzipGameState(res.boardState),
					});
				}
			}
		);
		socket.on("Room:Init", (data: any, cb: (res: HttpStatusCode) => void) => {
			console.log("Room Initialized", data);
			cb(HttpStatusCode.OK);
		});
		socket.on("Room:Update_Members", (data: any, cb: (res: any) => void) => {
			console.log("Room Members Updated", data);
			cb(HttpStatusCode.OK);
		});
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
				{!gameState ? (
					<div>Initializing...</div>
				) : (
					<CheckersBoard
						onMove={handleMove}
						gameState={gameState}
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
