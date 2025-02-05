import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { logFunctionInfo } from "../utils";
import { FunctionStatus } from "../enums";
import { AuthenticationError } from "../errors";
import { verifyAccessToken, verifyRefreshToken } from "../jwt";
import { blacklistToken, checkRefreshTokenExistsById, isTokenBlacklisted } from "../services";
import { validateObjectId } from "../validators";

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

