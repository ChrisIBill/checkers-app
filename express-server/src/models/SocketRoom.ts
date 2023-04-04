import { SOCKET_ROOM_STATUS_TYPES } from "@src/constants/SocketConsts";
import { IUser } from "./User";

/**
 * string: "empty" | "open" | "full" | "private" | "init"
 */
/* export type SocketRoomStatus = typeof SOCKET_ROOM_STATUS_TYPES[number]; */
export enum SocketRoomStatus {
    empty = "empty",
    open = "open",
    full = "full",
    private = "private",
    init = "init",
    error = "error",
}
export const SocketRoomStatus = {
    empty: "empty",
    open: "open",
    full: "full",
    private: "private",
    init: "init",
    error: "error",
}
export type SocketRoomStatusType = SocketRoomStatus;
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
    status: SocketRoomStatus;
}

export class SocketRoom implements ISocketRoom {
    public id: string;

    public members: Set<string>;
    public data: any;
    public status: SocketRoomStatusType;
    public constructor(
        id: string | number,
        members?: Set<string>,
        data?: any
        status?: SocketRoomStatusType,
    ) {
        this.id = typeof id === "number" ? id.toString() : id;
        this.members = members ?? new Set();
        this.data = data ?? {};
        this.status = status ?? status.empty;
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
