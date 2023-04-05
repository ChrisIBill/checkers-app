import { DEFAULT_GAME_STATE, PLAYER_TYPE } from "@src/constants/checkersData";
import {
    CheckersGameState,
    ValidTokens,
} from "@src/interfaces/checkersInterfaces";
import {
    ISocketRoom,
    SocketRoom,
    SocketRoomStatus,
    ValueOf,
} from "./SocketRoom";
import { zipGameState } from "@src/util/CheckersUtil";

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
    gameState: DEFAULT_GAME_STATE,
};

export type PlayerType = typeof PLAYER_TYPE[number];

export type CheckersPlayers = [string | null, string | null];

export interface ICheckersRoomState {
    gameState: CheckersGameState;
}
export interface ICheckersRoom extends ISocketRoom {
    players: CheckersPlayers;
    data: {
        gameState: CheckersGameState;
    };
}
/**
 * @param
 */
export class CheckersRoom extends SocketRoom implements ICheckersRoom {
    public players: CheckersPlayers;
    public data: {
        gameState: CheckersGameState;
    };
    public status: CheckersRoomStatusType;
    public constructor(
        id: string,
        data?: ICheckersRoomState,
        status?: CheckersRoomStatusType
    ) {
        super(id);
        this.members = new Set();
        this.players = [null, null];
        this.type = "checkers";
        this.data = data ?? DEFAULT_CHECKERS_ROOM_STATE;
        this.status = status ?? AllCheckersRoomStatus.empty;
    }
    getGameState(): CheckersGameState {
        return this.data.gameState;
    }
    setGameState(gameState: CheckersGameState): boolean {
        this.data.gameState = gameState;
        return true;
    }
    getBoardState(): ValidTokens[] {
        return this.data.gameState.boardState;
    }
    /** Returns Num players in room */
    addPlayer(user: string): number {
        if (this.players.includes(user)) {
            throw new ReferenceError("User already in room");
        }
        const open = this.players.indexOf(null);
        if (open == -1) {
            /* If full, return -1 instead of throwing to handle removing from room manager */
            console.log("Error: Room is full, bad status ", this.status);
            this.status = AllCheckersRoomStatus.full;
            throw new ReferenceError("Room was already full");
        }
        this.players[open] = user;
        this.addMember(user);
        const numPlayers = this.players.filter((p) => p != null).length;
        if (numPlayers == 0) this.status = AllCheckersRoomStatus.full;
        return numPlayers;
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
    updateBoardState(moves: number[]): boolean {
        return false;
    }
    getPlayerName(playerID: string): string {
        return playerID;
    }
    async getCurrentPlayerName() {
        const playerID = this.data.gameState.curPlayer;
        const playerName = this.getPlayerName(playerID);
        return playerName;
    }
    getPayload() {
        return {
            boardState: zipGameState(this.getBoardState()),
            curPlayer: this.data.gameState.curPlayer,
            turnNum: this.data.gameState.turnNum,
        };
    }
}
