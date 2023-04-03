import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from "@mui/material";
import {useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {authSocket} from "../../socket";
import HttpStatusCode from "../../constants/HttpStatusCodes";

export const LoginModal = () => {
	const [open, setOpen] = useState(true);
	const [username, setUsername] = useState<string>();
	authSocket.connect();
	authSocket.on("connect", () => {
		console.log("Connected with Auth Server: ", authSocket.id);
	});
	authSocket.on("connect_error", (err) => {
		console.log("Error connecting to server: ", err.message);
	});
	const handleLogin = () => {
		console.log("Login Click.");
		authSocket.connect();
		authSocket.emit("Auth:Login_Req", {
			status: HttpStatusCode.OK,
			data: username,
		});
	};
	const handleSignUp = () => {
		console.log("Sign-Up Click.");

		authSocket.emit("Auth:Sign_Up_Req", {
			status: HttpStatusCode.OK,
			data: username,
		});
	};
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
							setUsername(event.target.value);
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
