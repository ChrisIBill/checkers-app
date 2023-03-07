import {dir} from "console";
import {Direction, ValidMoves, ValidTokens} from "../interfaces";
import {
	BOARD_EDGES,
	LEGAL_MOVES_MAP,
	NUM_PLAYER_TOKEN_TYPES,
	BOARD_ROW_LENGTH,
	VALID_TOKENS,
} from "./checkersData";

export function findValidMoves(boardState: ValidTokens[], selectIndex: number) {
	const selToken = boardState[selectIndex];
	const validMoves: number[] = [];
	/* if (!VALID_TOKENS.includes(selToken) || selToken == "E") {
		console.log(
			"ERROR: INVALID TOKEN PASSED TO FUNC validMoves() in clientLogic"
		);
		return [-1];
	} */
	const ret = checkMoveValidity(boardState, selToken, selectIndex);
	console.log("Return value of valid Moves: ", ret);
	return ret;
}

/* selTok: original token type*/
/**Returns array of numbers containing valid move indexes and bool for if theyre required or not */
function checkMoveValidity(
	boardState: ValidTokens[],
	selToken: ValidTokens,
	curPosition: number,
	direction?: Direction
): [number[], boolean] {
	const validMoves: number[] = [];
	const reqMoves: number[] = [];
	const posToCheck: number[] = getPositionsToCheck(selToken, curPosition);
	console.log("Checking Moves Validity", posToCheck);
	const isFlipped: boolean = Boolean(Math.floor(curPosition / 4) % 2);
	const isEdge = BOARD_EDGES.has(curPosition);
	console.log("Flipped?: ", isFlipped);
	posToCheck.forEach((checkPos, index) => {
		const posToken = boardState[checkPos];
		console.log(
			"Checking position: ",
			checkPos,
			posToken,
			selToken,
			curPosition
		);
		if (posToken == "E") {
			/* If position is empty is valid move */
			console.log("Empty");
			validMoves.push(checkPos);
		} else if (posToken == selToken) {
			/* If position has token thats the same as player token, do nothing */
			console.log("Same");
		} else if (
			Math.floor(VALID_TOKENS.indexOf(posToken) / NUM_PLAYER_TOKEN_TYPES) !=
			Math.floor(VALID_TOKENS.indexOf(selToken) / NUM_PLAYER_TOKEN_TYPES)
		) {
			//direction = ()
			//if index is 0, either check pos is left or legal moves is size 1
			//if index is 1 check pos is right
			console.log("Opponent piece at checkPos: ", checkPos);
			const check = getPositionsToCheck(selToken, checkPos);
			console.log(check);
			//const curPosFlattened = (curPosition % BOARD_ROW_LENGTH) - isFlipped;
			const isCheckEdge = BOARD_EDGES.has(checkPos);
			const leftOrRight = findleftOrRight(curPosition, checkPos, isFlipped);
			const upOrDown = curPosition - checkPos > 0 ? "up" : "down";
			console.log(leftOrRight, upOrDown, isEdge, isCheckEdge);
			if (isCheckEdge) {
				if (
					leftOrRight == findleftOrRight(checkPos, check[0], !isFlipped) &&
					boardState[check[0]] == "E"
				) {
					reqMoves.push(check[0]);
				} else {
					console.log("Opponent piece on edge and no valid moves");
				}
			} else if (leftOrRight == "right" && boardState[check[1]] == "E") {
				//if index is
				reqMoves.push(check[1]);
			} else if (leftOrRight == "left" && boardState[check[0]] == "E") {
				reqMoves.push(check[0]);
			}
			//validMoves.push(checkMoveValidity(boardState, selToken, checkPos));
			//console.log("Valid moves post-check: ", validMoves);
		} else {
			console.log(
				"ERROR: INVALID TOKEN IN FUNC CHECKMOVEVALIDITY IN CLIENT LOGIC"
			);
			return [-1];
		}
	});
	console.log(validMoves);
	console.log(posToCheck);
	if (reqMoves.length > 0) {
		return [reqMoves, true];
	}
	return [validMoves.flatMap((num) => num), false];
}

function getPositionsToCheck(selToken: string, curPosition: number) {
	return LEGAL_MOVES_MAP.get(String(curPosition))!.filter((elem) => {
		if (["P"].includes(selToken)) {
			if (elem < curPosition) return elem;
		}
		if (["p"].includes(selToken)) {
			if (elem > curPosition) return elem;
		}
		if ("Kk".includes(selToken)) {
			return elem;
		}
	});
}

//function isFlipped
function findleftOrRight(
	curPos: number,
	checkPos: number,
	isFlipped: boolean
): Direction {
	return (curPos % BOARD_ROW_LENGTH) -
		Number(isFlipped) -
		(checkPos % BOARD_ROW_LENGTH) >=
		0
		? "left"
		: "right";
}
