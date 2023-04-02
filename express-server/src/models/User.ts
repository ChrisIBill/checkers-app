// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM =
    "nameOrObj arg must a string or an object " +
    "with the appropriate user keys.";

export enum UserRoles {
    Guest,
    User,
    Admin,
}
export const USER_ROLES = Object.keys(UserRoles);
// **** Types **** //
/**
 * @param name: string
 * @param id?: number
 * @param pwdHash?: string
 * @param role?: UserRoles;
 */
export type UserIDType = number;
export interface IUser {
    name: string;
    role: UserRoles;
    id?: UserIDType;
    pwdHash?: string;
}

export interface ISessionUser {
    id: number;
    name: string;
    role: IUser["role"];
}

// **** User **** //

class User implements IUser {
    public name: string;
    public role: UserRoles;
    public id?: number;
    public pwdHash?: string;
    /**
     * Constructor()
     */
    constructor(name: string, id?: number, pwdHash?: string, role?: UserRoles) {
        this.name = name;
        this.id = id ?? -1;
        this.pwdHash = pwdHash ?? "";
        this.role = role ?? UserRoles.User;
    }

    /**
     * Get user instance from object.
     */
    public static from(param: object): User {
        // Check is user
        if (!User.isMyUser(param)) {
            throw new Error(INVALID_CONSTRUCTOR_PARAM);
        }
        // Get user instance
        const p = param as IUser;
        return new User(p.name);
    }

    /**
     * Is this an object which contains all the user keys.
     */
    public static isMyUser(this: void, arg: unknown): boolean {
        return !!arg && typeof arg === "object" && "name" in arg;
    }
    public static isUser(this: void, arg: unknown): boolean {
        return (
            !!arg &&
            typeof arg === "object" &&
            "id" in arg &&
            "name" in arg &&
            "role" in arg
        );
    }
}

// **** Export default **** //

export default User;
