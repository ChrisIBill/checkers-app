import {PlayerTokens, ValidTokens} from "./interfaces";

export interface CompressedCheckersGameState {
	boardState: string;
	curPlayer: number;
	turnNum?: number;
}
export interface CheckersRoomState {
	roomID: string;
	player: number;
	status: string;
	boardState: string;
}
export interface CheckersGameState {
	roomID: string;
	player: PlayerTokens;
	status: string;
	boardState: ValidTokens[];
}