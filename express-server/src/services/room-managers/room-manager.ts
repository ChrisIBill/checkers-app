/* Manages the single instance object literal representing all open
rooms. */
import { SocketRoom } from "@src/models/SocketRoom";

/* export interface ISocketRoomsManager {
    SocketRoomsMap: Map<string, SocketRoom>;
    usersInRooms: Map<string, Set<string>>;
    newRoom: (roomID?: string) => string;
    getUserRooms: (user: string) => Set<string>;
    joinRoom: (user: string, roomID: string) => SocketRoom;
    leaveRoom: (user: string, roomID?: string) => void;
    findRoom: (user: string) => SocketRoom | null;
    updateRoom: (roomID: string, room: SocketRoom) => Promise<boolean>;
} */
export interface ISocketRoomsManager {
    managerRoomsMap: Map<string, SocketRoom>;
    usersInRooms: Map<string, Set<string>>;
    joinRoom: (...args: any) => any;
    leaveRoom: (...args: any) => any;
    findRoom: (...args: any) => any;
    updateRoom: (...args: any) => any;
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
    updateRoom(roomID: string, room: SocketRoom): Promise<boolean> {
        console.log("ERROR: IN BASE ROOM MANAGER");
        return Promise.resolve(false);
    },
};

export default SocketRoomsManager;
