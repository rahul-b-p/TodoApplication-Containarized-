import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { logFunctionInfo } from "../utils";
import { FunctionStatus, Roles } from "../enums";
import { AuthenticationError, ForbiddenError, InternalServerError } from "../errors";
import { verifyAccessToken, verifyRefreshToken } from "../jwt";
import { blacklistToken, checkRefreshTokenExistsById, findUserById, isTokenBlacklisted } from "../services";
import { validateObjectId } from "../validators";
import { errorMessage } from "../constants";




/**
 * Middleware function to Authorize Access Token by JWT
*/
export const accessTokenAuth = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    const functionName = 'accessTokenAuth';
    logFunctionInfo(functionName, FunctionStatus.START);
    try {
        const AccessToken = req.headers.authorization?.split(' ')[1];
        if (!AccessToken) throw new AuthenticationError();

        const isBlacklisted = await isTokenBlacklisted(AccessToken);
        if (isBlacklisted) throw new AuthenticationError();

        const tokenPayload = await verifyAccessToken(AccessToken);
        if (!tokenPayload || !validateObjectId(tokenPayload.id)) throw new AuthenticationError();

        req.payload = { id: tokenPayload.id };

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        next();
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL);
        next(error);
    }
};


/**
 * Middleware function to Authorize Access Token by JWT
*/
export const refreshTokenAuth = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    const functionName = 'refreshTokenAuth';
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const RefreshToken = req.headers.authorization?.split(' ')[1];
        if (!RefreshToken) throw new AuthenticationError();

        const isJwtBlacklisted = await isTokenBlacklisted(RefreshToken);
        if (isJwtBlacklisted) throw new AuthenticationError();

        const tokenPayload = await verifyRefreshToken(RefreshToken);
        if (!tokenPayload || !validateObjectId(tokenPayload.id)) return next(new AuthenticationError());
        const isRefreshTokenExists = await checkRefreshTokenExistsById(tokenPayload.id, RefreshToken);
        if (!isRefreshTokenExists) throw new AuthenticationError();

        await blacklistToken(RefreshToken);
        req.payload = { id: tokenPayload.id };

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        next();
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        next(error);
    }
};


/**
 * Middleware function to Authorize user Role 
 */
export const roleAuth = (...allowedRole: Roles[]) => {
    const functionName = roleAuth.name;

    return async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
        logFunctionInfo(functionName, FunctionStatus.START);
        try {
            const id = req.payload?.id;
            if (!id) throw new InternalServerError(errorMessage.NO_USER_ID_IN_PAYLOAD);

            const existingUser = await findUserById(id);
            if (!existingUser) throw new AuthenticationError()

            if (!allowedRole.includes(existingUser.role)) throw new ForbiddenError(errorMessage.INSUFFICIENT_PRIVILEGES);

            next();
        } catch (error: any) {
            logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
            next(error);
        }
    }
}