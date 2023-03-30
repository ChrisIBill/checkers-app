import {createContext} from "react";
import {ISessionContext} from "../interfaces/SessionInterfaces";
import {DEFAULT_SESSION_DATA} from "../constants/SessionConsts";

export const SessionContext =
	createContext<ISessionContext>(DEFAULT_SESSION_DATA);
