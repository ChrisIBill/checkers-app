import {Paper, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {
	ClientToServerAuthEvents,
	ServerToClientAuthEvents,
} from "../interfaces/authInterfaces";
import {ServerToClientEvents} from "../interfaces/interfaces";
import {UserData} from "../interfaces/user";
import {Paths} from "../paths/SocketPaths";

const socket: Socket<ServerToClientAuthEvents, ClientToServerAuthEvents> = io(
	Paths.Auth.Base
);
export const LoginPage = () => {
	const [userData, setUserData] = useState<UserData>();
	const handleKeyDown = (event: any) => {
		if (event.key === "Enter") {
			if (userData?.name) socket.emit("LoginRequest", userData);
		}
	};
	socket.on("connect", () => {
		console.log("Connected with Authorization Server");
	});
	socket.on("disconnect", () => {
		console.log("Disconnected from auth server");
	});
	useEffect(() => {}, [userData]);
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
					onKeyDown={handleKeyDown}
				/>
			</Paper>
		</Box>
	);
};
