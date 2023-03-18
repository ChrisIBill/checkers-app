import { IUser } from "@src/models/myUser";
import { getRandomInt } from "@src/util/misc";
import orm from "./UserDatabaseHandler";

// **** Functions **** //

/**
 * Get one user.
 */
async function getOne(name: string): Promise<IUser | null> {
    const db = await orm.openDb();
    for (const user of db.users) {
        if (user.name === name) {
            return user;
        }
    }
    return null;
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<IUser | null> {
    const db = await orm.openDb();
    for (const user of db.users) {
        console.log(user.id);
        if (user.id === id) {
            return user;
        }
    }
    return null;
}

async function uNamePersists(name: string): Promise<boolean> {
    const db = await orm.openDb();
    for (const user of db.users) {
        if (user.name === name) {
            return true;
        }
    }
    return false;
}
/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
    const db = await orm.openDb();
    return db.users;
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<void> {
    const db = await orm.openDb();
    user.id = getRandomInt();
    db.users.push(user);
    return orm.saveDb(db);
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
    const db = await orm.openDb();
    for (let i = 0; i < db.users.length; i++) {
        if (db.users[i].id === user.id) {
            db.users[i] = user;
            return orm.saveDb(db);
        }
    }
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {
    const db = await orm.openDb();
    for (let i = 0; i < db.users.length; i++) {
        if (db.users[i].id === id) {
            db.users.splice(i, 1);
            return orm.saveDb(db);
        }
    }
}

// **** Export default **** //

export default {
    getOne,
    persists,
    uNamePersists,
    getAll,
    add,
    update,
    delete: delete_,
} as const;
