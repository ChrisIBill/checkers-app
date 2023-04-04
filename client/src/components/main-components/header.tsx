import {AppBar, Box, Button, Toolbar} from "@mui/material";
import {ErrorBoundary} from "react-error-boundary";
import {useOutletContext} from "react-router-dom";
import {
	IUser,
	UserContextType,
	UserData,
} from "../../interfaces/userInterfaces";
import {ISessionContext} from "../../interfaces/SessionInterfaces";
import {SessionContext} from "../../context/SessionContext";

const UserHeaderComponent = ({user}: {user: IUser}) => {
	return (
		<ErrorBoundary fallback={<div>User Header Component Error</div>}>
			<Box sx={{width: "50px", height: "50px"}}>{user?.name}</Box>
		</ErrorBoundary>
	);
};
const UserLoginButton = ({onClick}: {onClick: () => void}) => {
	return (
		<ErrorBoundary fallback={<div>User Login Button Error</div>}>
			<Button
				variant="text"
				sx={{backgroundColor: "gray", width: "50px", height: "50px"}}
			>
				Login
			</Button>
		</ErrorBoundary>
	);
};
const SessionToolbar = () => {
	return (
		<ErrorBoundary
			fallback={<div>Session Toolbar Error</div>}
		></ErrorBoundary>
	);
};
export const AppHeader = ({userData}: {userData: UserData}) => {
	//const userData = sessionContext.userData;
	return (
		<Box sx={{flexGrow: 1}}>
			<AppBar position="static">
				<Toolbar>
					{userData ? <UserHeaderComponent user={userData} /> : <>Login</>}
				</Toolbar>
			</AppBar>
		</Box>
	);
};
