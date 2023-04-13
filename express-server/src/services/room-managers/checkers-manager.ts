import { CheckersRoom } from "@src/models/CheckersRoom";
import SocketRoomsManager, { ISocketRoomsManager } from "./room-manager";
import { findRoomForClient } from "../GamesService";
import { IPayload } from "@src/interfaces/SocketIO-Interfaces";
import { ValidTokens } from "@src/interfaces/checkersInterfaces";

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
    /*     updateRoom(user: string, roomID: string, data: any) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        if (!room.players.includes(user)) {
            throw new ReferenceError("User not in room");
        }

        try {
            const success = room.updateRoomState(user, data.moves, data.board);
            if (success) {
                return room;
            } else return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }, */

    leaveRoom(user: string, roomID?: string) {
        console.log("CheckersRoomsManager: Leaving not implemented yet");
    },
    /**
     * @deprecated, use manageRoomUpdate() instead
     */
    updateRoom(user: string, roomID: string, data: any) {
        console.log("CALL TO DEPRECATED updateRoom()");
        /* const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        if (!room.players.includes(user)) {
            throw new ReferenceError("User not in room");
        }

        try {
            const success = room.updateRoomState(user, data.moves, data.board);
            if (success) {
                return room;
            } else return null;
        } catch (error) {
            console.log(error);
            return null;
        } */
    },
    manageRoomUpdate(user: string, roomID: string, board: ValidTokens[]) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) throw new Error("Room does not exist");
        if (!room.players.includes(user)) {
            console.log("User: ", user);
            console.log("Players in rooms: ", room.players);
            throw new ReferenceError("User not in room");
        }
        if (room.data.gameState.curPlayer == user) {
            try {
                room.updateRoomState(board);
            } catch (err) {
                console.log("Error updating room");
                throw err;
            }
            return room.getUpdatePayload();
        } else {
            console.log(room.data.gameState.curPlayer);
            console.log(user);
            throw new Error("Player not current player");
        }
    },
};

export { CheckersRoomsManager };
