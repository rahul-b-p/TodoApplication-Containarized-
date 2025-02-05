import { NextFunction, Request, Response } from "express";
import { UserAuthBody, UserInsertArgs, userSignUpBody } from "../types";
import { FunctionStatus, Roles } from "../enums";
import { comparePassword, logFunctionInfo, sendCustomResponse } from "../utils";
import { findUserByEmail, insertUser, signNewTokens } from "../services";
import { AuthenticationError, BadRequestError, ConflictError, NotFoundError } from "../errors";
import { errorMessage, responseMessage } from "../constants";
import { checkEmailValidity, validateEmailUniqueness } from "../validators";


/**
 * Controller function to handle the user login request.
 * Send OTP to registered email, if the account not verified, usually on first time login
 */
export const login = async (req: Request<{}, any, UserAuthBody>, res: Response, next: NextFunction) => {
    const functionName = login.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const { email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (!existingUser) throw new NotFoundError(errorMessage.USER_NOT_FOUND);

        const isVerifiedPassword = await comparePassword(password, existingUser.password);
        if (!isVerifiedPassword) throw new AuthenticationError(errorMessage.INVALID_PASSWORD);

        const tokens = await signNewTokens(existingUser);

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        res.statusMessage = "Login Successful";
        res.status(200).json(await sendCustomResponse(responseMessage.SUCCESS_LOGIN, { tokens }));
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        next(error)
    }
}


/**
 * Controller Function to sign up as user
 */
export const signUp = async (req: Request<{}, any, userSignUpBody>, res: Response, next: NextFunction) => {
    const functionName = signUp.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const { email } = req.body;

        const isValidEmail = await checkEmailValidity(email);
        if (!isValidEmail) throw new BadRequestError(errorMessage.INVALID_EMAIL);

        const isUniqueEmail = await validateEmailUniqueness(email);
        if (!isUniqueEmail) throw new ConflictError(errorMessage.EMAIL_ALREADY_EXISTS);

        const newUser = await insertUser(req.body);

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        res.status(200).json(await sendCustomResponse(responseMessage.SUCCESS_SIGNUP, newUser));
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        next(error);
    }
}