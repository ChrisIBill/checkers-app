import {create} from "domain";
import {createContext} from "react";
import {UserData} from "../interfaces/userInterfaces";
export enum UserRoles {
	Invalid = -1,
	Guest,
	User,
	Admin,
}
export const UserContext = createContext<UserData>(null);
