import { CHECKERS_ROOM_STATUS_TYPES } from "../constants/checkersData";
import {
    PIECE_TOKENS,
    PLAYER_TYPE,
    VALID_TOKENS,
} from "@src/constants/checkersData";

export type ValidTokens = typeof VALID_TOKENS[number]; //"p" | "P" | "k" | "K" | "E";
export type PlayerTokens = typeof PIECE_TOKENS[number];
/**
 * @member boardState: ValidTokens[]
 * @member curPlayer: number
 * @member history?: string[]
 */
export interface CheckersGameState {
    boardState: ValidTokens[];
    curPlayer: string;
    turnNum: number;
    history?: string[]; //Compressed
}
export interface CompressedCheckersGameState {
    boardState: string;
    curPlayer: number;
    turnNum?: number;
}
/**
 * "empty" | "open" | "full" | "private" |
 * "init" | "p1_turn" | "p2_turn" | "error"
 */
export type Checkers_Game_Status = typeof CHECKERS_ROOM_STATUS_TYPES[number];
export type PlayerType = typeof PLAYER_TYPE[number];
export interface CheckersPlayer {
    id: string;
    playerType: PlayerType;
    status: "connected" | "error";
}
/* export interface CheckersRoom {
    id: string;
    players: CheckersPlayer[];
    status:
        | "waitingForPlayers"
        | "initializing"
        | "p1_turn"
        | "p2_turn"
        | "error";
    boardState: string;
} */
