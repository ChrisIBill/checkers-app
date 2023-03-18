import {Button, Paper, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {
	ClientToServerAuthEvents,
	ServerToClientAuthEvents,
} from "../interfaces/socketInterfaces";
import {UserData} from "../interfaces/user";
import {Paths} from "../paths/SocketPaths";

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
	const [userData, setUserData] = useState<UserData>();
	const handleLoginPress = () => {
		console.log("Login Click.");
		userData
			? socket.emit("authLoginReq", userData)
			: console.log("Error: No User Data");
	};
	const handleSignUpPress = () => {
		console.log("Sign-Up Click.");
		userData
			? socket.emit("authSignUpReq", userData)
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
		if ("name" in args[0]) {
			localStorage.setItem("token", args[0].id);
		}
	});
	socket.on("authLoginRes", (args: any[]) => {
		console.log("Server Login Res: ", args);
		if ("id" in args[0]) {
			localStorage.setItem("token", args[0].id);
		}
	});
	/* useEffect(() => {
		localStorage.setItem("token", token);
	}, [userData]); */
	return (
		<Box sx={{width: 300, height: 300, backgroundColor: "gray"}}>
			<Paper elevation={5}>
				<TextField
					id="outlined-basic"
					label="UserName"
					variant="outlined"
					autoFocus={true}
					onChange={(event) => {
						setUserData({name: event.target.value});
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
