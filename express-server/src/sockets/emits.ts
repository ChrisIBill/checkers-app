import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { ClientPaths, IPayload } from "@src/interfaces/socketIO";
import Paths from "@src/routes/constants/Paths";
import { Socket } from "socket.io";

function redirectClient(
    this: Socket,
    path: ClientPaths,
    status: HttpStatusCodes
) {
    const socket = this;
    const payload: IPayload = {
        data: {
            path,
        },
        status: { status },
    };
    console.log("Redirecting Client To: ", payload);
    socket.emit("redirect", payload);
}
