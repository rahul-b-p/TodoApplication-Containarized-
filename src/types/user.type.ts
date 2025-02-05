import { Types } from "mongoose";
import { Roles } from "../enums";
import { IUser } from "../interfaces";


export type UserAuthBody = {
    email: string;
    password: string;
}

export type IUserData = Omit<IUser, 'password' | 'refreshToken'>;

export type UserInsertArgs = UserAuthBody & {
    username: string;
    role?: Roles;
}

export type UserSignUpBody = Omit<UserInsertArgs, 'role'>;

export type UserUpdateArgs = {
    $set?: Partial<IUser>;
    $unset?: {
        refreshToken?: 1;
        officeId?: 1
    };
};

export type VerifyUserBody = {
    email: string;
    otp: string;
}

export type UserPasswordResetBody = VerifyUserBody & {
    password: string;
    confirmPassword: string;
}

export type UserToShow = UserAuthBody & {
    _id: Types.ObjectId;
    role: Roles;
    verified: boolean
    createdAt: Date;
    updatedAt: Date;
}