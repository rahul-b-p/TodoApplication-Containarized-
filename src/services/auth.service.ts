import { FunctionStatus } from "../enums";
import { IUser } from "../interfaces";
import { signAccessToken, signRefreshToken } from "../jwt";
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

