import {NavigateFunction} from "react-router-dom";
import {IPayload, IPayloadCall} from "../interfaces/socketInterfaces";
import {Paths} from "../paths/SocketPaths";
import HttpStatusCode from "../constants/HttpStatusCodes";
import {UserData} from "../interfaces/userInterfaces";

export function onAuthTokenRes(args: IPayloadCall): UserData {
	console.log("Auth Token Response: ", args);
	if (args.status != HttpStatusCode.OK) {
		console.log("ERROR: BAD HTTP RESPONSE ", args.status);
		return null;
	} else if (args.data.user && localStorage.getItem("token")) {
		console.log("Setting user data: ", args.data.user);
		return {
			name: args.data.user.name,
			token: args.data.user.id,
			role: args.data.user.role,
		};
	} else {
		console.log("No user data in payload: ", args);
		return null;
	}
}

export function onAuthSignUpRes(args: IPayload, nav: NavigateFunction) {
	console.log("Server Sign Up Res: ", args);
	if ("status" in args) {
	}
	if ("id" in args.data.user) {
		localStorage.setItem("token", args.data.user.id);
		nav(Paths.App.Base);
	}
}
export function onAuthLoginRes(args: IPayload, nav: NavigateFunction) {
	console.log("Server Login Res: ", args);
	if ("data" in args && "id" in args.data) {
		localStorage.setItem("token", args.data.id);
		nav(Paths.App.Base);
	}
}
