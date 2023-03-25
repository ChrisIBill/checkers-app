import { CheckersRoom } from "@src/models/CheckersRoom";
import { IUser } from "@src/models/User";
import { findUserFromToken } from "@src/services/myAuthService";
import { createServer } from "http";
import randomstring from "randomstring";
import { Server, Socket } from "socket.io";
import Paths from "../routes/constants/Paths";
import { IPayload } from "../interfaces/SocketIO-Interfaces";
import HttpStatusCode from "../../../client/src/constants/HttpStatusCodes";
/**
 *
 * @param io CheckersRoomPath
 * @param socket Client Socket
 */
const playersInRooms = new Map<string, string>();
const checkersRooms = new Map<string, CheckersRoom>();
const openRoomsSet = new Set<string>();

export async function findCheckersRoom(socket: Socket, user: string) {
    /* Checks if open room exists, if so routes them to room.
    else if matchmaking type is pvp, search for open room and add,
        if no open rooms found, make new room and add player
    elif matchmaking type is local, make new room with same player twice?
    elif matchmaking type is computer, make new room with bot as player? */
    let success = false;
    const roomID = playersInRooms.get(user);
    if (roomID) {
        if (await joinCheckersRoom(socket, roomID, user)) success = true;
    } else if (openRoomsSet.size > 0) {
        console.log("Found open room, joining room");
        const openRoomID = openRoomsSet.values().next().value;
        if (await joinCheckersRoom(socket, openRoomID, user)) success = true;
        else {
            console.log(
                "ERROR: Could not join open room, room-id: ",
                openRoomID
            );
            console.log("Room Data: ", checkersRooms.get(openRoomID));
        }
    } else {
        console.log("Player not found in any room, creating new room");
        let newID = "default";
        while (checkersRooms.has(newID)) {
            newID = randomstring.generate(10);
        }
        const newRoom = new CheckersRoom(newID, "open");
        newRoom.addPlayer(user);
        playersInRooms.set(user, newID);
        checkersRooms.set(newID, newRoom);
        openRoomsSet.add(newID);
        /* Need better checking for any potential issues */
        success = true;
    }
    const payload: IPayload = {
        status: success
            ? HttpStatusCode.OK
            : HttpStatusCode.INTERNAL_SERVER_ERROR,
    };
    console.log("Sending gamesJoinRoomRes to client: ", payload);
    socket.emit("gamesJoinRoomRes", payload);
}
export async function findOpenRoom(
    socket: Socket,
    roomID: string,
    user: string
): Promise<boolean> {
    const room = checkersRooms.get(openRoomsSet.values().next().value);
    if (room) {
        if (await joinCheckersRoom(socket, roomID, user)) return true;
    } else {
        console.log("ERROR: Couldnt join open room");
        openRoomsSet.delete(roomID);
        return false;
    }
    console.log("ERROR: open room doesnt exist");
    return false;
}
export async function joinCheckersRoom(
    socket: Socket,
    roomID: string,
    user: string
): Promise<boolean> {
    /* Checks if user is already in room, if so routes them to room.
    else if matchmaking type is pvp, search for open room and add,
        if no open rooms found, make new room and add player
    elif matchmaking type is local, make new room with same player twice?
    elif matchmaking type is computer, make new room with bot as player? */
    console.log("Player already in game, redirecting to room");
    const room = checkersRooms.get(roomID);
    if (room) {
        console.log("Room found, joining room");
        if (["empty", "open", "missingPlayer"].includes(room.status)) {
            if (room.addPlayer(socket.id) == false) return false;
            if (room.data.players.includes(null)) room.status = "open";
            else {
                /* Room is full, run init function */
            }
        }
        socket.join(`CheckersRoom_${roomID}`);
        socket.emit("checkers room data", room);
        return true;
    } else {
        console.log("ERROR: Room does not exist");
        return false;
    }
}

/* function addPlayer(userName: string, players: ): boolean {
        console.log("Adding Player");
        for (let p of players) {
            if (p == undefined) {
                p = {
                    id: userName,
                    status: "connected",
                };
                if (!players.includes(undefined)) {
                    this.status = "initializing";
                }
                return true;
            }
        }
        console.log("Error");
        return false;
} */
