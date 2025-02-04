import { Roles } from "../enums";
import { IUser } from "../interfaces";



export type IUserData = Omit<IUser, 'password' | 'refreshToken'>;


export type UserInsertArgs = {
    username: string;
    email: string;
    password: string;
    role: Roles;
}