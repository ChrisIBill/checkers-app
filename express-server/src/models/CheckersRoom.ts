import { DEFAULT_GAME_STATE, PLAYER_TYPE } from "@src/constants/checkersData";
import {
    CheckersGameState,
    Checkers_Game_Status,
} from "@src/interfaces/checkersInterfaces";
import { stat } from "fs";

export type PlayerType = typeof PLAYER_TYPE[number];
export type CheckersPlayers = [
    CheckersPlayer | undefined,
    CheckersPlayer | undefined
];
export interface CheckersPlayer {
    id: string; //
    status: "connected" | "error";
}
export interface ICheckersRoom {
    id: number;
    players: [CheckersPlayer | undefined, CheckersPlayer | undefined];
    status: Checkers_Game_Status;
    gameState: CheckersGameState;
}
export class CheckersRoom implements ICheckersRoom {
    public id: number;
    public players: [CheckersPlayer | undefined, CheckersPlayer | undefined];
    public status: Checkers_Game_Status;
    public gameState: CheckersGameState;
    public constructor(
        id: number,
        status: Checkers_Game_Status,
        players?: [CheckersPlayer | undefined, CheckersPlayer | undefined],
        gameState?: CheckersGameState
    ) {
        this.id = id;
        this.players = players ?? [undefined, undefined];
        this.status = status;
        this.gameState = gameState ?? DEFAULT_GAME_STATE;
    }
    addPlayer(userName: string): number {
        console.log("Adding Player");
        for (let i in this.players) {
            if (this.players[i] == undefined) {
                this.players[i] = {
                    id: userName,
                    status: "connected",
                };
                if (!this.players.includes(undefined)) {
                    this.status = "initializing";
                    return 2;
                }
                return 1;
            }
        }
        console.log("Error");
        return 0;
    }
    updateStatus() {
        if (!this.players.includes(undefined)) {
            this.status = "";
        }
    }
}
