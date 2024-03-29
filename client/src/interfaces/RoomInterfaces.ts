import {CHECKERS_ROOM_STYLES, ROOM_TYPES} from "../constants/RoomConsts";

export type RoomTypes = typeof ROOM_TYPES[keyof typeof ROOM_TYPES];
export type CheckersRoomStylesTypes =
	typeof CHECKERS_ROOM_STYLES[keyof typeof CHECKERS_ROOM_STYLES];
export type AllRoomStylesTypes = CheckersRoomStylesTypes;

export interface INewRoomState {
	roomType: RoomTypes;
	roomStyle: any;
}
export interface IActiveRoomState {
	roomType: RoomTypes;
	roomID: string;
}
export const DEFAULT_ROOM_STATUS = [
	"new",
	"loading",
	"active",
	"waiting",
	"error",
] as const;
export type RoomStatusTypes = typeof DEFAULT_ROOM_STATUS[number];

export interface IRoomInfo {
	roomType: RoomTypes;
	roomID: string;
}
export interface IRoomPayload {
	roomInfo: IRoomInfo;
	data: any;
}

export const SocketRoomStatus = {
	empty: "empty",
	open: "open",
	full: "full",
	private: "private",
	init: "init",
	error: "error",
} as const;
