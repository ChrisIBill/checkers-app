import HttpStatusCode from "../constants/HttpStatusCodes";
import {UserData} from "./userInterfaces";

export interface ExpressServerConnectionEvent {
	message: string;
}

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
	authTokenValReq: (args: IPayload) => void;
	authSignUpReq: (args: IPayload) => void;
	authLoginReq: (args: IPayload) => void;
	hello: (args: string) => void;
}

export interface InterServerEvents {
	ping: () => void;
}
export interface IPayload {
	data: any;
	status: HttpStatusCode;
}
export interface SocketData {
	name: string;
	age: number;
}
export interface ServerToClientAuthEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
	initServerHandshake: (move_desc: string, gameState: string) => void;
	checkersRoomInit: (gameState: string) => void;
	redirect: (args: IPayload) => void;
	authSignUpRes: (...args: any[]) => void;
	authLoginRes: (...args: any[]) => void;
}

export interface ClientToServerAuthEvents {
	authSignUpReq: (args: IPayload) => void;
	authLoginReq: (args: IPayload) => void;
}

export interface InterServerEvents {
	ping: () => void;
}
