import HttpStatusCode from "../constants/HttpStatusCodes";
import {SocketRoomStatus} from "./RoomInterfaces";
import {PlayerTokens, ValidTokens} from "./interfaces";

export interface CompressedCheckersGameState {
	boardState: string;
	curPlayer: PlayerTokens;
	turnNum?: number;
}
export interface CheckersRoomState {
	roomID: string;
	player: number;
	status: string;
	boardState: string;
}
/**
 * @member status: string
 * @member boardState: ValidTokens[]
 * @member validSels?: number[]
 * @member isCurPlayer?: boolean
 */

export interface CheckersGameState {
	boardState: ValidTokens[];
	validSels?: number[];
	reqSels?: number[];
	isCurPlayer?: boolean;
	playerTokens?: PlayerTokens;
	status?: string;
}

export interface ICheckersRoomUpdatePayload {
	status: HttpStatusCode;
	roomStatus: string;
	boardState: string;
	curPlayer: string;
	validSels: number[];
	roomID: string;
}
export interface ICheckersRoomInitPayload {
	status: HttpStatusCode;
	roomStatus: string;
	boardState: string;
	players: string[];
	curPlayer: string;
	validSels: number[];
	roomID: string;
}
export interface ICheckersRoomJoinPayload {
	status: HttpStatusCode;
	roomStatus: string;
	boardState: string;
	roomID: string;
}

export const CheckersRoomStatus = {
	p1turn: "p1turn",
	p2turn: "p2turn",
	gameOver: "gameOver",
} as const;

export const CheckersRoomStatusCodes = {
	...SocketRoomStatus,
	...CheckersRoomStatus,
} as const;
