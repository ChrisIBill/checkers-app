import {PlayerTokens, ValidTokens} from "../interfaces/interfaces";
import {VALID_TOKENS, VALID_TOKENS_STRING} from "../constants/checkersData";

export function unzipGameState(str: string): ValidTokens[] {
	const board: ValidTokens[] = [];
	let num = "";
	for (let n of str) {
		if (VALID_TOKENS_STRING.includes(n)) {
			board.push(...Array(num ? Number(num) : 1).fill(n));
			if (num) num = "";
			continue;
		}
		if (!isNaN(Number(n))) {
			num += n;
			continue;
		}
		throw new Error("Invalid Token");
	}
	console.log("Parsed Board: ", board);
	if (board.length != 32) throw new Error("Invalid board length");
	return board;
}

export function zipGameState(gameState: ValidTokens[]): string {
	//[p,p,p,p,p,p,p,p,p,p,p,p,E,E,E,E...] -> p12/E8/P12/
	console.log("zipGameState: ", gameState);
	let num = -1;
	let prevChar: ValidTokens;
	const ret =
		gameState.reduce((acc, curVal) => {
			if (!prevChar) {
				prevChar = curVal;
				num++;
			} else if (curVal != prevChar) {
				console.log;
				acc += num > 0 ? (num + 1).toString() + prevChar : prevChar;
				num = 0;
				prevChar = curVal;
			} else {
				num++;
			}
			return acc as any;
		}, "") +
		(num > 1 ? (num + 1).toString() : "") +
		prevChar!;
	console.log("Comp gameState: ", ret);
	return ret;
}
/* export async function (params:type) {
	
} */

export async function request<TResponse>(
	url: string,
	config: RequestInit = {}
): Promise<TResponse> {
	return fetch(url, config)
		.then((res) => res.json())
		.then((data) => data as TResponse)
		.catch((error) => {
			console.log("Error");
			return error as TResponse;
		});
}
