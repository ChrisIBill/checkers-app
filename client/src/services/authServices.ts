import {NavigateFunction} from "react-router-dom";
import {IPayload} from "../interfaces/socketInterfaces";
import {Paths} from "../paths/SocketPaths";

export function onAuthTokenRes(args: IPayload, nav: NavigateFunction) {
	console.log("Auth Token Response: ", args);
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
