import { CheckersRoom } from "@src/models/CheckersRoom";
import SocketRoomsManager from "./room-manager";

const CheckersRoomsManager = {
    playersInRooms: new Map<string, string>(),
    checkersRooms: new Map<string, CheckersRoom>(),
    openRoomsSet: new Set<string>(),
    newRoom(roomID?: string) {
        if (!roomID) {
            roomID = SocketRoomsManager.newRoom();
        } else {
            roomID = SocketRoomsManager.newRoom(roomID);
        }
        const room = new CheckersRoom(roomID);
        this.checkersRooms.set(roomID, room);
        this.openRoomsSet.add(roomID);
    },
};

export { CheckersRoomsManager };
