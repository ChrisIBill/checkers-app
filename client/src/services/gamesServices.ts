import {Socket} from "socket.io-client";
import HttpStatusCode from "../constants/HttpStatusCodes";
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
import {unzipGameState, zipGameState} from "../lib/serverHandlers";
import {CheckersGameState} from "../interfaces/checkersInterfaces";
import {PlayerTokens} from "../interfaces/interfaces";
import {redirect} from "react-router-dom";
import {PathsSet} from "../paths/SocketPaths";

export function onJoinGameRoomRes(args: IPayload) {
	console.log(
		"Received response for joining game room, status: ",
		args.status ? args.status : "No status"
	);
	if (args.data) {
		console.log("Received data: ", args.data);
		if (PathsSet.includes(args.data.path)) {
			console.log("Here");
			redirect(args.data.path);
		} else {
			console.log("ERROR: Invalid path");
		}
	}
}
export function onLeaveGameRoomRes(args: IPayload) {
	/* Do we need this response??? */
	console.log("Successfully disconnected from game room");
	console.log(args);
}
export function onCheckersClientInit(args: IPayload) {
	console.log("Received checkers client init");
	console.log(args);
	if (args.data && args.data.boardState) {
		console.log("Board state: ", args.data.boardState);
		const boardState: ValidTokens[] = unzipGameState(args.data.boardState);
		return boardState;
	} else {
		console.log("ERROR: No board state in checkers server init payload");
		throw new Error("No board state in checkers server init payload");
	}
}
export function onCheckersRoomConnect(args: CheckersRoomConnectPayload) {
	console.log("Connected client with checkers room, status: ", args.status);
	if (args.status !== HttpStatusCode.OK) {
		console.log("ERROR: Could not connect to checkers room");
		return null;
	}
	const payload = args.data;
	console.log("Payload: ", payload);
	return {
		player: payload.playerTokens,
		status: "loading",
		boardState: unzipGameState(payload.boardState),
	} as CheckersGameState;
}
export function onCheckersUpdateClient(args: IPayload) {
	return "PK" as PlayerTokens;
}
export function onCheckersClientUpdateRes(args: IPayload) {}
export function onServerGameStateUpdate(args: CheckersUpdateClientType) {
	console.log("Received Game State from server");
	console.log(args);
}
export function onGameStateUpdateResponse(args: ISocketResponse) {
	console.log("Received response for the game state update");
	console.log(args);
}
/* Requests server to find game room for user */
/* export function emitFindGameRoomReq() {

} */
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
