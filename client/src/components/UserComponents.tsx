import {Box} from "@mui/material";
import {red} from "@mui/material/colors";
import {ErrorBoundary} from "react-error-boundary";
import {IUser, UserPanelProps} from "../interfaces/userInterfaces";

export const UserPanel: React.FC<UserPanelProps> = (props) => {
	let userName = "";
	if (
		!props.userData ||
		props.userData === null ||
		props.userData.name == ""
	) {
		console.log("ERROR: UserData is malformed");
		userName = "Error!";
	} else {
		userName = props.userData.name;
	}
	return (
		<Box sx={{backgroundColor: "red", width: "200px", height: "200px"}}>
			{userName}
		</Box>
	);
};
