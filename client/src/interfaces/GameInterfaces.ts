import {GAME_STATUS_TYPES} from "../constants/SocketConsts";

export type GameStatusType = typeof GAME_STATUS_TYPES[number];
export type GameTypes = "checkers" | undefined;
export type MatchmakingTypes = "local" | "computer" | "pvp";
