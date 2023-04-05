/* Manages the single instance object literal representing all open
rooms. */
import { SocketRoom } from "@src/models/SocketRoom";

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
    getUserRooms(userID: string): Set<string> {
        const userRooms = this.usersInRooms.get(userID);
        if (userRooms) return userRooms;
        else {
            console.log("ERROR: User not in any rooms, userID: ", userID);
            return new Set();
        }
    },
};

export default SocketRoomsManager;
