import {AppBar, Box, Toolbar} from "@mui/material";
import {ErrorBoundary} from "react-error-boundary";
import {useOutletContext} from "react-router-dom";
import {UserContextType} from "../../interfaces/userInterfaces";
import {ISessionContext} from "../../interfaces/SessionInterfaces";
import {SessionContext} from "../../context/SessionContext";

const UserHeaderComponent = ({user}: {user: string}) => {
	return (
		<ErrorBoundary fallback={<div>User Header Component Error</div>}>
			<Box sx={{backgroundColor: "red", width: "50px", height: "50px"}}>
				{user}
			</Box>
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
export const AppHeader = () => {
	const sessionContext = useOutletContext<ISessionContext>();
	const userData = sessionContext.userData;
	const isOnline = sessionContext.isOnline;
	const authType = sessionContext.authType;
	const name = userData?.name;
	return (
		<Box sx={{flexGrow: 1}}>
			<AppBar position="static">
				<Toolbar>
					{userData && userData.name ? (
						<UserHeaderComponent user={`${userData.name}`} />
					) : (
						<>No User Data</>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
};
