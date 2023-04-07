import {Socket} from "socket.io-client";
import {IUser} from "./userInterfaces";

export type AuthTypes = "invalid" | "guest" | "user" | "admin" | undefined;
export interface ISessionContext {
	userData: IUser | null;
	isOnline: boolean;
	socket: Socket | null;
}
export type ISetSessionContext = React.Dispatch<
	React.SetStateAction<ISessionContext>
>;

export type useSessionContextType = [ISessionContext, ISetSessionContext];
