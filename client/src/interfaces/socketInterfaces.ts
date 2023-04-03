import HttpStatusCode from "../constants/HttpStatusCodes";
import {SERVER_PATHS} from "../paths/SocketPaths";
import {GameTypes, MatchmakingTypes} from "./GameInterfaces";
import {PlayerTokens} from "./interfaces";
import {UserData} from "./userInterfaces";

export interface ISocketResponse {
	status: HttpStatusCode;
}
export interface IPayload {
	status: HttpStatusCode;
	data?: any;
}
export interface IPayloadCall {
	status: HttpStatusCode;
	data: any;
	callback: () => void;
}
export interface ExpressServerConnectionEvent {
	message: string;
}
export type SocketNamespaces = typeof SERVER_PATHS[number];
export interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
	initServerHandshake: (move_desc: string, gameState: string) => void;
	checkersRoomInit: (gameState: string) => void;
	authTokenValRes: (...args: any) => void;
	authSignUpRes: (...args: any[]) => void;
	authLoginRes: (...args: any[]) => void;
	redirect: (args: IPayload) => void;
}

export interface ClientToServerEvents {
	hello: (args: string) => void;
}

export interface InterServerEvents {
	ping: () => void;
}

/* The base server namespace only handles redirecting the client to
the correct namespace, auth, guest, user, admin. It then closes */
export interface BaseServerToClientEvents {
	"Auth:Token_Res": (args: IPayloadCall) => void;
	redirect: (args: IPayloadCall) => void;
}

/* No Client to server base events, if client has a key, that is given in
connect handshake, the client is then rerouted */
export interface BaseClientToServerEvents {}

/* The auth server namespace handles tokenless sign-up and login requests,
it responds with http status code and if valid, the user token.
Connection then closes. Client will need to attempt connection with correct
role server */
export interface AuthServerToClientEvents extends BaseServerToClientEvents {
	"Auth:Sign_Up_Res": (args: IPayloadCall) => void;
	"Auth:Login_Res": (args: IPayloadCall) => void;
	redirect: (args: IPayloadCall) => void;
}

export interface AuthClientToServerEvents extends BaseClientToServerEvents {
	"Auth:Sign_Up_Req": (args: IPayload) => void;
	"Auth:Login_Req": (args: IPayload) => void;
}

export interface GuestServerToClientEvents {
	"Room:Find_Res": (args: IPayloadCall) => void;
	"Room:Leave_Res": (args: IPayload) => void;
	"Room:List_Public_Res": (args: IPayloadCall) => void;
	"Room:Connect_Res": (args: IPayloadCall) => void;
	"Room:Init": (args: IPayloadCall) => void;
	"Room:Update_Room": (args: IPayloadCall) => void;
}

export interface GuestClientToServerEvents {
	"Room:Find_Req": (args: IPayload) => void;
	"Room:Leave_Req": (args: IPayload) => void;
	"Room:List_Public_Req": (args: IPayload) => void;
	"Room:Update_Server": (args: IPayloadCall) => void;
}

export interface UserServerToClientEvents extends GuestServerToClientEvents {
	"Users:Get_Me_Res": (args: IPayloadCall) => void;
	"Users:Delete_Me_Res": (args: IPayloadCall) => void;
	"Room:Join_Res": (args: IPayloadCall) => void;
	"Room:Create_Res": (args: IPayloadCall) => void;
}

export interface UserClientToServerEvents extends GuestClientToServerEvents {
	"Users:Get_Me_Req": (args: IPayload) => void;
	"Users:Delete_Me_Req": (args: IPayloadCall) => void;
	"Room:Join_Req": (args: IPayload) => void;
	"Room:Create_Req": (args: IPayload) => void;
}

export interface AdminServerToClientEvents extends UserServerToClientEvents {
	"Users:List_All_Res": (args: IPayloadCall) => void;
	"Users:Delete_User_Res": (args: IPayloadCall) => void;
	"Room:Delete_Res": (args: IPayloadCall) => void;
	"Room:List_All_Res": (args: IPayloadCall) => void;
}

export interface AdminClientToServerEvents extends UserClientToServerEvents {
	"Users:List_All_Req": (args: IPayload) => void;
	"Users:Delete_Req": (args: IPayload) => void;
	"Room:Delete_Req": (args: IPayload) => void;
	"Room:List_All_Req": (args: IPayload) => void;
}

/* !!!DEPRECATED!!! */
export interface ServerToClientAuthEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
	initServerHandshake: (move_desc: string, gameState: string) => void;
	checkersRoomInit: (gameState: string) => void;
	redirect: (args: IPayload) => void;
	authSignUpRes: (args: IPayload) => void;
	authLoginRes: (args: IPayload) => void;
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
	data: {
		boardState: string;
		playerTokens: PlayerTokens;
		curPlayer: string;
		turnNum?: number;
	};
}
export interface CheckersUpdateClientType extends ISocketResponse {
	/* status: if  */
	data: {
		boardState: string;
		movesList: MovesListType;
		isClientTurn: boolean;
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
/* Client */
export interface ClientJoinRoomReqType {
	gameType: GameTypes;
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
	gamesJoinRoomReq: (
		args: ClientJoinRoomReqType,
		callback: (e: number) => void
	) => void;
	gamesLeaveRoomReq: (args: IPayload) => void;
	/* Gives server players moves, server needs to check for validity and legality */
	gamesUpdateClient: (args: CheckersUpdateServerType) => void;
	/* just an http status res on the validity of the client update */
	gamesUpdateClientRes: (args: ISocketResponse) => void;
}
export interface ServerToClientCheckersEvents {
	checkersClientInit: (args: IPayload) => void;
	/* playerTokens: PlayerTokens, boardState: ValidTokens */
	checkersRoomConnect: (
		args: CheckersRoomConnectPayload,
		callback: (e: number) => void
	) => void;
	checkersRoomStart: (args: IPayload) => void;
	/* CurPlayer: PlayerTokens, boardState: ValidTokens[], requiredMoves: [int[]] */
	checkersUpdateClient: (
		args: IPayload,
		callback: (e: number) => void
	) => void;
	/* Ok or not ok, if not ok, also contains prev turn data */
	checkersClientUpdateRes: (args: IPayload) => void;
}

export interface ClientToServerCheckersEvents {
	checkersClientLoaded: (args: IPayload) => void;
	checkersClientReady: (args: IPayload) => void;
	/* boardState: validTokens[] */
	checkersUpdateServer: (
		boardState: string,
		callback: (e: number) => void
	) => void;
	checkersServerUpdateRes: (args: IPayload) => void;
}
