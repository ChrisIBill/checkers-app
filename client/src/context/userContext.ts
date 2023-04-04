import {create} from "domain";
import {createContext} from "react";
import {UserData} from "../interfaces/userInterfaces";
export enum UserRoles {
	Invalid = <any>-1,
	Guest = <any>0,
	User = <any>1,
	Admin = <any>2,
}
export const UserContext = createContext<UserData>(null);
