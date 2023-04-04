import {createContext} from "react";
import {ISessionContext} from "../interfaces/SessionInterfaces";
import {DEFAULT_SESSION_DATA} from "../constants/SessionConsts";
import {useOutletContext} from "react-router-dom";

export const SessionContext =
	createContext<ISessionContext>(DEFAULT_SESSION_DATA);

/* export type SeContextType */
/* export function useSessionContext() {
	return useOutletContext<ISessionContext>();
} */
/* export function setSessionContext() {
	return setOutletContext<ISessionContext>();
} */
