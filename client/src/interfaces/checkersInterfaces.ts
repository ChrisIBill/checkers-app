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
/**
 * @member player: PlayerTokens
 * @member status: string
 * @member boardState: ValidTokens[]
 */
export interface CheckersGameState {
	player: PlayerTokens;
	status: string;
	boardState: ValidTokens[];
}
