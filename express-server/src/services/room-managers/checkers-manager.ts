import { CheckersRoom } from "@src/models/CheckersRoom";
import SocketRoomsManager from "./room-manager";

const CheckersRoomsManager = {
    /** userID -> roomID */
    playersInRooms: new Map<string, string>(),
    /** roomID -> CheckersRoom */
    checkersRooms: new Map<string, CheckersRoom>(),
    /* room-id set */
    openRooms: new Set<string>(),

    newRoom(roomID?: string) {
        if (!roomID) {
            roomID = SocketRoomsManager.newRoom();
        } else {
            roomID = SocketRoomsManager.newRoom(roomID);
        }
        const room = new CheckersRoom(roomID);
        this.checkersRooms.set(roomID, room);
        this.openRooms.add(roomID);
    },
    getUserRoom(user: string) {
        const roomID = this.playersInRooms.get(user);
        if (!roomID) return null;
        return roomID;
    },
    getNextOpenRoom() {
        if (this.openRooms.size > 0) {
            const roomID = this.openRooms.values().next().value;
            return roomID;
        } else {
            return null;
        }
    },
    getBoardState(roomID: string) {
        const room = this.checkersRooms.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        return room.getBoardState();
    },
    addPlayerToRoom(roomID: string, user: string) {
        const room = this.checkersRooms.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        try {
            if (room.addPlayer(user) == 0) {
                this.openRooms.delete(roomID);
            }
            this.playersInRooms.set(user, roomID);
        } catch (e) {
            this.openRooms.delete(roomID);
            throw e;
        }
    },
};

export { CheckersRoomsManager };
