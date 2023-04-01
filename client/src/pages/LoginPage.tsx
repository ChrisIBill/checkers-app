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
import {IUser, UserData} from "../interfaces/userInterfaces";
import {Paths, PathsSet} from "../paths/SocketPaths";
import {onAuthSignUpRes, onAuthLoginRes} from "../services/authServices";
import {onRedirect} from "../services/socketServices";

const socket: Socket<ServerToClientAuthEvents, ClientToServerAuthEvents> = io(
	Paths.Auth.Base
);

export const LoginPage = () => {
	const [userCreds, setUserCreds] = useState<string>();
	const [userData, setUserData] = useState<IUser>();
	const navigate = useNavigate();
	const handleLoginPress = () => {
		console.log("Login Click.");
		console.log("AuthLoginReq: ", userCreds);
		userCreds
			? socket.emit("authLoginReq", {
					data: userCreds,
					status: HttpStatusCode.OK,
			  })
			: console.log("Error: No User Data");
	};
	const handleSignUpPress = () => {
		console.log("Sign-Up Click.");
		userCreds
			? socket.emit("authSignUpReq", {
					data: userCreds,
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
	socket.on("authSignUpRes", (args: IPayload) =>
		onAuthSignUpRes(args, navigate)
	);
	socket.on("authLoginRes", (args: IPayload) =>
		onAuthLoginRes(args, navigate)
	);

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
