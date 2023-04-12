import {
    BOARD_EDGES,
    BOARD_ROW_LENGTH,
    LEGAL_MOVES_MAP,
    NUM_PLAYER_TOKEN_TYPES,
    CHECKERS_TOKENS,
    VALID_TOKENS,
    VALID_TOKENS_STRING,
} from "../constants/checkersData";
import { PlayerTokens, ValidTokens } from "../interfaces/checkersInterfaces";
import { Direction } from "../interfaces/GameInterfaces";

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
    let num = 0;
    let prevChar: ValidTokens;
    const ret =
        gameState.reduce((acc, curVal) => {
            if (curVal != prevChar) {
                acc += (num > 1 ? num.toString() : "") + (prevChar ?? "");
                num = 0;
                prevChar = curVal;
            }
            num++;
            return acc as any;
        }) +
        (num > 1 ? num.toString() : "") +
        prevChar!;
    console.log("Comp gameState: ", ret);
    return ret;
}
/* If either is "E", return 0
   If same player, return 1
   if different players, return 2*/
export function compareCheckersTokens(tok1: ValidTokens, tok2: ValidTokens) {
    if ([tok1, tok2].includes(CHECKERS_TOKENS.Empty)) {
        return 0;
    }
    if (
        Math.floor(VALID_TOKENS.indexOf(tok1) / NUM_PLAYER_TOKEN_TYPES) ==
        Math.floor(VALID_TOKENS.indexOf(tok2) / NUM_PLAYER_TOKEN_TYPES)
    ) {
        return -1;
    }
    return 1;
}
/* Game Logic */
export function newValidMoves() {
    /* would be more efficient to just check positions around recently moved piece
    to change valid moves than regenerating whole board */
}

export async function findValidSelections(
    boardState: ValidTokens[],
    player: PlayerTokens
) {
    const validSelections: number[] = [];
    for (let i = 0; i < boardState.length; i++) {
        const curToken = boardState[i];
        if (player.includes(curToken)) {
            validSelections.push(i);
        }
    }
    return validSelections;
}
/* Receives list of moves,  */
/* export function validateMoves(
    boardState: ValidTokens[],
    moves: number[]
): boolean {
    const playerToken = boardState[moves[0]];
    let jumped = false;
    for (let i = 1; i < moves.length - 1; i++) {
        const curPos = moves[i];
        const curToken = boardState[curPos];
        const comp = compareCheckersTokens(playerToken, curToken);
        switch (comp) {
            case -1:
                //Cant move to own piece
                return false;
            case 0:
                //If square empty, can move. if prev move was on enemy piece, can move still
                if (jumped) {
                    jumped = false;
                    break;
                }
                else if (i != moves.length - 1) {
                    return false;
                }
            case 1:
                //If square has enemy piece, can move if next square is empty
                if (i + 1 >= moves.length || boardState[moves[i + 1]] != CHECKERS_TOKENS.Empty || jumped) {
                    return false;
                }
                jumped = true;
                break;

    return true;
}
 */
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
        const comp = compareCheckersTokens(selToken, posToken);
        switch (comp) {
            case -1:
                //Cant move to own piece
                break;
            case 0:
                validMoves.push(checkPos);
                break;
            case 1:
                const leftOrRight = findleftOrRight(
                    curPosition,
                    checkPos,
                    isCurFlipped
                );
                const upOrDown = getUpOrDown(curPosition, checkPos);
                const checkDiag = getPositionsToCheck(
                    selToken,
                    checkPos
                ).filter((elem) => {
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
                });
                if (boardState[checkDiag[0]] == "E") {
                    reqMoves.push(checkDiag[0]);
                    piecesToTake.push(checkPos);
                }
                break;
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
