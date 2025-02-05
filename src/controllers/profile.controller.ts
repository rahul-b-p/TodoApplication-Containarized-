import { NextFunction, Response } from "express";
import { customRequestWithPayload, IUser } from "../interfaces";
import { AuthenticationError, BadRequestError, ConflictError, ForbiddenError, InternalServerError } from "../errors";
import { errorMessage, responseMessage } from "../constants";
import { logFunctionInfo, logger, sendCustomResponse } from "../utils";
import { FunctionStatus, Roles } from "../enums";
import { findUserById, findUserDatasById, sendUserUpdationNotification, updateUserById } from "../services";
import { UserUpdateArgs, UserUpdateBody } from "../types";
import { checkEmailValidity, validateEmailUniqueness } from "../validators";



/**
 * Controller Function to get all data of logined user
 */
export const readMyProfile = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    const functionName = readMyProfile.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const id = req.payload?.id;
        if (!id) throw new InternalServerError(errorMessage.NO_USER_ID_IN_PAYLOAD);

        const userData = await findUserDatasById(id);
        if (!userData) throw new AuthenticationError();

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        res.status(200).json(await sendCustomResponse(responseMessage.PROFILE_FETCHED, userData))
    } catch (error) {
        logFunctionInfo(functionName, FunctionStatus.FAIL);
        next(error);
    }
}

/**
 * Controller function to allow a logged-in user to update their own account details.
 * If the user updates their email,
 * the account will need re-verification to confirm the new email address.
 */
export const updateProfile = async (req: customRequestWithPayload<{}, any, UserUpdateBody>, res: Response, next: NextFunction) => {
    const functionName = updateProfile.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const { role, email } = req.body;
        const id = req.payload?.id as string;
        const existingUser = await findUserById(id) as IUser;

        if (role) {
            if (existingUser.role !== Roles.ADMIN) throw new ForbiddenError(errorMessage.INSUFFICIENT_PRIVILEGES);
        }

        let userUpdateArgs;
        let emailAdress;
        let message;
        if (email) {
            const isValidEmail = await checkEmailValidity(email);
            if (!isValidEmail) throw new BadRequestError(errorMessage.INVALID_EMAIL);

            if (email == existingUser.email) throw new BadRequestError(errorMessage.EMAIL_ALREADY_IN_USE);

            const isUniqueEmail = await validateEmailUniqueness(email);
            if (!isUniqueEmail) throw new ConflictError(errorMessage.EMAIL_ALREADY_EXISTS);

            userUpdateArgs = { $set: { ...req.body, verified: false }, $unset: { refreshToken: 1 } } as UserUpdateArgs;
            emailAdress = [email, existingUser.email] as string[];
            message = `${responseMessage.PROFILE_UPDATED}, ${responseMessage.EMAIL_VERIFICATION_REQUIRED}` as string;
        }
        else {
            userUpdateArgs = { $set: req.body } as UserUpdateArgs;
            emailAdress = [] as string[];
            message = responseMessage.PROFILE_UPDATED as string;
        }
        const updatedUser = await updateUserById(id, userUpdateArgs);
        if (updatedUser) {
            Promise.all(emailAdress.map((adress) => {
                sendUserUpdationNotification(adress, updatedUser, existingUser.email)
            })).catch((err) => {
                logger.error(err);
            })
        }

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        res.status(200).json({ ...await sendCustomResponse(message, updatedUser), verifyLink: email ? '/auth/login' : undefined });
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL);
        next(error);
    }
}