import {LEGAL_MOVES_MAP, VALID_TOKENS} from "./checkersData";

export function validMoves(boardState: string[], selectIndex: number) {
	const selToken = boardState[selectIndex];
	const posToCheck: number[] | undefined = LEGAL_MOVES_MAP.get(
		String(selectIndex)
	);
	const validMoves: number[] = [];
	if (!VALID_TOKENS.includes(selToken) || selToken == "E" || !posToCheck) {
		console.log(
			"ERROR: INVALID TOKEN PASSED TO FUNC validMoves() in clientLogic"
		);
		return [-1];
	}
	posToCheck.forEach((checkPos) => {
		const posToken = boardState[checkPos];
		if (posToken == "E") {
			validMoves.push(checkPos);
		} else if (posToken == selToken) {
			return;
		} else if (posToken.toLowerCase() == selToken.toLowerCase()) {
		}
	});
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
		if (posToken == "E") {
			/* If position is empty and , is valid move */
			validMoves.push(checkPos);
		} else if (posToken == selToken) {
			/* Do Nothing */
		} else if (posToken.toLowerCase() == selToken.toLowerCase()) {
			validMoves.concat(checkMoveValidity(boardState, selToken, checkPos));
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
