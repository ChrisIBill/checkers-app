import {useState} from "react";
import {findValidMoves, getReqSelections} from "../lib/checkersClientLogic";
import {
	COMPRESSED_DEFAULT_CHECKERS_BOARD,
	DEFAULT_CHECKERS_BOARD,
	PIECE_TOKENS,
} from "../lib/checkersData";
import {compressGameState} from "../lib/serverHandlers";
import "./CheckersPage.scss";
import {
	CheckersBoardProps,
	PlayerTokens,
	ValidTokens,
	RequiredMoves,
} from "../interfaces";

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
		if (validMoves.length && validMoves.includes(sel)) {
			//If validMoves has been set and includes selection
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
			//do while valid moves for selection available?
			props.onMove(board);
		} else if (
			!props.curPlayer.includes(board[sel]) ||
			(props.reqSels && !props.reqSels.includes(sel))
		) {
			console.log("Invalid Selection.");
			console.log("Required Selections: ", props.reqSels);
		} else {
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
const MoveList = () => {
	return <div id="MoveListWrapper"></div>;
};
const CheckersPage = ({board}: {board: string[]}) => {
	const [gameHistory, setGameHistory] = useState<string[]>([
		COMPRESSED_DEFAULT_CHECKERS_BOARD,
	]); //Stored in compressed format?
	const [gameBoard, setGameBoard] = useState<ValidTokens[]>(
		DEFAULT_CHECKERS_BOARD
	);
	const [status, setStatus] = useState("selecting"); //populate?, playing?, waitingForOtherPlayer?
	const [gameType, setGameType] = useState("PVP"); //local, pvp, AI
	const [curPlayer, setCurPlayer] = useState<number>(0);
	let turnNum = 0;
	function handleMove(board: ValidTokens[]) {
		setGameBoard(board);
		let str = compressGameState(board);
		console.log("Page Board: ", str);
		setGameHistory([...gameHistory, str]);
		setCurPlayer(curPlayer == PIECE_TOKENS.length - 1 ? 0 : curPlayer + 1);
	}
	return (
		<div id="CheckersPageWrapper">
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
