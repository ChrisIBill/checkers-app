import {Box} from "@mui/material";
import {ErrorBoundary} from "react-error-boundary";
import {IUser, UserPanelProps} from "../interfaces/userInterfaces";

export const UserPanel: React.FC<UserPanelProps> = (props) => {
	let userName = "";
	if (props.userData === null || props.userData.name == "") {
		console.log("ERROR: UserData is malformed");
		userName = "Error!";
	} else {
		userName = props.userData.name;
	}
	return <Box>{userName}</Box>;
};
