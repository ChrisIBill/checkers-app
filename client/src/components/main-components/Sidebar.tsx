import {useOutletContext} from "react-router-dom";
import {useSessionContextType} from "../../interfaces/SessionInterfaces";
import {
	List,
	ListItemButton,
	ListItemText,
	Drawer,
	Collapse,
	Typography,
	Toolbar,
	Box,
} from "@mui/material";
import {useState} from "react";
import {RoomTypes, AllRoomStylesTypes} from "../../interfaces/RoomInterfaces";
import {ErrorBoundary} from "react-error-boundary";

const GameRoomsList = ({
	onRoomSelection,
}: {
	onRoomSelection: (room: RoomTypes, roomStyles: AllRoomStylesTypes) => void;
}) => {
	const [expanded, setExpanded] = useState(false);
	const handleExpandableClick = () => {
		setExpanded(!expanded);
	};
	return (
		<List>
			<ListItemButton onClick={handleExpandableClick}>
				<ListItemText primary="Checkers" />
			</ListItemButton>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					<ListItemButton
						sx={{pl: 4}}
						onClick={() => onRoomSelection("checkers", "pvp")}
					>
						<ListItemText primary="PVP" />
					</ListItemButton>
					<ListItemButton
						sx={{pl: 4}}
						onClick={() => onRoomSelection("checkers", "computer")}
					>
						<ListItemText primary="Computer" />
					</ListItemButton>
					<ListItemButton
						sx={{pl: 4}}
						onClick={() => onRoomSelection("checkers", "local")}
					>
						<ListItemText primary="Local" />
					</ListItemButton>
				</List>
			</Collapse>
		</List>
	);
};
export const AppSidebar = ({
	onRoomSelection,
}: {
	onRoomSelection: (room: RoomTypes, roomStyles: AllRoomStylesTypes) => void;
}) => {
	const [sessionContext, setSessionContext] =
		useOutletContext<useSessionContextType>();
	const {userData, isOnline, socket} = sessionContext;
	return (
		<ErrorBoundary fallback={<div>App Sidebar Error</div>}>
			<Drawer
				anchor="left"
				open={true}
				variant="permanent"
				sx={{
					height: "100%",
					boxSizing: "border-box",
					alignContent: "center",
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						boxSizing: "border-box",
					},
				}}
			>
				<Toolbar sx={{height: "100px"}} />
				<Box sx={{overflow: "auto"}}>
					<Typography variant="h6">Game-Rooms</Typography>
					<GameRoomsList onRoomSelection={onRoomSelection} />
					<Typography variant="h6">Social-Rooms</Typography>
				</Box>
			</Drawer>
		</ErrorBoundary>
	);
};
