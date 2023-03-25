import { SOCKET_ROOM_STATUS_TYPES } from "@src/constants/SocketConsts";
import { IUser } from "./User";

/**
 * string: "empty" | "open" | "full" | "private" | "init"
 */
export type SocketRoomStatus = typeof SOCKET_ROOM_STATUS_TYPES[number];

/**
 * @param id - The id of the room
 * @param status - The status of the room
 * @param members - The usernames of the members of the room
 * @param data - The data associated with the room
 */
export interface ISocketRoom {
    id: string;
    status: SocketRoomStatus;
    members: Set<string>;
    data: any;
}
