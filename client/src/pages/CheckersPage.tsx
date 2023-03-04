import {useState} from "react";
import {DEFAULT_CHECKERS_BOARD} from "../lib/checkersClientLogic";
import "./CheckersPage.scss";

const CheckersSquare = ({
	elem,
	index,
	onClick,
}: {
	elem: string;
	index: number;
	onClick: () => void;
}) => {
	const [status, setStatus] = useState("none"); //none, hover, select
	console.log("Rendering individual square: " + elem);
	switch (elem) {
		case "E":
			return (
				<div className="EmptySquare">
					<p>{index}</p>
				</div>
			);
		case "p":
			return (
				<div className="FullSquare">
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
				<div className="FullSquare">
					<div className="CheckersPiece" style={{backgroundColor: "red"}}>
						<p>{index}</p>
					</div>
				</div>
			);
		default:
			return <div className="EmptySquare">Error</div>;
	}
};
const CheckersBoard = ({
	board,
	selIndex,
}: {
	board: string[];
	selIndex: number;
}) => {
	const [status, setStatus] = useState("selecting"); //populate?, select, move, submit
	let isFlippedRow = true;
	let rowNum = 0;

	const GameBoard = board.map((elem, index) => {
		if (index % 4 == 0) {
			isFlippedRow = !isFlippedRow;
		}
		console.log(
			"Rendering checkers square, elem: " +
				elem +
				" index: " +
				index +
				" flip: " +
				isFlippedRow
		);
		if (isFlippedRow) {
			return (
				<div className="CheckersSquares" key={index}>
					<CheckersSquare
						elem={elem}
						index={index}
						onClick={clickHandler}
					/>
					<div className="DeadSquare"></div>
				</div>
			);
		}
		return (
			<div className="CheckersSquares" key={index}>
				<div className="DeadSquare"></div>
				<CheckersSquare elem={elem} index={index} onClick={clickHandler} />
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
	const [selectIndex, setSelectIndex] = useState<number>(-1);

	function handleClick(sel: number) {
		setSelectIndex(sel);
	}
	return (
		<div id="CheckersPageWrapper">
			<div id="CheckersBoardWrapper">
				<CheckersBoard board={board} selIndex={selectIndex} />
			</div>
		</div>
	);
};

export {CheckersPage};
