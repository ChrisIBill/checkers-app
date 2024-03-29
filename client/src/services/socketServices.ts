import {NavigateFunction} from "react-router-dom";
import {IPayload} from "../interfaces/socketInterfaces";
import {PathsSet} from "../paths/SocketPaths";

export function onRedirect(nav: NavigateFunction, args: IPayload) {
	console.log("Redirect Requested here", args);
	if (PathsSet.includes(args.data.path)) nav(args.data.path);
	else console.error("Invalid Path");
}

export function onConnectError(err: Error) {
	console.log("Error connecting to server: ", err.message);
	console.log("Full Error Data: ", err);
}
