import { PIECE_TOKENS, VALID_TOKENS } from "@src/constants/checkersData";

export type ValidTokens = typeof VALID_TOKENS[number]; //"p" | "P" | "k" | "K" | "E";
export type PlayerTokens = typeof PIECE_TOKENS[number];
export interface CheckersGameState {}
export interface CompressedCheckersGameState {
    boardState: string;
    curPlayer: number;
    turnNum?: number;
}
export interface CheckersRoom {
    id: string;
    numPlayers: 0 | 1 | 2;
    status:
        | "waitingForPlayers"
        | "initializing"
        | "p1_turn"
        | "p2_turn"
        | "error";
    boardState: string;
}

export interface CheckersPlayer {}
