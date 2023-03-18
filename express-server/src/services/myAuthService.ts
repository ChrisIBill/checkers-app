import { IUser } from "@src/models/myUser";
import myUserRepo from "@src/repos/myUserRepo";

async function login(user: IUser) {
    //TODO
    const persists = await myUserRepo.uNamePersists(user.name);
    if (!persists) {
        console.log("ERROR: COULD NOT FIND USER");
        console.log("User: ", user);
        return false;
    } else {
        console.log("User found", user);
        return true;
    }
}
export async function userSignupAuth(user: string): Promise<IUser | null> {
    console.log("User Signup Authentication");
    const persists = await myUserRepo.uNamePersists(user);
    if (!persists) {
        console.log("ERROR: User already exists");
        console.log("User: ", user);
        return null;
    } else {
        console.log("Unique user received. Registering new User");
        console.log("User: ", user);
        const newUser: IUser = {
            name: user,
        };
        myUserRepo.add(newUser);
        return myUserRepo.getOne(user);
    }
}
export async function findUserFromToken(token: number): Promise<IUser | null> {
    const persists = await myUserRepo.persists(Number(token));
    if (!persists) {
        console.log("ERROR: COULD NOT FIND USER FROM TOKEN");
        console.log("Token: ", token);
        console.log(typeof token);
        return null;
    } else {
        return persists;
    }
}
