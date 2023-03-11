import {
    CheckersRoom,
    CompressedCheckersGameState,
    ValidTokens,
} from "@src/interfaces/checkersInterfaces";

export const BOARD_ROW_LENGTH = 4;
export const BOARD_COLUMN_LENGTH = 8;
export const NUM_PLAYER_TOKEN_TYPES = 2;
export const VALID_TOKENS_STRING = "pkPKE" as const;
export const VALID_TOKENS = ["p", "k", "P", "K", "E"] as const;
export const PIECE_TOKENS = ["PK", "pk"] as const; //caps for red, lowers for white
export const LEGAL_MOVES_MAP = new Map([
    ["0", [4, 5]],
    ["1", [5, 6]],
    ["2", [6, 7]],
    ["3", [7]],
    ["4", [0, 8]],
    ["5", [0, 1, 8, 9]],
    ["6", [1, 2, 9, 10]],
    ["7", [2, 3, 10, 11]],
    ["8", [4, 5, 12, 13]],
    ["9", [5, 6, 13, 14]],
    ["10", [6, 7, 14, 15]],
    ["11", [7, 15]],
    ["12", [8, 16]],
    ["13", [8, 9, 16, 17]],
    ["14", [9, 10, 17, 18]],
    ["15", [10, 11, 18, 19]],
    ["16", [12, 13, 20, 21]],
    ["17", [13, 14, 21, 22]],
    ["18", [14, 15, 22, 23]],
    ["19", [15, 23]],
    ["20", [16, 24]],
    ["21", [16, 17, 24, 25]],
    ["22", [17, 18, 25, 26]],
    ["23", [18, 19, 26, 27]],
    ["24", [20, 21, 28, 29]],
    ["25", [21, 22, 29, 30]],
    ["26", [22, 23, 30, 31]],
    ["27", [23, 31]],
    ["28", [24]],
    ["29", [24, 25]],
    ["30", [25, 26]],
    ["31", [26, 27]],
]);
export const BOARD_EDGES = new Set([3, 4, 11, 12, 19, 20, 27, 28]);
// prettier-ignore
export const DEFAULT_CHECKERS_BOARD: ValidTokens[] = [
    "p","p","p","p",
    "p","p","p","p",
    "p","p","p","p",
    "E","E","E","E",
    "E","E","E","E",
    "P","P","P","P",
    "P","P","P","P",
    "P","P","P","K",
];

export const COMPRESSED_DEFAULT_GAME_STATE: CompressedCheckersGameState = {
    boardState: "p12/E8/P12",
    curPlayer: 0,
};

export const DEFAULT_CHECKERS_ROOM: CheckersRoom = {
    id: "0",
    numPlayers: 0,
    status: "waitingForPlayers",
    boardState: "p12/E8/P12",
};
