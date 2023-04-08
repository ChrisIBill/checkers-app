import React, {useEffect, useState} from "react";
import {UserRoles} from "../context/userContext";
import {ErrorBoundary} from "react-error-boundary";
import {useNavigate, useOutletContext} from "react-router-dom";
import {useSessionContextType} from "../interfaces/SessionInterfaces";
import {AppHeader} from "../components/main-components/header";
import {LoginModal} from "../components/main-components/LoginModal";
import HttpStatusCode from "../constants/HttpStatusCodes";
import {WindowManager} from "../components/window-manager/WindowManager";
import {AppSidebar} from "../components/main-components/Sidebar";
import {
	AllRoomStylesTypes,
	INewRoomState,
	RoomTypes,
} from "../interfaces/RoomInterfaces";
/* const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	Paths.App.Base,
	{
		auth: (cb) => {
			cb({token: localStorage.token});
		},
	}
); */

/* Depending on session context, does different things
If offline, give user guest privs
if invalid, need to pass to header to handle login
if user, give regular access
if admin? */
export const MainPage = () => {
	const [sessionContext, setSessionContext] =
		useOutletContext<useSessionContextType>();
	const [newRoomData, setNewRoomData] = useState<INewRoomState>();
	/* array of strings equal to the id's of the server rooms the client has been assigned */
	const [activeRooms, setActiveRooms] = useState<any[]>([]);
	//const sessionContext = sessionData.
	const {userData, isOnline, socket} = sessionContext;
	console.log("Main Session Context: ", sessionContext);
	const navigate = useNavigate();
	function onAuthorizedConnect() {
		console.log("Authorized Connect");
	}
	function onFindRoomClick(
		roomType: RoomTypes,
		roomStyle: AllRoomStylesTypes
	) {
		console.log("Find Room Clicked: ", roomType, roomStyle);
		setNewRoomData({roomType, roomStyle});
		/* if (socket) {
			socket.emit(
				"Room:Find_Req",
				{data: {roomType, roomStyle}},
				(res: any) => {
					console.log("Find Room Response: ", res);
					if (res.status !== HttpStatusCode.OK || !res.data) {
						console.log("Bad response from server");
					} else {
						const {roomID} = res.data;
						console.log("Setting active room: ", roomID);
						setActiveRooms([...activeRooms, roomID]);
					}
				}
			);
		} */
	}

	console.log("Active Rooms: ", activeRooms);
	useEffect(() => {
		if (socket) {
			if (socket.connected) {
				console.log("Socket Already Connected");
			} else {
				console.log("Socket Not Connected");
				socket.connect();
				socket.on("connect", onAuthorizedConnect);
			}
		} else {
			console.log("Socket is undefined");
		}
		return () => {
			socket?.disconnect();
		};
	}, [socket]);
	useEffect(() => {
		if (newRoomData && socket) {
			console.log("New Room Data: ", newRoomData);
			if (socket.connected) {
				socket.emit("Room:Find_Req", newRoomData, (res: any) => {
					console.log("Find Room Response: ", res);
					if (res.status !== HttpStatusCode.OK || !res.data.roomID) {
						console.log("Bad response from server");
					}
					setActiveRooms([...activeRooms, res.data.roomID]);
				});
			}
		}
	}, [newRoomData, socket]);
	console.log("Session Context: ", sessionContext);
	console.log("User data: ", userData);
	return (
		<div className="App">
			<ErrorBoundary fallback={<div>User Panel Error</div>}>
				<AppHeader userData={userData} />
			</ErrorBoundary>
			<AppSidebar onRoomSelection={onFindRoomClick} />

			<ErrorBoundary fallback={<div>User Panel Error</div>}></ErrorBoundary>
			{userData ? (
				userData.role !== UserRoles.Invalid ? null : (
					<LoginModal />
				)
			) : (
				<LoginModal />
			)}
			<WindowManager rooms={activeRooms} />
		</div>
	);
};
