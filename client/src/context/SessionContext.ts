import {createContext} from "react";
import {ISessionData} from "../interfaces/SessionInterfaces";
import {DEFAULT_SESSION_DATA} from "../constants/SessionConsts";

export const SessionContext = createContext<ISessionData>(DEFAULT_SESSION_DATA);
