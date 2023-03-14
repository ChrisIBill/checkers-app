import {
    CHECKERS_GAME_STATUS,
    PIECE_TOKENS,
    PLAYER_TYPE,
    VALID_TOKENS,
} from "@src/constants/checkersData";

export type ValidTokens = typeof VALID_TOKENS[number]; //"p" | "P" | "k" | "K" | "E";
export type PlayerTokens = typeof PIECE_TOKENS[number];
export interface CheckersGameState {}
export interface CompressedCheckersGameState {
    boardState: string;
    curPlayer: number;
    turnNum?: number;
}

export type Checkers_Game_Status = typeof CHECKERS_GAME_STATUS;
export type PlayerType = typeof PLAYER_TYPE[number];
export interface CheckersPlayer {
    id: string;
    playerType: PlayerType;
    status: "connected" | "error";
}
export interface CheckersRoom {
    id: string;
    players: CheckersPlayer[];
    status:
        | "waitingForPlayers"
        | "initializing"
        | "p1_turn"
        | "p2_turn"
        | "error";
    boardState: string;
}
