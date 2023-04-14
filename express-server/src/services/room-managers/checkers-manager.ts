import { AllCheckersRoomStatus, CheckersRoom } from "@src/models/CheckersRoom";
import SocketRoomsManager, {
    ISocketRoomsManager,
    MANAGER_ERROR_MESSAGES,
    RoomManagerError,
} from "./room-manager";
import { findRoomForClient } from "../GamesService";
import { IPayload } from "@src/interfaces/SocketIO-Interfaces";
import { ValidTokens } from "@src/interfaces/checkersInterfaces";
import { ROOM_ERROR_MESSAGES, RoomError } from "@src/models/SocketRoom";

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
            throw new RoomManagerError(MANAGER_ERROR_MESSAGES.RoomIDNotInMap);
        }
        const payload = {
            ...room.getPayload(),
            roomID: roomID,
        };
        return payload;
    },
    addPlayerToRoom(roomID: string, user: string) {
        const room = this.managerRoomsMap.get(roomID);
        try {
            room!.addPlayer(user);
            this.playersInRooms.set(user, roomID);
        } catch (e) {
            if (
                e instanceof RoomError &&
                e.message === ROOM_ERROR_MESSAGES.RoomIsFull
            ) {
                this.openRooms.delete(roomID);
            }
            throw e;
        }
    },
    reserveRoomForPlayer(roomID: string, user: string) {
        /* TODO */
        const room = this.managerRoomsMap.get(roomID);
    },
    getBoardState(roomID: string) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new RoomManagerError(MANAGER_ERROR_MESSAGES.RoomIDNotInMap);
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
    listRooms() {
        console.log("Listing rooms");
        this.managerRoomsMap.forEach((room) => {
            console.log(room);
        });
    },

    /* Services */
    findRoom(user: string) {
        /* TODO */
        /* Need to reserve space in room for user token for short time */
        const roomID =
            this.getUserRoom(user) ?? this.getNextOpenRoom() ?? this.newRoom();
        if (!roomID)
            throw new RoomManagerError(MANAGER_ERROR_MESSAGES.NoRoomFound);
        return roomID;
    },
    joinRoom(user: string, roomID: string) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new RoomManagerError(MANAGER_ERROR_MESSAGES.RoomIDNotInMap);
        }
        if (!room.players.has(user)) {
            console.log("User not in room, attempting to add");
            try {
                this.addPlayerToRoom(roomID, user);
            } catch (e) {
                console.log("Error adding player to room: " + e);
                if (
                    e instanceof RoomError &&
                    e.message == ROOM_ERROR_MESSAGES.UserInRoom
                ) {
                    console.log("User already in room, returning roomID");
                    return room.getJoinPayload();
                } else throw e;
            }
        }
        return room.getJoinPayload();
    },
    /** @deprecated */
    initRoom(roomID: string) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new ReferenceError("Room does not exist");
        }
        room.init();
    },
    startRoom(roomID: string) {
        /* TODO */
        /* Should probably improve room state checking to ensure everything is good to go */
        /* However, room state really should be valid */
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new RoomManagerError(MANAGER_ERROR_MESSAGES.RoomIDNotInMap);
        }
        if (room.status !== AllCheckersRoomStatus.active) {
            throw new RoomError(ROOM_ERROR_MESSAGES.BadState);
        }
        return room.getInitPayload();
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
    memberConnected(user: string, roomID: string) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room) {
            throw new RoomManagerError(MANAGER_ERROR_MESSAGES.RoomIDNotInMap);
        }
        try {
            room.memberConnected(user);
        } catch (e) {
            throw e;
        }
        return room.status;
    },
    leaveRoom(user: string, roomID?: string) {
        console.log("CheckersRoomsManager: Leaving not implemented yet");
    },
    manageRoomUpdate(user: string, roomID: string, board: ValidTokens[]) {
        const room = this.managerRoomsMap.get(roomID);
        if (!room)
            throw new RoomManagerError(MANAGER_ERROR_MESSAGES.RoomIDNotInMap);
        try {
            if (!room.isCurPlayer(user)) {
                throw new RoomManagerError(
                    MANAGER_ERROR_MESSAGES.NotCurrentPlayer
                );
            }
            room.updateRoomState(board);
        } catch (e) {
            throw e;
        }
        return room.getUpdatePayload();
    },
};

export { CheckersRoomsManager };
