import { CLIENT_PATHS, NEW_CLIENT_PATHS } from "@src/constants/ClientPaths";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { PlayerTokens } from "./checkersInterfaces";
import { GameTypes, MatchmakingTypes } from "./GameInterfaces";

export interface ISocketResponse {
    status: HttpStatusCodes;
}

interface ExpressServerConnectionEvent {
    message: string;
}

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}

interface InterServerEvents {
    ping: () => void;
}

/* Auth Socket */
export interface ServerToClientAuthEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    initServerHandshake: (move_desc: string, gameState: string) => void;
    checkersRoomInit: (gameState: string) => void;
    redirect: (args: IPayload) => void;
    authSignUpRes: (args: IPayload) => void;
    authLoginRes: (...args: any[]) => void;
}

export interface ClientToServerAuthEvents {
    authSignUpReq: (args: IPayload) => void;
    authLoginReq: (args: IPayload) => void;
}

/* Game Socket */
/* Server */
/**
 * @property status: HTTPStatusCode
 * @property data: {
 *    @property boardState: string
 * 	  @property playerTokens: PlayerTokens
 *    @property isClientTurn: boolean
 *    @property turnNum?: number
 */
export interface CheckersRoomConnectPayload extends ISocketResponse {
    data?: {
        boardState: string;
        playerTokens: PlayerTokens;
        curPlayer: string;
        turnNum?: number;
    };
}
export interface CheckersUpdateClientType extends ISocketResponse {
    /* status: if  */
    data?: {
        boardState: string;
        movesList: MovesListType;
        isClientTurn: string;
        turnNum?: number;
    };
}
export interface ServerToClientGameEvents {
    /* just a standard status response informing client of success/failure w/ roomID as data*/
    gamesJoinRoomRes: (args: IPayload) => void;
    /* Need to decide if rooms should be closed when empty or not */
    gamesLeaveRoomRes: (args: IPayload) => void;
    /* Handles room connection, gives client room id (or name), the current board state (default if new game),
	 their token type*/
    gamesCheckersRoomConnect: (args: CheckersRoomConnectPayload) => void;
    /* Provides updated game state */
    gamesUpdateClientGameState: (args: CheckersUpdateClientType) => void;
    /* just an http status res on the validity of the client update */
    gamesUpdateServerRes: (args: ISocketResponse) => void;
}
export type RoomTypes = "checkers";
export interface ClientJoinRoomReqType {
    roomType: RoomTypes;
    matchmakingType?: MatchmakingTypes;
    roomID?: string;
}
/* Array of moves, contains orig index of piece and index of move loc */
export type MovesListType = [[number, number]];
export interface CheckersUpdateServerType extends ISocketResponse {
    /* status: if error in loading status res here? */
    data: {
        boardState: string /* p12E8P12 or the like */;
        movesList: MovesListType /*  */;
    };
}
export interface ClientToServerGameEvents {
    gamesJoinRoomReq: (args: ClientJoinRoomReqType) => void;
    gamesLeaveRoomReq: (args: IPayload) => void;
    /* Gives server players moves, server needs to check for validity and legality */
    gamesUpdateServerGameState: (args: CheckersUpdateServerType) => void;
    /* just an http status res on the validity of the client update */
    gamesUpdateClientRes: (args: ISocketResponse) => void;
}

/* Checkers Events */
export interface ServerToClientCheckersEvents {
    checkersClientInit: (args: IPayload, callback: () => void) => void;
    /* playerTokens: PlayerTokens, boardState: ValidTokens */
    checkersRoomConnect: (args: CheckersRoomConnectPayload) => void;
    checkersRoomStart: (args: IPayload) => void;
    /* CurPlayer: PlayerTokens, boardState: ValidTokens[], requiredMoves: [int[]] */
    checkersUpdateClient: (args: IPayload, callback: () => void) => void;
    /* Ok or not ok, if not ok, also contains prev turn data */
    checkersClientUpdateRes: (args: IPayload) => void;
}

export interface ClientToServerCheckersEvents {
    checkersClientReady: (args: IPayload) => void;
    /* roomID: string (CheckersRoom_{roomID}) */
    checkersClientLoaded: (args: IPayload) => void;
    /* boardState: validTokens[] */
    checkersUpdateServer: (boardState: string, callback: () => void) => void;
    checkersServerUpdateRes: (args: IPayload) => void;
}
interface SocketData {
    name: string;
    age: number;
}

/**
 *
 *
 * @export
 * @interface IPayload
 */
export interface IPayload {
    status: {};
    data?: any;
}

export type ClientPaths = typeof CLIENT_PATHS[number];
export type NewClientPaths = typeof NEW_CLIENT_PATHS[number];
