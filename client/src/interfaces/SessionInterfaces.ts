import {IUser} from "./userInterfaces";

export interface SessionData {
	isOnline: boolean;
	isAuth?: boolean;
	user?: IUser;
}
