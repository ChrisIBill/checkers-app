import {useOutletContext} from "react-router-dom";
import {
	AllRoomStylesTypes,
	IActiveRoomState,
	RoomTypes,
} from "../../interfaces/RoomInterfaces";
import {useSessionContextType} from "../../interfaces/SessionInterfaces";
import {useEffect, useState} from "react";
import {Box, Toolbar} from "@mui/material";
import HttpStatusCode from "../../constants/HttpStatusCodes";
import {ROOM_TYPES} from "../../constants/RoomConsts";
import {CheckersWindow} from "../../pages/CheckersPage";

export const RoomManager = ({roomID, roomType}: IActiveRoomState) => {
	const [roomData, setRoomData] = useState<any>();
	const [sessionContext, setSessionContext] =
		useOutletContext<useSessionContextType>();
	const {userData, isOnline, socket} = sessionContext;
	function onRoomStatusChange(roomData: any) {
		setRoomData(roomData);
	}
	console.log("RoomManager: ", roomID, roomType);
	switch (roomType) {
		case ROOM_TYPES.checkers:
			return (
				<CheckersWindow
					windowRoomID={roomID}
					onRoomStatusChange={onRoomStatusChange}
				/>
			);
		default:
			return <div>Room Type Not Implemented</div>;
	}
};
export const WindowManager = ({rooms}: {rooms: any}) => {
	const [sessionContext, setSessionContext] =
		useOutletContext<useSessionContextType>();

	const {userData, isOnline, socket} = sessionContext;
	console.log("Rooms in WindowManager: ", rooms);
	const ActiveWindows = rooms.map((room: any, index: number) => {
		return <RoomManager key={index} roomID={room} roomType={"checkers"} />;
	});
	return (
		<div className="window-manager">
			<Toolbar sx={{height: "100px"}} />
			<div className="window-manager__windows">{ActiveWindows}</div>
		</div>
	);
};
