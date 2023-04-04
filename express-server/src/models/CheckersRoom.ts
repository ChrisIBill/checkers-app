import { DEFAULT_GAME_STATE, PLAYER_TYPE } from "@src/constants/checkersData";
import {
    CheckersGameState,
    Checkers_Game_Status,
} from "@src/interfaces/checkersInterfaces";
import { stat } from "fs";
import {
    ISocketRoom,
    SocketRoom,
    SocketRoomStatus,
    ValueOf,
} from "./SocketRoom";
import { IUser } from "./User";
import { RoomTypes } from "@src/interfaces/SocketIO-Interfaces";

export const CheckersRoomStatus = {
    p1turn: "p1turn",
    p2turn: "p2turn",
    gameOver: "gameOver",
} as const;
export const AllCheckersRoomStatus = {
    ...SocketRoomStatus,
    ...CheckersRoomStatus,
};
export type CheckersRoomStatusType = ValueOf<typeof AllCheckersRoomStatus>;

export const DEFAULT_CHECKERS_ROOM_STATE: ICheckersRoomState = {
    players: [null, null],
    gameState: DEFAULT_GAME_STATE,
};

export type PlayerType = typeof PLAYER_TYPE[number];

export type CheckersPlayers = [string | null, string | null];

export interface ICheckersRoomState {
    players: CheckersPlayers;
    gameState: CheckersGameState;
}
export interface ICheckersRoom extends ISocketRoom {
    data: {
        players: CheckersPlayers;
        gameState: CheckersGameState;
    };
}
/**
 * @param
 */
export class CheckersRoom extends SocketRoom implements ICheckersRoom {
    public data: ICheckersRoomState;
    public status: CheckersRoomStatusType;
    public constructor(
        id: string,
        members?: Set<string>,
        data?: ICheckersRoomState,
        status?: CheckersRoomStatusType
    ) {
        super(id, members);
        this.type = "checkers";
        this.data = data ?? DEFAULT_CHECKERS_ROOM_STATE;
        this.status = status ?? AllCheckersRoomStatus.empty;

        /* this.id = typeof id === "number" ? id.toString() : id;
        this.status = status;
        this.members = members ?? new Set();
        this.data = data ?? DEFAULT_CHECKERS_ROOM_STATE; */
    }
    getStatus(): CheckersRoomStatusType {
        return this.status;
    }
    setStatus(status: CheckersRoomStatusType): boolean {
        this.status = status;
        return true;
    }
    getGameState(): CheckersGameState {
        return this.data.gameState;
    }
    setGameState(gameState: CheckersGameState): boolean {
        this.data.gameState = gameState;
        return true;
    }
    addPlayer(user: string): boolean {
        if (this.data.players.includes(user)) {
            console.log("Error: User already in room");
            return false;
        }
        if (["empty", "open"].includes(this.status)) {
            const open = this.data.players.indexOf(null);
            if (open == -1) {
                console.log("Error: Room is full, bad status ", this.status);
                return false;
            } else {
                this.data.players[open] = user;
                this.addMember(user);
                console.log("Added player to room", this.data.players);
            }
            if (this.data.players.includes(null))
                this.status = AllCheckersRoomStatus.open;
            else this.status = AllCheckersRoomStatus.open;
        } else {
            console.log("Error: Room is full", this.status);
            return false;
        }
        return true;
    }
    removePlayer(user: string): boolean {
        if (this.data.players.includes(user)) {
            const index = this.data.players.indexOf(user);
            this.data.players[index] = null;
            this.removeMember(user);
            if (this.data.players.includes(null)) this.status = "open";
            else this.status = AllCheckersRoomStatus.full;
            return true;
        }
        return false;
    }
    /* updates board state and returns true if given boardstate is valid change, else returns false */
    updateBoardState(moves: number[]): boolean {
        return false;
    }
}
