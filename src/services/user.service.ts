import { FunctionStatus, Roles } from "../enums";
import { IUser } from "../interfaces";
import { User } from "../models";
import { IUserData, UserInsertArgs, UserUpdateArgs } from "../types";
import { hashPassword, logFunctionInfo } from "../utils";



/**
 * To check if there any admin exists on database
 */
export const isAdminExists = async (): Promise<boolean> => {
    const functionName = isAdminExists.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const adminExists = await User.exists({ role: Roles.ADMIN });

        adminExists && logFunctionInfo(functionName, FunctionStatus.SUCCESS);

        return adminExists !== null;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}


/**
 * Inserts a new user with required feilds
*/
export const insertUser = async (user: UserInsertArgs): Promise<IUserData> => {
    const functionName = insertUser.name;
    logFunctionInfo(functionName, FunctionStatus.START);
    try {
        user.password = await hashPassword(user.password);
        const newUser: IUser = new User(user);
        await newUser.save();

        delete (newUser as any).__v;
        const { password, refreshToken, verified, ...userWithoutSensitiveData } = newUser.toObject()

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return userWithoutSensitiveData as IUserData;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}


/**
 * Checks if a refresh token exists for a user by their unique ID.
 */
export const checkRefreshTokenExistsById = async (_id: string, refreshToken: string): Promise<boolean> => {
    const functionName = 'checkRefreshTokenExistsById';
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const UserExists = await User.exists({ _id, refreshToken });

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return UserExists !== null;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}


/**
 * Finds an existing user by its unique email adress.
*/
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    const functionName = 'findUserByEmail';
    logFunctionInfo(functionName, FunctionStatus.START);
    try {
        const user = await User.findOne({ email });

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return user;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}


/**
 * Updates an existing user data by its unique id.
*/
export const updateUserById = async (_id: string, userToUpdate: UserUpdateArgs): Promise<IUserData | null> => {
    const functionName = 'updateUserById';
    logFunctionInfo(functionName, FunctionStatus.START);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, userToUpdate, { new: true }).lean();
        if (!updatedUser) return null;

        delete (updatedUser as any).__v;
        const { password, refreshToken, ...userWithoutSensitiveData } = updatedUser;

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return userWithoutSensitiveData as IUserData;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
};