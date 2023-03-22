import {PIECE_TOKENS, VALID_TOKENS} from "../lib/checkersData";
import {CompressedCheckersGameState} from "./checkersInterfaces";
import {UserData} from "./userInterfaces";

/* 
move_desc: start | piece[startpos]>pos[endpos] & takenpiece[pos] 
game_state: compressed board state*/
export interface CheckersBoardJSON {
	move_desc: string;
	game_state: string;
}

/*  */
type squareStatus = "default" | "selected" | "valid";
export type ValidTokens = typeof VALID_TOKENS[number]; //"p" | "P" | "k" | "K" | "E";
export type PlayerTokens = typeof PIECE_TOKENS[number];
export type ValidMoves = (number | number[] | undefined)[];
export type Direction = "left" | "right" | "up" | "down";
export type RequiredMoves = [number, number][];
/* Function and Component Props */
/**
 * @param board: ValidTokens[]
 * @param curPlayer: PlayerTokens
 * @param onMove: arg: ValidTokens[], move handler function to adjust board state
 * @param reqSels?: Number[], optional array of board indexes that are required*/
export interface CheckersBoardProps {
	/** Board */
	board: ValidTokens[];
	curPlayer: PlayerTokens; //PK or pk
	onMove(arg: ValidTokens[]): void;
	reqSels?: number[];
}
export interface CheckersHistoryProps {
	history: CompressedCheckersGameState[];
	onElementClick(arg: CompressedCheckersGameState): void;
}
