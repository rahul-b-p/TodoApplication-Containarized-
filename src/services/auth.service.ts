import { FunctionStatus } from "../enums";
import { IUser } from "../interfaces";
import { signAccessToken, signRefreshToken } from "../jwt";
import { User } from "../models";
import { TokenResonse, UserUpdateArgs } from "../types";
import { logFunctionInfo } from "../utils";
import { updateUserById } from "./user.service";


/**
 * To sign tokens, and save refresh token
 */
export const signNewTokens = async (userData: IUser): Promise<TokenResonse> => {
    const functionName = signNewTokens.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {

        const accessToken = await signAccessToken(userData._id.toString(), userData.role);
        const refreshToken = await signRefreshToken(userData._id.toString(), userData.role);

        const updateRefreshToken: UserUpdateArgs = { $set: { refreshToken } };
        await updateUserById(userData._id.toString(), updateRefreshToken);

        return {
            accessToken,
            refreshToken,
            tokenType: 'Bearer'
        }
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message)
    }
}


/**
 * Checks if a refresh token exists for a user by their unique ID.
 */
export const checkRefreshTokenExistsById = async (_id: string, refreshToken: string): Promise<boolean> => {
    const functionName = checkRefreshTokenExistsById.name;
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
 * to sign tokens with verifying account and saving the password
 */
export const verfyAccountAndSignNewTokens = async (userData: IUser): Promise<TokenResonse> => {
    const functionName = verfyAccountAndSignNewTokens.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {

        const accessToken = await signAccessToken(userData._id.toString(), userData.role);
        const refreshToken = await signRefreshToken(userData._id.toString(), userData.role);

        const updateRefreshToken: UserUpdateArgs = { $set: { refreshToken, verified: true } };
        await updateUserById(userData._id.toString(), updateRefreshToken);

        return {
            accessToken,
            refreshToken,
            tokenType: 'Bearer'
        }
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message)
    }
}