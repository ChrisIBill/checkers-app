import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from "@mui/material";
import {useEffect, useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {authSocket} from "../../socket";
import HttpStatusCode from "../../constants/HttpStatusCodes";
import {IUser} from "../../interfaces/userInterfaces";
import {SessionContext} from "../../context/SessionContext";
import {useOutletContext} from "react-router-dom";

enum EStatus {
	Waiting,
	Login,
	Signup,
}
export const LoginModal = () => {
	const [open, setOpen] = useState(true);
	const [status, setStatus] = useState<EStatus>(EStatus.Waiting);
	const [username, setUsername] = useState<string>();
	const [token, setToken] = useState<string>();
	let namefield: string;
	const handleLogin = () => {
		console.log("Login Click.");
		if (namefield !== undefined) {
			setUsername(namefield);
			setStatus(EStatus.Login);
		} else {
			/* Should add err effect to bad text field */
			console.log("No username entered.");
		}
	};
	const handleSignUp = () => {
		console.log("Sign-Up Click.");
		if (namefield !== undefined) {
			setUsername(namefield);
			setStatus(EStatus.Signup);
		} else {
			/* Should add err effect to bad text field */
			console.log("No username entered.");
		}
	};
	useEffect(() => {
		switch (status) {
			case EStatus.Waiting:
				break;
			case EStatus.Login:
				authSocket.connect();
				authSocket.on("connect", () => {
					console.log("Connected with Auth Server: ", authSocket.id);
					console.log("Sending Login Req: ", username);
					authSocket.emit(
						"Auth:Login_Req",
						{
							status: HttpStatusCode.OK,
							data: {
								name: username,
							} as IUser,
						},
						(res: any) => {
							console.log("Login Res: ", res);
							setToken(res.data);
						}
					);
				});
				authSocket.on("connect_error", (err) => {
					console.log("Error connecting to server: ", err.message);
				});
				break;
			case EStatus.Signup:
				authSocket.connect();
				authSocket.on("connect", () => {
					console.log("Connected with Auth Server: ", authSocket.id);
					console.log("Sending Signup Req: ", username);
					authSocket.emit(
						"Auth:Sign_Up_Req",
						{
							status: HttpStatusCode.OK,
							data: {
								name: username,
							} as IUser,
						},
						(res: any) => {
							console.log("Signup Res: ", res);
							if (res.status === HttpStatusCode.CREATED) {
								console.log("User Token Received: ", res.data);
								setToken(res.data);
							}
						}
					);
				});
				authSocket.on("connect_error", (err) => {
					console.log("Error connecting to server: ", err.message);
				});
				break;
		}
		return () => {
			if (authSocket.connected) {
				console.log("Disconnecting from Auth Server");
				authSocket.off("connect");
				authSocket.off("connect_error");
				authSocket.off("disconnect");
				authSocket.off("Auth:Login_Res");
				authSocket.off("Auth:Sign_Up_Res");
				authSocket.disconnect();
			}
		};
	}, [status]);

	useEffect(() => {
		if (token !== undefined) {
			console.log("Token Received: ", token);
			localStorage.setItem("token", token);
			setOpen(false);
		}
	}, [token]);
	return (
		<ErrorBoundary fallback={<div>Login Modal Error</div>}>
			<Dialog
				open={open}
				onClose={(event: object, reason: string) => {
					console.log("Close event: ", event);
					console.log("Close reason: ", reason);
				}}
			>
				<DialogTitle>Log In</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Log in or create an account to play games!
					</DialogContentText>
					<TextField
						onChange={(event) => {
							namefield = event.target.value;
						}}
					>
						Username
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleLogin}>Log In</Button>
					<Button onClick={handleSignUp}>Sign Up</Button>
				</DialogActions>
			</Dialog>
		</ErrorBoundary>
	);
};
