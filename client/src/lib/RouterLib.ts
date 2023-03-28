import {redirect} from "react-router-dom";
import {PathsTypes} from "../interfaces/interfaces";
import {PathsSet} from "../paths/SocketPaths";
export function routerRedirect(path: string) {
	if (!PathsSet.includes(path as PathsTypes)) {
		console.log("ERRORROROORASDFO");
		throw new Error("Error: Invalid path");
	} else {
		redirect(path);
	}
}
