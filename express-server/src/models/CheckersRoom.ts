import { DEFAULT_GAME_STATE, PLAYER_TYPE } from "@src/constants/checkersData";
import {
    CheckersGameState,
    PlayerTokens,
    ValidTokens,
} from "@src/interfaces/checkersInterfaces";
import {
    IRoomMember,
    ISocketRoom,
    ROOM_ERROR_MESSAGES,
    RoomError,
    SocketRoom,
    SocketRoomStatus,
    ValueOf,
} from "./SocketRoom";
import { findValidMoves, zipGameState } from "@src/util/CheckersUtil";
import { ParameterError } from "@src/util/Errors";
import { USER_NOT_FOUND_ERR } from "../services/myUserService";
import { IRoomPayload } from "@src/interfaces/SocketIO-Interfaces";
import { findUserFromToken } from "@src/services/myAuthService";
import { getRandomKey } from "@src/util/misc";

export const CheckersRoomStatus = {
    gameOver: "gameOver",
} as const;
export const AllCheckersRoomStatus = {
    ...SocketRoomStatus,
    ...CheckersRoomStatus,
};
export type CheckersRoomStatusType = ValueOf<typeof AllCheckersRoomStatus>;

export const DEFAULT_CHECKERS_ROOM_STATE: ICheckersRoomState = {
    gameState: DEFAULT_GAME_STATE,
};

export type PlayerType = typeof PLAYER_TYPE[number];

/* export type PlayerType = [string, (PlayerTokens | null)]; */
export enum MemberConnectionStatus {
    Error = -1,
    Disconnected = 0,
    Reserved = 1,
    Connected = 2,
}
export interface IRoomMember {
    username?: string;
    connectionStatus: MemberConnectionStatus;
}
export type CheckersPlayer = IRoomMember | null;
export interface ICheckersRoomState {
    gameState: CheckersGameState;
}
export interface ICheckersRoom extends ISocketRoom {
    players: Map<string, CheckersPlayer>;
    data: CheckersGameState;
}
/**
 * @param
 */
export class CheckersRoom extends SocketRoom implements ICheckersRoom {
    public players: Map<string, CheckersPlayer>;
    public data: CheckersGameState;
    public status: CheckersRoomStatusType;
    public constructor(
        id: string,
        data?: CheckersGameState,
        status?: CheckersRoomStatusType
    ) {
        super(id);
        this.members = new Map();
        this.players = new Map();
        this.type = "checkers";
        this.data = data ?? DEFAULT_GAME_STATE;
        this.status = status ?? AllCheckersRoomStatus.empty;
    }
    numPlayersConnected = 0;
    setGameState(gameState: CheckersGameState): boolean {
        this.data = gameState;
        return true;
    }
    getBoardState(): ValidTokens[] {
        return this.data.boardState;
    }
    getZippedBoardState(): string {
        return zipGameState(this.data.boardState);
    }
    setBoardState(boardState: ValidTokens[]): boolean {
        if (boardState.length != 32)
            throw new RoomError(ROOM_ERROR_MESSAGES.BadState);
        this.data.boardState = boardState;
        return true;
    }
    isCurPlayer(userID: string): boolean {
        if (!this.players.has(userID)) {
            throw new RoomError(ROOM_ERROR_MESSAGES.UserNotInRoom);
        }
        return this.data.curPlayer == userID;
    }
    setValidSelections() {}
    start() {
        if (this.players.size != 2)
            throw new RoomError(ROOM_ERROR_MESSAGES.RoomNotFull);
        this.data.turnNum = 0;
        this.status = AllCheckersRoomStatus.active;
        this.data.curPlayer = getRandomKey(this.players);
    }
    /** Returns Num players in room */
    addPlayer(userID: string, username: string): number {
        const size = this.players.size;
        if (this.players.size >= 2) {
            console.log("Error: Room is full, cant add player");
            this.status = AllCheckersRoomStatus.full;
            throw new RoomError(ROOM_ERROR_MESSAGES.RoomIsFull);
        }
        if (this.players.has(userID)) {
            throw new RoomError(ROOM_ERROR_MESSAGES.UserInRoom);
        }
        this.players.set(userID, {
            username,
            connectionStatus: MemberConnectionStatus.Reserved,
        });
        this.addMember(userID);
        const numPlayers = this.players.size;
        if (numPlayers == 2) this.status = AllCheckersRoomStatus.full;
        else if (numPlayers > 2)
            throw new RoomError(ROOM_ERROR_MESSAGES.BadState);
        return numPlayers;
    }
    memberConnected(userID: string) {
        console.log("Players: ", this.players);
        console.log("Members: ", this.members);
        const playerData = this.players.get(userID);
        const memberData = this.members.get(userID);
        if (
            playerData &&
            playerData.connectionStatus != MemberConnectionStatus.Connected
        ) {
            playerData.connectionStatus = MemberConnectionStatus.Connected;
            this.numPlayersConnected++;
            if (this.numPlayersConnected == 2) {
                this.start();
            } else this.status = AllCheckersRoomStatus.init;
        } else if (memberData) {
            /* TODO */
            memberData.connectionStatus = MemberConnectionStatus.Connected;
        } else {
            throw new RoomError(ROOM_ERROR_MESSAGES.UserNotInRoom);
        }
    }
    removePlayer(userID: string): boolean {
        if (this.players.has(userID)) {
            this.players.delete(userID);
            this.removeMember(userID);
            this.players.size == 0
                ? (this.status = AllCheckersRoomStatus.empty)
                : this.players.size == 1
                ? (this.status = AllCheckersRoomStatus.open)
                : this.players.size == 2
                ? (this.status = AllCheckersRoomStatus.full)
                : (this.status = AllCheckersRoomStatus.error);
            return true;
        }
        return false;
    }
    /* updates board state and returns true if given boardstate is valid change, else returns false */
    updateRoomState(board: ValidTokens[]) {
        console.log("Updating room state");
        console.log("New board: ", board);
        if (board.length != 32)
            throw new ParameterError("Invalid board length");
        console.log("Setting board state, ", board);
        this.data.boardState = board;
        this.data.turnNum++;
        /* TODO */
        /* Definitely can be improved */
        this.data.curPlayer = this.players.forEach;
    }
    getPlayerName(playerID: string): string {
        return playerID;
    }
    async getCurrentPlayerName() {
        const playerID = this.data.curPlayer;
        const playerName = this.getPlayerName(playerID);
        return playerName;
    }
    getPayload() {
        return {
            boardState: this.getZippedBoardState(),
            roomStatus: this.status,
            curPlayer: this.data.curPlayer,
            turnNum: this.data.turnNum,
            validSels: this.data.validSels,
        };
    }
    getJoinPayload(): IRoomPayload {
        return {
            roomInfo: {
                roomType: this.type,
                roomID: this.id,
            },
            data: {
                status: this.status,
                boardState: this.getZippedBoardState(),
            },
        };
    }
    getInitPayload(): IRoomPayload {
        return {
            roomInfo: {
                roomType: this.type,
                roomID: this.id,
            },
            data: {
                status: this.status,
                boardState: this.getZippedBoardState(),
                players: this.players,
                curPlayer: this.data.curPlayer,
                validSels: this.data.validSels,
            },
        };
    }
    getUpdatePayload(): IRoomPayload {
        return {
            roomInfo: {
                roomType: this.type,
                roomID: this.id,
            },
            data: {
                status: this.status,
                boardState: this.getZippedBoardState(),
                curPlayer: this.data.curPlayer,
                validSels: this.data.validSels,
            },
        };
    }
}
