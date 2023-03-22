import {create} from "domain";
import {createContext} from "react";
import {UserData} from "../interfaces/user";
export const UserContext = createContext<UserData>(undefined);
