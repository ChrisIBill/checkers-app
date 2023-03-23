import {Socket} from "socket.io-client";
import HttpStatusCode from "../constants/HttpStatusCodes";
import {GameTypes, MatchmakingTypes} from "../interfaces/GameInterfaces";
import {ValidTokens} from "../interfaces/interfaces";
import {
	CheckersRoomConnectPayload,
	CheckersUpdateClientType,
	CheckersUpdateServerType,
	ClientJoinRoomReqType,
	IPayload,
	ISocketResponse,
	MovesListType,
} from "../interfaces/socketInterfaces";
import {zipGameState} from "../lib/serverHandlers";

export function onJoinGameRoomRes(args: IPayload) {
	console.log("Found game room for client");
	console.log(args);
}
export function onLeaveGameRoomRes(args: IPayload) {
	/* Do we need this response??? */
	console.log("Successfully disconnected from game room");
	console.log(args);
}
export function onCheckersRoomConnect(args: CheckersRoomConnectPayload) {
	console.log("Connected client with checkers room");
	console.log(args);
}
export function onServerGameStateUpdate(args: CheckersUpdateClientType) {
	console.log("Received Game State from server");
	console.log(args);
}
export function onGameStateUpdateResponse(args: ISocketResponse) {
	console.log("Received response for the game state update");
	console.log(args);
}
export function emitJoinGameRoomReq(req: ClientJoinRoomReqType) {
	/* Request to join room of gametype and match type or gameType and roomID*/
}

export function emitClientGameState(
	board: ValidTokens[],
	movesList: MovesListType
): CheckersUpdateServerType {
	const compBoard = zipGameState(board);
	return {
		status: HttpStatusCode.OK,
		data: {
			boardState: compBoard,
			movesList: movesList,
		},
	};
	/* compress client game state and emit to server */
}
