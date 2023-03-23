import {Socket} from "socket.io-client";
import {GameTypes, MatchmakingTypes} from "../interfaces/GameInterfaces";
import {IPayload} from "../interfaces/socketInterfaces";

export function onJoinGameRoomRes(args: IPayload) {}

export function emitJoinGameRoom(socket: Socket, string) {
	socket.emit("");
}
