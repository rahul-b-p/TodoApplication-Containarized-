import { Types } from "mongoose";
import { Roles, UserSortKeys } from "../enums";
import { IUser } from "../interfaces";
import { PageInfo } from "./page.type";
import { boolean } from "zod";


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

export type UserUpdateBody = Partial<Omit<UserInsertArgs, 'password'>> & {
    verified?: boolean
};

export type UserFilterQuery = {
    pageNo: string;
    pageLimit: string;
    role?: Roles;
    sortKey?: UserSortKeys;
    username?: string;
}

export type UserFetchResult = PageInfo & {
    data: UserToShow[];
}

export type UserUpdateRequirments = {
    message: string;
    arguments: UserUpdateArgs;
    mailTo?: string[];
}