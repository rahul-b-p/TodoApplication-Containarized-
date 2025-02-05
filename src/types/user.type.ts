import { Roles } from "../enums";
import { IUser } from "../interfaces";


export type UserAuthBody = {
    email: string;
    password: string;
}

export type IUserData = Omit<IUser, 'password' | 'refreshToken'>;

export type UserInsertArgs = UserAuthBody & {
    username: string;
    role: Roles;
}

export type UserUpdateArgs = {
    $set?: Partial<IUser>;
    $unset?: {
        refreshToken?: 1;
        officeId?: 1
    };
};