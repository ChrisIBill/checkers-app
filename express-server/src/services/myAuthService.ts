import { IUser, UserRoles } from "@src/models/User";
import UserRepo from "@src/repos/UserRepo";

async function login(user: IUser) {
    //TODO
    const persists = await UserRepo.uNamePersists(user.name);
    if (!persists) {
        console.log("ERROR: COULD NOT FIND USER");
        console.log("User: ", user);
        return false;
    } else {
        console.log("User found", user);
        return true;
    }
}
export async function userSignupAuth(user: IUser): Promise<IUser | null> {
    console.log("User Signup Authentication, user: ", user);
    const persists = await UserRepo.uNamePersists(user.name);
    if (persists) {
        console.log("ERROR: User already exists");
        console.log("User: ", user);
        return null;
    } else {
        console.log("Unique user received. Registering new User");
        console.log("User: ", user);
        const newUser: IUser = {
            name: user.name,
            role: UserRoles.User,
        };
        UserRepo.add(newUser).then(async (res) => {
            const dbUser = await UserRepo.getOne(user.name);
            if (!dbUser) {
                console.log(
                    "BAD ERROR: USER SHOULD HAVE JUST BEEN ADDED TO DB"
                );
                throw new Error("Could not find user in database");
            }
        });
        return newUser;
    }
}
export async function findUserFromToken(token: number): Promise<IUser | null> {
    const persists = await UserRepo.persists(Number(token));
    if (!persists) {
        console.log("ERROR: COULD NOT FIND USER FROM TOKEN");
        console.log("Token: ", token);
        console.log(typeof token);
        return null;
    } else {
        return persists;
    }
}
