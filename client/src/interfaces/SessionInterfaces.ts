import {IUser} from "./userInterfaces";

export type AuthTypes = "invalid" | "offline" | "user" | "admin";
export interface ISessionData {
	userData: IUser | null;
	isOnline: boolean;
	authType: AuthTypes;
}
