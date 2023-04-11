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
import {IRoomInfo, IRoomPayload} from "../interfaces/RoomInterfaces";

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
export type CheckersBoardStatusTypes =
	| "loading"
	| "waiting"
	| "select"
	| "move"
	| "submit"
	| "finished";
const CheckersBoard: React.FC<CheckersBoardProps> = (props) => {
	const {onMove, gameState} = props;
	const {boardState, validSels, reqSels, isCurPlayer, playerTokens, status} =
		gameState;
	const [curBoard, setCurBoard] = useState<ValidTokens[]>(boardState);
	const [boardStatus, setBoardStatus] =
		useState<CheckersBoardStatusTypes>("loading"); //populate?, select, move, submit
	const [selectIndex, setSelectIndex] = useState<number>(-1);
	const [validMoves, setValidMoves] = useState<number[]>([]);
	const [piecesToTake, setPiecesToTake] = useState<number[] | undefined>([]);
	const [playerPieces, setPlayerPieces] = useState<PlayerTokens>();
	if (playerTokens && !playerPieces) {
		setPlayerPieces(playerTokens);
	}
	if (isCurPlayer && ["waiting", "loading"].includes(boardStatus)) {
		setBoardStatus("select");
	}
	let board = curBoard;
	let isFlippedRow = true;
	function handleSquareClick(sel: number) {
		console.log("click: ", sel);
		console.log("Status: ", boardStatus);
		if (!isCurPlayer || !playerPieces) {
			console.log("Not your turn!");
			return;
		}
		if (!["select", "move"].includes(boardStatus)) {
			console.log("Cannot select/move at this time!", boardStatus);
			return;
		}
		if (boardStatus == "select") {
			if (!playerPieces.includes(board[sel])) {
				console.log("Not your piece!", board[sel], playerPieces);
				return;
			}
			const [moves, canTake] = findValidMoves(board, sel);
			if (!moves) {
				console.log("No valid moves!");
				return;
			}
			setSelectIndex(sel);
			setValidMoves(moves);
			if (canTake) {
				setPiecesToTake(canTake);
			}
			setBoardStatus("move");
		}
		if (boardStatus == "move") {
			if (!validMoves.includes(sel)) {
				console.log("Not a valid move!");
				return;
			}
			if (!validMoves.length) {
				console.log("BAD_ERROR: No valid moves while in move state!");
				return;
			}
			if (!validMoves.includes(sel)) {
				console.log("Not a valid move!");
				return;
			}
			const index = validMoves.indexOf(sel);
			console.log("valid move");
			[board[sel], board[selectIndex]] = [board[selectIndex], board[sel]];
			console.log("board1: ", board);
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
			if (piecesToTake && piecesToTake.length > 0) {
				console.log("piecesToTake: ", piecesToTake);
				const [moves, canTake] = findValidMoves(board, sel);
				if (moves && canTake) {
					console.log("More moves! Continuing...");
					setSelectIndex(sel);
					setValidMoves(moves);
					setPiecesToTake(canTake);
					setBoardStatus("move");
					return;
				} else {
					console.log("BAD_ERROR: No more moves! While in move state!");
					return;
				}
			} else {
				console.log("No more moves! Submitting...");
				setSelectIndex(-1);
				setValidMoves([]);
				setPiecesToTake(undefined);
				setBoardStatus("submit");
				onMove(board);
				return;
			}
		}
	}
	console.log("board2: ", board);
	const GameBoard = curBoard.map((elem, index) => {
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
	windowRoomID,
	onRoomStatusChange,
}: {
	windowRoomID: string;
	onRoomStatusChange: (args: any) => void;
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
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [status, setStatus] = useState("loading"); //loading, init, waiting, playing, over, error
	const [playerTokens, setPlayerTokens] = useState<PlayerTokens>();
	const [isCurPlayer, setIsCurPlayer] = useState<boolean>(false);
	const [turnNum, setTurnNum] = useState<number>(0);
	const socketRoomType = ROOM_TYPES.checkers;

	function validateCheckersPayload(roomInfo: IRoomInfo) {
		const {roomID, roomType} = roomInfo;
		if (roomID != windowRoomID) throw new Error("Bad RoomID");
		if (roomType != socketRoomType) throw new Error("Bad RoomType");
		else return true;
	}
	if (!socket || !userData) {
		throw new Error("Bad Error: Socket/User Data not initialized.");
	}
	function handleMove(board: ValidTokens[]) {
		if (socket && socket.connected) {
			socket.emit("Room:Update_Server", {
				roomInfo: {roomID: windowRoomID, roomType: socketRoomType},
				data: {
					boardState: zipGameState(board),
					moves: [],
				},
			});
		} else {
			console.log("Error: Socket not connected!");
		}
	}
	useEffect(() => {
		console.log("Checkers Page RoomID: ", windowRoomID);
		socket.emit(
			"Room:Join_Req",
			{socketRoomType, roomID: windowRoomID},
			(res: ICheckersRoomJoinPayload) => {
				console.log("Checkers Join Response: ", res);
				if (res.status != HttpStatusCode.OK) {
					console.log("Error Joining Room: ", res.status);
					setStatus("error");
				}
				if (res.roomID == windowRoomID) {
					setGameState({
						status: res.roomStatus,
						boardState: unzipGameState(res.boardState),
					});
				}
			}
		);
		socket.on(
			"Room:Join_Res",
			(payload: any, cb: (res: HttpStatusCode) => void) => {
				console.log("Room Join Response: ", payload);
				const {roomID, roomType} = payload.roomInfo;
				const data = payload.data;
				if (roomID != windowRoomID || roomType != socketRoomType) {
					cb(HttpStatusCode.BAD_REQUEST);
					return;
				}
				try {
					console.log("Initial Room Data", payload.data);
					const data = payload.data;
					console.log(data.status, data.boardState);
					setGameState({
						status: data.status,
						boardState: unzipGameState(data.boardState),
					});
				} catch (err) {
					console.log("BAD_ERROR Joining Room: ", err);
					setStatus("error");
				} finally {
					cb(HttpStatusCode.OK);
				}
			}
		);
		socket.on("Room:Init", (args: IRoomPayload, cb: (res: any) => void) => {
			console.log("Received Room Init: ", args);
			try {
				validateCheckersPayload(args.roomInfo);
			} catch (err) {
				console.log("BAD_ERROR Updating Room Members: ", err);
				cb(HttpStatusCode.BAD_REQUEST);
			}
			const data = args.data;
			const isCurPlayer = data.curPlayer == userData.name;
			const playerTokens = isCurPlayer ? "pk" : "PK";
			const initState: CheckersGameState = {
				boardState: unzipGameState(data.boardState),
				validSels: data.validSels,
				isCurPlayer: isCurPlayer,
				playerTokens: playerTokens,
				status: data.status,
			};
			console.log("Init State: ", initState);
			setGameState(initState);
		});
		socket.on(
			"Room:Update_Members",
			(args: IRoomPayload, cb: (res: any) => void) => {
				console.log("Room Members Updated", args);
			}
		);
		return () => {
			socket.off("Room:Join_Res");
			socket.off("Room:Init");
			socket.off("Room:Update_Members");
			socket.emit("Room:Leave_Req", {socketRoomType, roomID: windowRoomID});
		};
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
