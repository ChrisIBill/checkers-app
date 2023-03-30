import {
    BOARD_EDGES,
    BOARD_ROW_LENGTH,
    LEGAL_MOVES_MAP,
    NUM_PLAYER_TOKEN_TYPES,
    VALID_TOKENS,
    VALID_TOKENS_STRING,
} from "@src/constants/checkersData";
import { PlayerTokens, ValidTokens } from "@src/interfaces/checkersInterfaces";
import { Direction } from "@src/interfaces/GameInterfaces";
import { CheckersGameState } from "../../../client/src/interfaces/checkersInterfaces";

export function unzipGameState(str: string): ValidTokens[] {
    const board: ValidTokens[] = [];
    const tokens: string[] = str.split("/");
    console.log("Parsing Game State: " + str);
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t.length == 0) {
            //Should fix this
            console.log("ERROR: Invalid Token Length");
            break;
        }
        let token: ValidTokens;
        if (!VALID_TOKENS_STRING.includes(t.at(0)!)) {
            console.log("ERROR: Invalid Token Start, Token: ", t);
            break;
        } else {
            token = t.charAt(0)! as ValidTokens;
        }
        let num = parseInt(t.slice(1));
        if (isNaN(num)) {
            num = 1;
        }
        for (let k = 0; k < Number(num); k++) {
            board.push(token);
        }
    }

    console.log("Parsed Board:");
    console.log(board);
    return board;
}

export function zipGameState(gameState: ValidTokens[]): string {
    //[p,p,p,p,p,p,p,p,p,p,p,p,E,E,E,E...] -> p12/E8/P12/
    console.log("zipGameState: ", gameState);
    let i = 0;
    let num = 1;
    let prevChar: any = undefined;
    const ret = gameState.reduce((acc, curVal, index) => {
        if (curVal == prevChar) {
            num++;
            return acc;
        } else if (curVal != prevChar) {
            let ret = num > 1 ? num + "/" + curVal : "/" + curVal;
            prevChar = curVal;
            num = 1;
            return acc + ret;
        } else {
            return acc;
        }
    }, "" as string);
    console.log("Comp gameState: ", ret);
    return ret;
}

/* Game Logic */
export function newValidMoves() {
    /* would be more efficient to just check positions around recently moved piece
    to change valid moves than regenerating whole board */
}

export function findValidMoves(boardState: ValidTokens[], selectIndex: number) {
    const selToken = boardState[selectIndex];
    return checkMoveValidity(boardState, selToken, selectIndex);
}
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
            Math.floor(
                VALID_TOKENS.indexOf(posToken) / NUM_PLAYER_TOKEN_TYPES
            ) ==
            Math.floor(VALID_TOKENS.indexOf(selToken) / NUM_PLAYER_TOKEN_TYPES)
        ) {
            /* If position has token thats the same as player token, do nothing */
        } else if (
            /* Since there are only two token types in checkers, normal piece and kings
             ** With VALID_TOKENS organized with each players tokens back to back in the index
             ** This will check if tokens are of different players. */
            Math.floor(
                VALID_TOKENS.indexOf(posToken) / NUM_PLAYER_TOKEN_TYPES
            ) !=
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
                        findleftOrRight(
                            checkPos,
                            elem,
                            isBoardRowFlipped(checkPos)
                        )
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
    return Math.floor(curPos / 4) - Math.floor(checkPos / 4) > 0
        ? "up"
        : "down";
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
    if (!tokens) return undefined;
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

const invalidIndex = (index: number) => index < 0 && index > 31;
export function isMoveValid(
    boardState: ValidTokens[],
    curPlayer: PlayerTokens,
    move: number[]
): boolean {
    if (move.some(invalidIndex)) return false;
    if (!curPlayer.includes(boardState[move[0]])) return false;
    const [validMoves, reqMoves] = findValidMoves(boardState, move[0]);
    if (reqMoves) {
        const invalid = move.find((elem) => !reqMoves.includes(elem));
        if (invalid) return false;
        return true;
    } else return false;
}
