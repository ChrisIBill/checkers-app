import {create} from "domain";
import {createContext} from "react";
import {UserData} from "../interfaces/userInterfaces";
export const UserContext = createContext<UserData>(null);
