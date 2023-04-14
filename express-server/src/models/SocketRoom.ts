import { SOCKET_ROOM_STATUS_TYPES } from "@src/constants/SocketConsts";
import { IUser } from "./User";
import { RoomTypes } from "@src/interfaces/SocketIO-Interfaces";

export const ROOM_ERROR_MESSAGES = {
    RoomIsFull: "Room is full",
    UserInRoom: "User is already in room",
    RoomNotFull: "Room is not full",
    UserNotInRoom: "User is not in room",
    BadState: "Bad room state",
} as const;

export type RoomErrorsType =
    typeof ROOM_ERROR_MESSAGES[keyof typeof ROOM_ERROR_MESSAGES];

export class RoomError extends Error {
    constructor(message: RoomErrorsType) {
        super(message);
    }
}

export enum MemberConnectionStatus {
    Error = -1,
    Disconnected = 0,
    Reserved = 1,
    Connected = 2,
}

export interface IRoomMember {
    username?: string;
    connectionStatus: MemberConnectionStatus;
}

export const SocketRoomStatus = {
    empty: "empty",
    open: "open",
    full: "full",
    private: "private",
    init: "init",
    active: "active",
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
    members: Map<string, IRoomMember>;
    data: any;
    status: string;
}
export class SocketRoom implements ISocketRoom {
    [x: string]: any;
    public id: string;
    public members: Map<string, IRoomMember>;
    public type: RoomTypes;
    public data: any;
    public status: string;
    public constructor(
        id: string | number,
        members?: Map<string, IRoomMember>,
        type?: RoomTypes,
        data?: any,
        status?: string
    ) {
        this.id = typeof id === "number" ? id.toString() : id;
        this.members = members ?? new Map();
        this.type = type ?? "basic";
        this.data = data ?? {};
        this.status = status ?? SocketRoomStatus.empty;
    }

    public addMember(userID: string): boolean {
        if (this.members.has(userID) || this.status == "private") return false;
        this.members.set(userID, {
            connectionStatus: MemberConnectionStatus.Connected,
        });
        return true;
    }

    public removeMember(username: string): boolean {
        if (!this.members.has(username)) return false;
        this.members.delete(username);
        return true;
    }
}
