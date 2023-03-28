import { IPayload } from "../../../client/src/interfaces/socketInterfaces";
export function onCheckersClientReady(this: Socket, args: IPayload) {
    const socket = this;
    console.log("onCheckersClientReady", args);
    this.socket.emit("checkersClientReady", data);
}
