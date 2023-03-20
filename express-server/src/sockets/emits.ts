import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { ClientPaths, IPayload } from "@src/interfaces/socketIO";
import Paths from "@src/routes/constants/Paths";
import { Socket } from "socket.io";

export function redirectEmit(
    socket: Socket,
    path: ClientPaths,
    status?: HttpStatusCodes
) {
    const stat = status ?? HttpStatusCodes.TEMPORARY_REDIRECT;
    const payload: IPayload = {
        data: {
            path,
        },
        status: { stat },
    };
    console.log("Redirecting Client To: ", payload);
    socket.emit("redirect", payload);
}
