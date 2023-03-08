import {dir} from "console";
import {Direction, ValidMoves, ValidTokens, PlayerTokens} from "../interfaces";
import {
	BOARD_EDGES,
	LEGAL_MOVES_MAP,
	NUM_PLAYER_TOKEN_TYPES,
	BOARD_ROW_LENGTH,
	VALID_TOKENS,
} from "./checkersData";

export function findValidMoves(boardState: ValidTokens[], selectIndex: number) {
	const selToken = boardState[selectIndex];
	return checkMoveValidity(boardState, selToken, selectIndex);
}

/**Returns array of numbers containing valid move indexes and bool for if theyre required or not */
function checkMoveValidity(
	boardState: ValidTokens[],
	selToken: ValidTokens,
	curPosition: number
): [number[], number[] | undefined] {
	const validMoves: number[] = [];
	const reqMoves: number[] = [];
	const piecesToTake: number[] = [];
	const posToCheck: number[] = getPositionsToCheck(selToken, curPosition);
	console.log("Checking Moves Validity", posToCheck);
	const isCurFlipped: boolean = Boolean(Math.floor(curPosition / 4) % 2);
	const isEdge = BOARD_EDGES.has(curPosition);
	posToCheck.forEach((checkPos, index) => {
		const posToken = boardState[checkPos];
		/* console.log(
			"Checking position: ",
			checkPos,
			posToken,
			selToken,
			curPosition
		); */
		if (posToken == "E") {
			/* If position is empty is valid move */
			validMoves.push(checkPos);
		} else if (
			Math.floor(VALID_TOKENS.indexOf(posToken) / NUM_PLAYER_TOKEN_TYPES) ==
			Math.floor(VALID_TOKENS.indexOf(selToken) / NUM_PLAYER_TOKEN_TYPES)
		) {
			/* If position has token thats the same as player token, do nothing */
		} else if (
			/* Since there are only two token types in checkers, normal piece and kings
			 ** With VALID_TOKENS organized with each players tokens back to back in the index
			 ** This will check if tokens are of different players. */
			Math.floor(VALID_TOKENS.indexOf(posToken) / NUM_PLAYER_TOKEN_TYPES) !=
			Math.floor(VALID_TOKENS.indexOf(selToken) / NUM_PLAYER_TOKEN_TYPES)
		) {
			/* If tokens are of different players, need to check if viable squares to jump to are empty
			 ** the viable square to jump to must be diagonal from the original piece, with the pos being
			 ** jumped as the midpoint */
			const leftOrRight = findleftOrRight(
				curPosition,
				checkPos,
				isCurFlipped
			);
			const upOrDown = getUpOrDown(curPosition, checkPos);
			const checkDiag = getPositionsToCheck(selToken, checkPos).filter(
				(elem) => {
					if (
						leftOrRight !=
						findleftOrRight(checkPos, elem, isBoardRowFlipped(checkPos))
					) {
						return false;
					}
					if (upOrDown != getUpOrDown(checkPos, elem)) {
						return false;
					}
					return true;
				}
			);
			if (boardState[checkDiag[0]] == "E") {
				reqMoves.push(checkDiag[0]);
				piecesToTake.push(checkPos);
			}
		} else {
			console.log(
				"ERROR: INVALID TOKEN IN FUNC CHECKMOVEVALIDITY IN CLIENT LOGIC"
			);
			return [-1];
		}
	});
	if (reqMoves.length > 0) {
		return [reqMoves, piecesToTake];
	}
	return [validMoves, undefined];
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
function getUpOrDown(curPos: number, checkPos: number): Direction {
	return Math.floor(curPos / 4) - Math.floor(checkPos / 4) > 0 ? "up" : "down";
}
function isBoardRowFlipped(pos: number): boolean {
	return Boolean(Math.floor(pos / 4) % 2);
}
/**
 * @returns number[] w/ elems corresponding to positions in which the cur player has pieces
 *
 */
function getValidIndexes(tokens: PlayerTokens, compGameState: string) {}
/**
 * @param tokens: tokens to check
 * @param boardState: current board
 * @returns number[]: w/ each element corresponding to the index of a token included in tokens
 * which must be moved
 */
export function getReqSelections(
	tokens: PlayerTokens,
	boardState: ValidTokens[]
): number[] | undefined {
	const reqSels: number[] = [];
	for (let i = 0; i < boardState.length; i++) {
		if (tokens.includes(boardState[i])) {
			const [moves, isReq] = findValidMoves(boardState, i);
			if (isReq) {
				reqSels.push(i);
			}
		}
	}
	if (reqSels.length) {
		return reqSels;
	}
}

/* export function getValidSelections(tokens: PlayerTokens, boardState: ValidTokens[]): number[] {
	const reqPositions = getRequiredMoves(tokens, boardState);
	if (reqPositions.length) {
		return reqPositions
	}
	else {
		return 
	}
	return  ? reqPositions : 
}
 */
