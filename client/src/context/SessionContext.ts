import {createContext} from "react";
import {SessionData} from "../interfaces/SessionInterfaces";
import {DEFAULT_SESSION_DATA} from "../constants/SessionConsts";

export const SessionContext = createContext<SessionData>(DEFAULT_SESSION_DATA);
