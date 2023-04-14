import { DEFAULT_GAME_STATE, PLAYER_TYPE } from "@src/constants/checkersData";
import {
    CheckersGameState,
    PlayerTokens,
    ValidTokens,
} from "@src/interfaces/checkersInterfaces";
import {
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

export type CheckersPlayers = [string | null, string | null];

export interface ICheckersRoomState {
    gameState: CheckersGameState;
}
export interface ICheckersRoom extends ISocketRoom {
    players: CheckersPlayers;
    data: CheckersGameState;
}
/**
 * @param
 */
export class CheckersRoom extends SocketRoom implements ICheckersRoom {
    public players: CheckersPlayers;
    public data: CheckersGameState;
    public status: CheckersRoomStatusType;
    public constructor(
        id: string,
        data?: CheckersGameState,
        status?: CheckersRoomStatusType
    ) {
        super(id);
        this.members = new Set();
        this.players = [null, null];
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
    isCurPlayer(user: string): boolean {
        if (!this.players.includes(user)) {
            throw new RoomError(ROOM_ERROR_MESSAGES.UserNotInRoom);
        }
        return this.data.curPlayer == user;
    }
    setValidSelections() {}
    start() {
        if (this.players.includes(null))
            throw new RoomError(ROOM_ERROR_MESSAGES.RoomNotFull);
        if (Math.random() > 0.5) {
            this.players = [this.players[1], this.players[0]];
        }
        this.data.turnNum = 0;
        this.status = AllCheckersRoomStatus.active;
        this.data.curPlayer = this.players[0]!;
    }
    /** Returns Num players in room */
    addPlayer(user: string): number {
        const open = this.players.indexOf(null);
        if (open == -1) {
            console.log("Error: Room is full, cant add player");
            this.status = AllCheckersRoomStatus.full;
            throw new RoomError(ROOM_ERROR_MESSAGES.RoomIsFull);
        }
        if (this.players.includes(user)) {
            throw new RoomError(ROOM_ERROR_MESSAGES.UserInRoom);
        }
        this.players[open] = user;
        this.addMember(user);
        const numPlayers = this.players.filter((p) => p != null).length;
        if (numPlayers == 2) this.status = AllCheckersRoomStatus.full;
        return numPlayers;
    }
    memberConnected(user: string) {
        if (this.players.includes(user)) {
            this.numPlayersConnected++;
            if (this.numPlayersConnected == 2) {
                this.start();
            } else this.status = AllCheckersRoomStatus.init;
        } else if (!this.members.has(user)) {
            throw new RoomError(ROOM_ERROR_MESSAGES.UserNotInRoom);
        }
    }
    removePlayer(user: string): boolean {
        if (this.players.includes(user)) {
            const index = this.players.indexOf(user);
            this.players[index] = null;
            this.removeMember(user);
            if (this.players.includes(null)) this.status = "open";
            else this.status = AllCheckersRoomStatus.full;
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
        this.data.curPlayer = this.players[this.data.turnNum % 2]!;
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
    getJoinPayload() {
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
    getInitPayload() {
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
    getUpdatePayload() {
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
