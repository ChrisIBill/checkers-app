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

export async function findUserFomToken(token: string): Promise<IUser | null> {
    const persists = await myUserRepo.uNamePersists(token);
    if (!persists) {
        console.log("ERROR: COULD NOT FIND USER FROM TOKEN");
        console.log("Token: ", token);
        return null;
    } else {
        return myUserRepo.getOne(token);
    }
}
