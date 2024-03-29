/**
 * Express router paths go here.
 */
import { CLIENT_PATHS } from "@src/constants/ClientPaths";
import {
    ClientPaths,
    NewClientPaths,
} from "@src/interfaces/SocketIO-Interfaces";
import { Immutable } from "@src/other/types";

const Paths = {
    Base: <ClientPaths>"/",
    App: {
        Base: <ClientPaths>"/App",
    },
    Auth: {
        Base: <ClientPaths>"/Auth",
        Login: <ClientPaths>"/Auth/Login",
    },
    Games: {
        Base: <ClientPaths>"/Games",
        Checkers: <ClientPaths>"/Games/Checkers",
    },
};

export const NewPaths = {
    Base: <NewClientPaths>"/",
    Auth: <NewClientPaths>"/Auth",
    Guest: <NewClientPaths>"/Guest",
    User: <NewClientPaths>"/User",
    Admin: <NewClientPaths>"/Admin",
};
/* const Paths = {
  Base: '/api',
  Auth: {
    Base: '/auth',
    Login: '/login',
    Logout: '/logout',
  },
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
}; */

// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
