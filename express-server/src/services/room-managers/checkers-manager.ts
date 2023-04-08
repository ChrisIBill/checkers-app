import { CheckersRoom } from "@src/models/CheckersRoom";
import SocketRoomsManager, { ISocketRoomsManager } from "./room-manager";
import { findRoomForClient } from "../GamesService";
import { IPayload } from "@src/interfaces/SocketIO-Interfaces";

/* export interface ICheckersRoomsManager{
    playersInRooms: Map<string, string>;
    checkersRooms: Map<string, CheckersRoom>;
    openRooms: Set<string>;
    newRoom(roomID?: string): string;
    getUserRoom(user: string): string | null;
    getNextOpenRoom(): string | null;
    joinRoom(roomID: string, user: string): boolean;
    leaveRoom(user: string): number;
    findRoomForClient(user: string): string | null;
}; */

const CheckersRoomsManager = {
    usersInRooms: new Map<string, Set<string>>(),
    /** userID -> roomID */
    playersInRooms: new Map<string, string>(),
    /** roomID -> CheckersRoom */
    managerRoomsMap: new Map<string, CheckersRoom>(),
    /* room-id set */
    openRooms: new Set<string>(),

    newRoom(roomID?: string) {
        if (!roomID) {
            roomID = SocketRoomsManager.newRoom();
        } else {
            roomID = SocketRoomsManager.newRoom(roomID);
        }
        const room = new CheckersRoom(roomID);
        this.managerRoomsMap.set(roomID, room);
        this.openRooms.add(roomID);
        return roomID;
    },
    getUserRoom(user: string) {
        const roomID = this.playersInRooms.get(user);
        if (!roomID) return null;
        return roomID;
    },
    getNextOpenRoom(): string | null {
        if (this.openRooms.size > 0) {
            const roomID = this.openRooms.values().next().value;
            return roomID;
        } else {
            return null;
        }
    },
    getRoomPayload(roomID: string) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        const payload = {
            ...room.getPayload(),
            roomID: roomID,
        };
        return payload;
    },
    addPlayerToRoom(roomID: string, user: string) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        try {
            if (room.addPlayer(user) == 2) {
                console.log("Room is full, deleting from open rooms");
                this.openRooms.delete(roomID);
            }
            this.playersInRooms.set(user, roomID);
        } catch (e) {
            this.openRooms.delete(roomID);
            throw e;
        }
    },
    getBoardState(roomID: string) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        return room.getBoardState();
    },
    getCurrentPlayer(roomID: string) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        return room.getCurrentPlayerName();
    },
    getPlayerID(roomID: string, user: string) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        if (!room.players.includes(user)) {
            throw new ReferenceError("User not in room");
        }
        return user;
    },
    listRooms() {
        console.log("Listing rooms");
        this.managerRoomsMap.forEach((room) => {
            console.log(room);
        });
    },

    /* Services */
    joinRoom(user: string, roomID: string) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        if (!room.players.includes(user)) {
            throw new ReferenceError("User not in room");
            /* TODO */
            /* Better handle this, maybe try to add user */
        }
        const payload = room.getJoinPayload();
        console.log("Room Join Payload: " + payload);
        return payload;
    },
    findRoom(user: string) {
        const roomID =
            this.getUserRoom(user) ?? this.getNextOpenRoom() ?? this.newRoom();
        if (!roomID) throw new Error("Could not find room for client");
        try {
            this.addPlayerToRoom(roomID, user);
        } catch (error) {
            console.log("Error adding player to room: " + error);
            if (
                error instanceof ReferenceError &&
                error.message == "User already in room"
            ) {
                return roomID;
            }
            return null;
        }
        return roomID;
    },
    initRoom(roomID: string) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        room.init();
    },

    leaveRoom(user: string, roomID?: string) {
        console.log("CheckersRoomsManager: Leaving not implemented yet");
    },
    async updateRoom(
        user: string,
        roomID: string,
        args: IPayload
    ): Promise<CheckersRoom | null> {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        if (!room.players.includes(user)) {
            throw new ReferenceError("User not in room");
        }

        try {
            const success = await room.updateRoomState(user, args.data.moves);
            if (success) {
                return room;
            } else return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
};

export { CheckersRoomsManager };
