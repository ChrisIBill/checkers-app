import { AllCheckersRoomStatus, CheckersRoom } from "@src/models/CheckersRoom";
import randomstring from "randomstring";
import { Socket } from "socket.io";
import { PIECE_TOKENS } from "../../../client/src/constants/checkersData";
import HttpStatusCode from "../../../client/src/constants/HttpStatusCodes";
import { MatchmakingTypes } from "../../../client/src/interfaces/GameInterfaces";
import {
    CheckersRoomConnectPayload,
    IPayload,
} from "../../../client/src/interfaces/socketInterfaces";
import { zipGameState } from "../../../client/src/lib/serverHandlers";
import { CheckersGameState } from "@src/interfaces/checkersInterfaces";
import { CheckersRoomsManager } from "./room-managers/checkers-manager";
/* const playersInRooms = new Map<string, string>();
const checkersRooms = new Map<string, CheckersRoom>();
const openRoomsSet = new Set<string>(); */
export async function findCheckersRoom(
    matchType: MatchmakingTypes,
    user: string
): Promise<CheckersRoom | null> {
    if (matchType == "pvp") {
        const roomID = await findPVPCheckersRoom(user);
        if (roomID) {
            const room = CheckersRoomsManager.checkersRooms.get(roomID);
            if (!room) {
                return null;
            } else {
                /* socket.join(roomID); */
                return room;
            }
        } else {
            return null;
        }
    } else {
        console.log("ERROR: Invalid Matchmaking Type, type: ", matchType);
        return null;
    }
    /* else if (args.type === "local") {
        findLocalCheckersRoom(socket, user);
    } else if (args.type === "computer") {
        findComputerCheckersRoom(socket, user);
    } */
}
export function findPVPCheckersRoom(user: string): string | null {
    /* Checks if open room exists, if so routes them to room.
    else if matchmaking type is pvp, search for open room and add,
        if no open rooms found, make new room and add player
    elif matchmaking type is local, make new room with same player twice?
    elif matchmaking type is computer, make new room with bot as player? */
    const roomID = CheckersRoomsManager.playersInRooms.get(user) ?? null;
    const openRoomID = CheckersRoomsManager.getNextOpenRoom();
    if (roomID) {
        const success = joinCheckersRoom(roomID, user);
        if (success) return roomID;
        else {
            console.log("ERROR: could not find room player is mapped to");
            console.log("NEED TO IMPLEMENT DELETING PLAYER HERE");
        }
    } else if (openRoomID) {
        const success = joinCheckersRoom(openRoomID, user);
        if (success) return openRoomID;
        else {
            console.log("ERROR: could not find allegedly open room");
            console.log("NEED TO IMPLEMENT DELETING OPEN ROOM HERE");
        }
    } else {
        console.log("No Checkers Rooms available, creating new room");
        const newID = CheckersRoomsManager.newRoom();
        const success = joinCheckersRoom(newID, user);
        if (success) return openRoomID;
        else {
            console.log("ERROR: could not find allegedly open room");
            console.log("NEED TO IMPLEMENT DELETING OPEN ROOM HERE");
        }
    }
    return null;
}
export async function joinOpenRoom(
    user: string,
    roomID?: string
): Promise<string> {
    const room = roomID ?? CheckersRoomsManager.getNextOpenRoom();
    if (room) {
        const success = await joinCheckersRoom(room, user);
        if (success) return room;
        else {
            throw new Error("Could not join open checkers room");
        }
    } else {
        throw new Error("Couldnt find open room");
    }
}
export function joinCheckersRoom(roomID: string, user: string): boolean {
    /* Attempts to add player to given roomID, if full or otherwise fails,
        returns false */
    try {
        CheckersRoomsManager.addPlayerToRoom(roomID, user);
    } catch (e) {
        console.log("ERROR: Could not add player to room: ", e);
        /* Does this work? */
        return false;
    }
    const room = CheckersRoomsManager.checkersRooms.get(roomID);
    if (!room) {
        console.log("ERROR: Room doesnt exist");
        return false;
    }
    /* Need to move */
    /* if (room.status == AllCheckersRoomStatus.full) {
        console.log("Room is full, running init function");
        const init = await initCheckersRoom(roomID);
        if (!init) return false;
    } */
    return true;
}

export async function updateCheckersRoom(roomID: string): Promise<IPayload> {
    const room = CheckersRoomsManager.checkersRooms.get(roomID);
    if (!room) {
        throw new Error("Room doesnt exist");
    }
    const curPlayer = room.getCurrentPlayerName();
    const data = CheckersRoomsManager.getRoomPayload(roomID);
    const payload: IPayload = {
        status: HttpStatusCode.OK,
        data: data,
    };
    return payload;
}

/* NEED TO UPDATE */
/* !!!!!!!!!!!!!!!! */
export async function leaveCheckersRoom(user: string) {
    const roomID = CheckersRoomsManager.playersInRooms.get(user);
    if (roomID) {
        const room = CheckersRoomsManager.checkersRooms.get(roomID);
        if (room) {
            room.removePlayer(user);
            CheckersRoomsManager.playersInRooms.delete(user);
            if (room.players.some((p) => p !== null)) {
                room.status = "open";
                CheckersRoomsManager.openRooms.add(roomID);
                return 1;
            } else {
                console.log("Room is empty, deleting room");
                CheckersRoomsManager.openRooms.delete(roomID);
                CheckersRoomsManager.checkersRooms.delete(roomID);
                return 0;
            }
            console.log(`Player ${user} left room ${roomID}`);
        } else {
            console.log("ERROR: Room does not exist");
            return -1;
        }
    } else {
        console.log("ERROR: Player not in any rooms");
        return -1;
    }
}

/* Handles validating client update data  */
export async function checkersUpdateRoom(
    user: string,
    gameState: CheckersGameState
) {
    const room = CheckersRoomsManager.getUserRoom(user);

    if (!room) {
        throw new Error("ERROR: Room does not exist");
    }
}
