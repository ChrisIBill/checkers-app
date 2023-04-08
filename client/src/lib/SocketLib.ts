import {UserRoles} from "../context/userContext";
import {guestSocket, userSocket, adminSocket} from "../socket";

export function getAuthSocket(role: UserRoles) {
	switch (role) {
		case UserRoles.Guest:
			return guestSocket;
		case UserRoles.User:
			return userSocket;
		case UserRoles.Admin:
			return adminSocket;
		default:
			console.log("Invalid role: ", role);
			return null;
	}
}
