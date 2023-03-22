import {Button, Paper, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {io, Socket} from "socket.io-client";
import HttpStatusCode from "../constants/HttpStatusCodes";
import {
	ClientToServerAuthEvents,
	IPayload,
	ServerToClientAuthEvents,
} from "../interfaces/socketInterfaces";
import {UserData} from "../interfaces/user";
import {Paths, PathsSet} from "../paths/SocketPaths";
import {onRedirect} from "../services/socketServices";

const socket: Socket<ServerToClientAuthEvents, ClientToServerAuthEvents> = io(
	Paths.Auth.Base
);

const getAuthSignUpRes = (args: any[]) => {
	console.log("Server Sign Up Res: ", args);
	if (args[0] > 0) {
		localStorage.setItem("token", args[1]);
	}
};
const getAuthLoginRes = (args: any[]) => {
	console.log("Server Login Res: ", args);
	if (args[0] > 0) {
		localStorage.setItem("token", args[1]);
	} else console.log("Error: Bad Res");
};
export const LoginPage = () => {
	const [userCreds, setUserCreds] = useState<string>();
	const [userData, setUserData] = useState<UserData>();
	const navigate = useNavigate();
	const handleLoginPress = () => {
		console.log("Login Click.");
		userCreds
			? socket.emit("authLoginReq", {
					data: userData,
					status: HttpStatusCode.OK,
			  })
			: console.log("Error: No User Data");
	};
	const handleSignUpPress = () => {
		console.log("Sign-Up Click.");
		userCreds
			? socket.emit("authSignUpReq", {
					data: userData,
					status: HttpStatusCode.OK,
			  })
			: console.log("No user data");
	};
	socket.on("connect", () => {
		console.log("Connected with Authorization Server");
	});
	socket.on("disconnect", () => {
		console.log("Disconnected from auth server");
	});
	socket.on("authSignUpRes", (args: any[]) => {
		console.log("Server Sign Up Res: ", args);
		if ("id" in args[0]) {
			localStorage.setItem("token", args[0].id);
		}
	});
	socket.on("authLoginRes", (args: IPayload) => {
		console.log("Server Login Res: ", args);
		if ("data" in args && "id" in args.data) {
			localStorage.setItem("token", args.data.id);
		}
	});
	socket.on("redirect", (args: IPayload) => onRedirect(navigate, args));

	return (
		<Box sx={{width: 300, height: 300, backgroundColor: "gray"}}>
			<Paper elevation={5}>
				<TextField
					id="outlined-basic"
					label="UserName"
					variant="outlined"
					autoFocus={true}
					onChange={(event) => {
						setUserCreds(event.target.value);
					}}
				/>
				<Button variant="contained" onClick={handleLoginPress}>
					Login
				</Button>
				<Button variant="contained" onClick={handleSignUpPress}>
					Sign-Up
				</Button>
			</Paper>
		</Box>
	);
};

export const AuthPage = () => {
	return <h1>Authorizing</h1>;
};
