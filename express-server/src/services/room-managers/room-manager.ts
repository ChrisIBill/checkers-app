/* Manages the single instance object literal representing all open
rooms. */
import { SocketRoom } from "@src/models/SocketRoom";

export const MANAGER_ERROR_MESSAGES = {
    RoomIDNotInMap: "No room found in map with given ID",
    NoRoomFound: "No room found",
    NotCurrentPlayer: "Invalid user ID to update room",
} as const;

export type RoomErrorsType =
    typeof MANAGER_ERROR_MESSAGES[keyof typeof MANAGER_ERROR_MESSAGES];

export class RoomManagerError extends Error {
    constructor(message: RoomErrorsType) {
        super(message);
    }
}

export interface IRoomPayload {
    roomInfo: {};
    data: {};
}
export interface ISocketRoomsManager {
    managerRoomsMap: Map<string, SocketRoom>;
    usersInRooms: Map<string, Set<string>>;
    findRoom: (...args: any) => any;
    joinRoom: (...args: any) => IRoomPayload;
    memberConnected: (...args: any) => any;
    leaveRoom: (...args: any) => any;
    initRoom: (...args: any) => any;
    manageRoomUpdate: (...args: any) => any;
    listRooms: (...args: any) => any;
}
const SocketRoomsManager = {
    /* room-id -> Room */
    SocketRoomsMap: new Map<string, SocketRoom>(),
    /* user-id -> room-id(`s) */
    usersInRooms: new Map<string, Set<string>>(),
    newRoom(roomID?: string): string {
        if (!roomID) {
            roomID = Math.random().toString(36);
            console.log("Generated roomID: ", roomID);
            while (this.SocketRoomsMap.has(roomID)) {
                roomID = Math.random().toString(36);
                console.log("Generated roomID: ", roomID);
            }
        } else if (this.SocketRoomsMap.has(roomID)) {
            console.log("ERROR: Room already exists, roomID: ", roomID);
            console.log("Generating new roomID as fallback");
            return this.newRoom();
        }
        const room = new SocketRoom(roomID);
        this.SocketRoomsMap.set(roomID, room);
        return roomID;
    },
    getRoom(roomID: string): SocketRoom | null {
        const room = this.SocketRoomsMap.get(roomID);
        if (room) return room;
        else {
            console.log("ERROR: Room does not exist, roomID: ", roomID);
            return null;
        }
    },
    getUserRooms(userID: string): Set<string> {
        const userRooms = this.usersInRooms.get(userID);
        if (userRooms) return userRooms;
        else {
            console.log("ERROR: User not in any rooms, userID: ", userID);
            return new Set();
        }
    },
    joinRoom(userID: string, roomID: string): SocketRoom {
        console.log("ERROR: IN BASE ROOM MANAGER");
        return new SocketRoom("ERROR");
    },
    leaveRoom(userID: string, roomID?: string): void {
        console.log("ERROR: IN BASE ROOM MANAGER");
    },
    findRoom(userID: string): SocketRoom | null {
        console.log("ERROR: IN BASE ROOM MANAGER");
        return null;
    },
    initRoom(roomID: string): SocketRoom | null {
        console.log("ERROR: IN BASE ROOM MANAGER");
        return null;
    },
    /**
     * @deprecated Use manageRoomUpdate() instead
     */
    updateRoom(roomID: string, room: SocketRoom): Promise<boolean> {
        console.log("ERROR: IN BASE ROOM MANAGER");
        return Promise.resolve(false);
    },
    manageRoomUpdate() {
        console.log("ERROR: IN BASE ROOM MANAGER");
        return null;
    },
    memberConnected() {
        console.log("ERROR: IN BASE ROOM MANAGER");
        return null;
    },
};

export default SocketRoomsManager;
