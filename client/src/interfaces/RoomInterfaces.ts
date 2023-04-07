import {CHECKERS_ROOM_STYLES, ROOM_TYPES} from "../constants/RoomConsts";

export type RoomTypes = typeof ROOM_TYPES[keyof typeof ROOM_TYPES];
export type CheckersRoomStylesTypes =
	typeof CHECKERS_ROOM_STYLES[keyof typeof CHECKERS_ROOM_STYLES];
export type AllRoomStylesTypes = CheckersRoomStylesTypes;
