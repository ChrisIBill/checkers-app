import {ValidTokens} from "../interfaces";
import {LEGAL_MOVES_MAP, VALID_TOKENS} from "./checkersData";

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
function checkMoveValidity(
	boardState: string[],
	selToken: string,
	curPosition: number
): number[] {
	const validMoves: number[] = [];
	const posToCheck: number[] = getPositionsToCheck(selToken, curPosition);
	posToCheck.forEach((checkPos) => {
		const posToken = boardState[checkPos];
		console.log("posToCheck: ", checkPos, posToken, selToken, curPosition);
		if (posToken == "E") {
			console.log("Empty");
			/* If position is empty is valid move */
			validMoves.push(checkPos);
		} else if (posToken == selToken) {
			console.log("Same");
			/* If position has token thats the same as player token, do nothing */
		} else if (posToken.toLowerCase() == selToken.toLowerCase()) {
			console.log("Pre-Check: ", selToken, checkPos);
			validMoves.concat(checkMoveValidity(boardState, selToken, checkPos));
			console.log("Valid moves post-check: ", validMoves);
		} else {
			console.log(
				"ERROR: INVALID TOKEN IN FUNC CHECKMOVEVALIDITY IN CLIENT LOGIC"
			);
		}
	});
	return validMoves;
}

function getPositionsToCheck(selToken: string, curPosition: number) {
	return LEGAL_MOVES_MAP.get(String(curPosition))!.filter((elem) => {
		if (["P", "K"].includes(selToken)) {
			if (elem < curPosition) return elem;
		}
		if (["p", "k"].includes(selToken)) {
			if (elem > curPosition) return elem;
		}
	});
}
