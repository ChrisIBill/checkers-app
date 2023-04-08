import {useOutletContext} from "react-router-dom";
import {
	AllRoomStylesTypes,
	IActiveRoomState,
	RoomTypes,
} from "../../interfaces/RoomInterfaces";
import {useSessionContextType} from "../../interfaces/SessionInterfaces";
import {useEffect, useState} from "react";
import {Box} from "@mui/material";
import HttpStatusCode from "../../constants/HttpStatusCodes";
import {ROOM_TYPES} from "../../constants/RoomConsts";
import {CheckersWindow} from "../../pages/CheckersPage";

export const RoomManager = ({roomID, roomType}: IActiveRoomState) => {
	const [roomData, setRoomData] = useState<any>();
	const [sessionContext, setSessionContext] =
		useOutletContext<useSessionContextType>();
	const {userData, isOnline, socket} = sessionContext;
	function onRoomDataChange(roomData: any) {
		setRoomData(roomData);
	}
	console.log("RoomManager: ", roomID, roomType);
	switch (roomType) {
		case ROOM_TYPES.checkers:
			return (
				<CheckersWindow
					roomID={roomID}
					onRoomDataChange={onRoomDataChange}
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
		return (
			<Box className="Window_Wrapper">
				<RoomManager roomID={room} roomType={"checkers"} />
			</Box>
		);
	});
	return (
		<div className="window-manager">
			<div className="window-manager__windows">{ActiveWindows}</div>
		</div>
	);
};
