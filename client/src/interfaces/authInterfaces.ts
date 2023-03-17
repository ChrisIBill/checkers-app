import {UserData} from "./user";

export interface ServerToClientAuthEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
	initServerHandshake: (move_desc: string, gameState: string) => void;
	checkersRoomInit: (gameState: string) => void;
	authSignUpRes: (...args: any[]) => void;
	authLoginRes: (...args: any[]) => void;
}

export interface ClientToServerAuthEvents {
	authSignUpReq: (userData: UserData) => void;
	authLoginReq: (userData: UserData) => void;
}

export interface InterServerEvents {
	ping: () => void;
}
