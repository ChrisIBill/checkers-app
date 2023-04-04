import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import {ErrorBoundary} from "react-error-boundary";
import {useOutletContext} from "react-router-dom";
import {
	IUser,
	UserContextType,
	UserData,
} from "../../interfaces/userInterfaces";
import {ISessionContext} from "../../interfaces/SessionInterfaces";
import {SessionContext} from "../../context/SessionContext";
import {UserRoles} from "../../context/userContext";

const UserHeaderComponent = ({user}: {user: IUser}) => {
	UserRoles;
	return (
		<ErrorBoundary fallback={<div>User Header Component Error</div>}>
			<Box sx={{width: "100px", height: "100px"}}>
				<Typography variant="h6" component="div" sx={{flexGrow: 1}}>
					Hello, {user?.name}
				</Typography>
			</Box>
			<Box sx={{width: "100px", height: "100px"}}>
				<Typography variant="h6" component="div" sx={{flexGrow: 1}}>
					Currently in {UserRoles[user?.role]} Mode
				</Typography>
			</Box>
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
