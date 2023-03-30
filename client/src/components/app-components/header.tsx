import {AppBar, Box, Toolbar} from "@mui/material";
import {ErrorBoundary} from "react-error-boundary";
import {useOutletContext} from "react-router-dom";
import {UserContextType} from "../../interfaces/userInterfaces";

const UserHeaderComponent = () => {
	const userContext = useOutletContext<UserContextType>();
	const userData = userContext.userData;
	return (
		<ErrorBoundary fallback={<div>User Header Component Error</div>}>
			{}
			<Box sx={{backgroundColor: "red", width: "200px", height: "200px"}}>
				User Header Component
			</Box>
		</ErrorBoundary>
	);
};
export const AppHeader = () => {
	return (
		<Box sx={{flexGrow: 1}}>
			<AppBar position="static">
				<Toolbar>
					<UserHeaderComponent />
				</Toolbar>
			</AppBar>
		</Box>
	);
};
