import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { UserRoles } from "@src/models/User";
import { findUserFromToken } from "@src/services/myAuthService";
import { Socket } from "socket.io";

const AUTH_ERROR = {
    NO_TOKEN: {
        message: "UNAUTHORIZED: NO TOKEN",
        cause: HttpStatusCodes.UNAUTHORIZED.toString(),
    },
    USER_NOT_FOUND: {
        message: "UNAUTHORIZED: USER NOT FOUND",
        status: HttpStatusCodes.UNAUTHORIZED,
    },
    BAD_ROLE: {
        message: "UNAUTHORIZED: USER NOT AUTHORIZED FOR ROLE",
        status: HttpStatusCodes.UNAUTHORIZED,
    },
};
export async function authMw(
    socket: Socket,
    role?: UserRoles
): Promise<UserRoles> {
    const token = socket.handshake.auth.token;
    if (!token) {
        /* Guests need to be given temp token, so this is still invalid */
        throw new Error("UNAUTHORIZED: NO TOKEN");
    } else {
        const user = await findUserFromToken(token);
        if (!user) {
            throw new Error("UNAUTHORIZED: USER NOT FOUND");
        } else if (role && user.role !== role) {
            throw new Error("UNAUTHORIZED: USER NOT AUTHORIZED FOR ROLE: ");
        } else {
            console.log(`User: ${user.name} is authorized for role: ${role}`);
            return user.role;
        }
    }
}

export const guestAuthMw = async (
    socket: Socket,
    next: (err?: any) => void
) => {
    try {
        const auth = await authMw(socket, UserRoles.Guest);
        if (UserRoles.Guest <= auth) {
            next();
        }
    } catch (error) {
        console.log("Error in guestAuthMw: ", error);
        const err: any = new Error(error);
        next(error);
    }
};

export const userAuthMw = async (socket: Socket, next: (err?: any) => void) => {
    try {
        const auth = await authMw(socket, UserRoles.User);
        if (UserRoles.User <= auth) {
            next();
        }
    } catch (error) {
        console.log("Error in userAuthMw: ", error);
        const err: any = new Error(error);
        err.data = HttpStatusCodes.UNAUTHORIZED;
        next(error);
    }
};

export const adminAuthMw = async (
    socket: Socket,
    next: (err?: any) => void
) => {
    try {
        const auth = await authMw(socket, UserRoles.Admin);
        if (UserRoles.Admin === auth) {
            next();
        }
    } catch (error) {
        console.log("Error in adminAuthMw: ", error);
        const err: any = new Error(error);
        err.data = HttpStatusCodes.UNAUTHORIZED;
        next(error);
    }
};
console.log("git stuff");
/* export const rootAuthMw = async (socket: Socket, next: (err?: any) => void) => {
    try {
        const auth = await authMw(UserRoles.Root, socket);
        if (UserRoles.Root === auth) {
            next();
        }
    } catch (error) {
        next(error);
    }
} */
