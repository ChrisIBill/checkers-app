import {useState} from "react";
import {findValidMoves} from "../lib/checkersClientLogic";
import {DEFAULT_CHECKERS_BOARD} from "../lib/checkersData";
import "./CheckersPage.scss";

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
		default:
			return <div className="EmptySquare">Error</div>;
	}
};

const CheckersBoard = ({board}: {board: string[]}) => {
	const [status, setStatus] = useState("select"); //populate?, select, move, submit
	const [selectIndex, setSelectIndex] = useState<number>(-1);
	const [validMoves, setValidMoves] = useState<number[]>([]);
	let isFlippedRow = true;
	let rowNum = 0;

	function handleSquareClick(sel: number) {
		console.log("click");
		if (validMoves.includes(sel)) {
			console.log("valid move");
			[board[sel], board[selectIndex]] = [board[selectIndex], board[sel]];
			console.log(board);
		} else {
			setSelectIndex(sel);
			setValidMoves(findValidMoves(board, sel));
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

		/* console.log(
			"Rendering checkers square, elem: " +
				elem +
				" index: " +
				index +
				" flip: " +
				isFlippedRow
        ); */

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
	const [gameBoard, setGameBoard] = useState<string[]>(DEFAULT_CHECKERS_BOARD);
	const [status, setStatus] = useState("selecting"); //populate?, select, move, submit

	return (
		<div id="CheckersPageWrapper">
			<div id="CheckersBoardWrapper">
				<CheckersBoard board={board} />
			</div>
		</div>
	);
};

export {CheckersPage};
