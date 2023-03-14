// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM =
    "nameOrObj arg must a string or an object " +
    "with the appropriate user keys.";

export enum UserRoles {
    Standard,
    Admin,
}

// **** Types **** //

export interface IUser {
    id: number;
    name: string;
    pwdHash?: string;
    role?: UserRoles;
}

export interface ISessionUser {
    id: number;
    name: string;
    role: IUser["role"];
}

// **** User **** //

class User implements IUser {
    public id: number;
    public name: string;
    public pwdHash?: string;
    public role?: UserRoles;
    /**
     * Constructor()
     */
    constructor(id: number, name: string, pwdHash?: string, role?: UserRoles) {
        this.name = name;
        this.id = id;
        this.pwdHash = pwdHash ?? "";
        this.role = role ?? UserRoles.Standard;
    }

    /**
     * Get user instance from object.
     */
    public static from(param: object): User {
        // Check is user
        if (!User.isUser(param)) {
            throw new Error(INVALID_CONSTRUCTOR_PARAM);
        }
        // Get user instance
        const p = param as IUser;
        return new User(p.id, p.name);
    }

    /**
     * Is this an object which contains all the user keys.
     */
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
