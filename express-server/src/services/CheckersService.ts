import { CheckersRoom } from "@src/models/CheckersRoom";
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
const playersInRooms = new Map<string, string>();
const checkersRooms = new Map<string, CheckersRoom>();
const openRoomsSet = new Set<string>();
export async function findCheckersRoom(
    socket: Socket,
    matchType: MatchmakingTypes,
    user: string
): Promise<CheckersRoom | null> {
    if (matchType == "pvp") {
        const roomID = await findPVPCheckersRoom(user);
        if (roomID) {
            const room = checkersRooms.get(roomID);
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
export async function findPVPCheckersRoom(
    user: string
): Promise<string | null> {
    /* Checks if open room exists, if so routes them to room.
    else if matchmaking type is pvp, search for open room and add,
        if no open rooms found, make new room and add player
    elif matchmaking type is local, make new room with same player twice?
    elif matchmaking type is computer, make new room with bot as player? */
    const roomID = playersInRooms.get(user);
    if (roomID) {
        const success = await joinCheckersRoom(roomID, user);
        if (success) return roomID;
        else {
            console.log("ERROR: Could not join checkers room: ", roomID);
        }
    } else if (openRoomsSet.size > 0) {
        console.log("Found open room, joining room");
        const openRoomID: string = openRoomsSet.values().next().value;
        console.log("Open Room ID: ", openRoomID);
        const suc = await joinCheckersRoom(openRoomID, user);
        if (suc && suc == true) return openRoomID;
        else {
            console.log(
                "ERROR: Could not join open room, room-id: ",
                openRoomID
            );
            console.log("Room Data: ", checkersRooms.get(openRoomID));
            return null;
        }
    } else {
        console.log("No Checkers Rooms available, creating new room");
        let newID = "default";
        while (checkersRooms.has(newID)) {
            newID = randomstring.generate(10);
        }
        const newRoom = new CheckersRoom(newID, "open");
        checkersRooms.set(newID, newRoom);
        const success = await joinCheckersRoom(newID, user);
        if (!success) {
            console.log("ERROR: Could not join new room");
            return null;
        } else {
            console.log("Joined new room");
            return newID;
        }
    }
    return null;
    /* const payload: IPayload = {
        status: success
            ? HttpStatusCode.OK
            : HttpStatusCode.INTERNAL_SERVER_ERROR,
        data: roomID
    };
    console.log("Sending gamesJoinRoomRes to client: ", payload);
    socket.emit("gamesJoinRoomRes", payload); */
}
export async function findOpenRoom(
    roomID: string,
    user: string
): Promise<boolean> {
    const room = checkersRooms.get(openRoomsSet.values().next().value);
    if (room) {
        if (await joinCheckersRoom(roomID, user)) return true;
    } else {
        console.log("ERROR: Couldnt join open room");
        openRoomsSet.delete(roomID);
        return false;
    }
    console.log("ERROR: open room doesnt exist");
    return false;
}
export async function joinCheckersRoom(
    roomID: string,
    user: string
): Promise<boolean> {
    /* Attempts to add player to given roomID, if full or otherwise fails,
        returns false */
    const room = checkersRooms.get(roomID);
    if (room) {
        console.log("Room found, joining room");
        if (["empty", "open", "missingPlayer"].includes(room.status)) {
            if (room.addPlayer(user) == true) {
                playersInRooms.set(user, roomID);
                openRoomsSet.add(roomID);
                console.log(`Player ${user} joined room ${roomID}`);
            } else {
                console.log(
                    `ERROR: Could not add player ${user} to room ${roomID}`
                );
                return false;
            }
            /* socket.emit("checkers room data", room); */
            if (room.data.players.includes(null)) room.status = "open";
            else {
                /* Room is full, run init function */
                console.log("Room is full, running init function");
                const init = await connectCheckersRoom(roomID);
                if (!init) return false;
                else room.status = "full";
            }
            return true;
        } else {
            console.log("Bad room status, status: ", room.status);
            return false;
        }
    } else {
        console.log(`ERROR: Room ${roomID} does not exist`);
        return false;
    }
}

export async function connectCheckersRoom(roomID: string): Promise<boolean> {
    const roomData = checkersRooms.get(roomID);
    if (!roomData) {
        /* socket.emit("gamesCheckersRoomConnect", {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        }); */
        console.log("ERROR: Room does not exist");
        return false;
    }
    const data = {
        boardState: zipGameState(roomData.data.gameState.boardState),
        playerTokens: PIECE_TOKENS[0],
        curPlayer: roomData.data.players[0]!,
        turnNum: 0,
    };
    const payload: CheckersRoomConnectPayload = {
        status: HttpStatusCode.OK,
        data: data,
    };
    console.log("Sending gamesCheckersRoomConnect to client: ", payload);
    /* socket.emit("gamesCheckersRoomConnect", payload); */
    return true;
}

export async function getCheckersRoom(
    user: string
): Promise<CheckersRoom | null> {
    const roomID = playersInRooms.get(user);
    if (roomID) {
        if (checkersRooms.has(roomID)) return checkersRooms.get(roomID)!;
        else {
            console.log(
                "ERROR: Room in playersInRooms does not exist, roomID: ",
                roomID
            );
            return null;
        }
    } else {
        console.log("Player not in any rooms, user: ", user);
        return null;
    }
}
