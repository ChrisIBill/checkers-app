export interface ExpressServerConnectionEvent {
	message: string;
}

export interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
	initServerHandshake: (move_desc: string, gameState: string) => void;
}

export interface ClientToServerEvents {
	hello: (args: string) => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
	age: number;
}
/* 
move_desc: start | piece[startpos]>pos[endpos] & takenpiece[pos] 
game_state: compressed board state*/
export interface CheckersBoardJSON {
	move_desc: string;
	game_state: string;
}

/*  */
type squareStatus = "default" | "selected" | "valid";
