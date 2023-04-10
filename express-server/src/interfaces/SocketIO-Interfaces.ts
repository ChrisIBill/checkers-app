import { CLIENT_PATHS, NEW_CLIENT_PATHS } from "@src/constants/ClientPaths";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { PlayerTokens } from "./checkersInterfaces";
import { GameTypes, MatchmakingTypes } from "./GameInterfaces";

export interface ISocketResponse {
    status: HttpStatusCodes;
}
/**
 *
 *
 * @export
 * @interface IPayload
 */
export interface IPayload {
    status: HttpStatusCodes;
    data?: any;
}
export interface IPayloadCall {
    status: HttpStatusCodes;
    data: any;
    callback: (res: any) => void;
}
export type ClientPaths = typeof CLIENT_PATHS[number];
export type NewClientPaths = typeof NEW_CLIENT_PATHS[number];
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

export interface IRoomPayloadCall {
    roomInfo: {
        roomType: RoomTypes;
        roomID: string;
    };
    data: object;
    callback: (res: any) => void;
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
    "Auth:Sign_Up_Req": (args: IPayload, callback: (res: any) => void) => void;
    "Auth:Login_Req": (args: IPayload, callback: (res: any) => void) => void;
}

export interface GuestServerToClientEvents {
    "Room:Join_Res": (args: IPayloadCall) => void;
    "Room:Leave_Res": (args: IPayload) => void;
    "Room:List_Public_Res": (args: IPayloadCall) => void;
    "Room:Connect_Res": (args: IPayloadCall) => void;
    "Room:Init": (args: IRoomPayloadCall) => void;
    "Room:Update_Room": (args: IPayloadCall) => void;
}

export interface GuestClientToServerEvents {
    "Room:Find_Req": (args: IPayloadCall) => void;
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
export type RoomTypes = "basic" | "checkers";
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
