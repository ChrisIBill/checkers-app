import { SOCKET_ROOM_STATUS_TYPES } from "@src/constants/SocketConsts";
import { IUser } from "./User";
import { RoomTypes } from "@src/interfaces/SocketIO-Interfaces";

/**
 * string: "empty" | "open" | "full" | "private" | "init"
 */
/* export type SocketRoomStatus = typeof SOCKET_ROOM_STATUS_TYPES[number]; */

export const SocketRoomStatus = {
    empty: "empty",
    open: "open",
    full: "full",
    private: "private",
    init: "init",
    error: "error",
} as const;
export type ValueOf<T> = T[keyof T];
export type SocketRoomStatusType = ValueOf<typeof SocketRoomStatus>;
/**
 * @param id - The id of the room
 * @param status - The status of the room
 * @param members - The usernames of the members of the room
 * @param data - The data associated with the room
 */
export interface ISocketRoom {
    id: string;
    members: Set<string>;
    data: any;
    status: string;
}
export class SocketRoom implements ISocketRoom {
    [x: string]: any;
    public id: string;
    public members: Set<string>;
    public type: RoomTypes;
    public data: any;
    public status: string;
    public constructor(
        id: string | number,
        members?: Set<string>,
        type?: RoomTypes,
        data?: any,
        status?: string
    ) {
        this.id = typeof id === "number" ? id.toString() : id;
        this.members = members ?? new Set();
        this.type = type ?? "basic";
        this.data = data ?? {};
        this.status = status ?? SocketRoomStatus.empty;
    }

    public addMember(username: string): boolean {
        if (this.members.has(username) || this.status == "private")
            return false;
        this.members.add(username);
        return true;
    }

    public removeMember(username: string): boolean {
        if (!this.members.has(username)) return false;
        this.members.delete(username);
        return true;
    }
}
