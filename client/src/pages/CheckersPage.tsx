import {useState} from "react";
import {findValidMoves} from "../lib/checkersClientLogic";
import {
	COMPRESSED_DEFAULT_CHECKERS_BOARD,
	DEFAULT_CHECKERS_BOARD,
	PIECE_TOKENS,
} from "../lib/checkersData";
import {compressGameState} from "../lib/serverHandlers";
import "./CheckersPage.scss";
import {CheckersBoardProps, PlayerTokens, ValidTokens} from "../interfaces";

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
	//let validMoves: number[] = [];
	let board = props.board;
	let isFlippedRow = true;
	let rowNum = 0;
	function handleSquareClick(sel: number) {
		console.log("click");
		if (props.curPlayer.includes(board[sel])) {
			setSelectIndex(sel);
			const [valid, isReq] = findValidMoves(board, sel);
			setValidMoves(valid);
		}
		if (validMoves.includes(sel)) {
			console.log("valid move");
			[board[sel], board[selectIndex]] = [board[selectIndex], board[sel]];
			props.onMove(board);
		} else {
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
				/>
			</div>
		</div>
	);
};

export {CheckersPage};
