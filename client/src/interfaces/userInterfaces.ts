export interface IUser {
	name: string;
	token: string;
}

export type UserData = IUser | null;

/* Context */
export type UserContextType = {userData: IUser | null};

export interface UserPanelProps {
	userData: UserData;
}
