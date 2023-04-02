import {IUser} from "./userInterfaces";

export type AuthTypes = "invalid" | "guest" | "user" | "admin" | undefined;
export interface ISessionContext {
	userData: IUser | null;
	isOnline: boolean;
}
