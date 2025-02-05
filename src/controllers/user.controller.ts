import { NextFunction, Response } from "express";
import { errorMessage, responseMessage } from "../constants";
import { FunctionStatus, UserSortArgs } from "../enums";
import { BadRequestError, ConflictError } from "../errors";
import { customRequestWithPayload } from "../interfaces";
import { fetchUsers, insertUser, sendUserCreationNotification } from "../services";
import { UserFilterQuery, UserInsertArgs } from "../types";
import { getUserSortArgs, logFunctionInfo, logger, pagenate, sendCustomResponse } from "../utils";
import { checkEmailValidity, validateEmailUniqueness } from "../validators";




/**
 * Controller function to create a new user
 * @protected only admin or manger can access this feature
 * - admin can create user with any role
 * - manager can't create admin privilliaged user
 */
export const createUser = async (req: customRequestWithPayload<{}, any, UserInsertArgs>, res: Response, next: NextFunction) => {
    const functionName = createUser.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const { email } = req.body;

        const isValidEmail = await checkEmailValidity(email);
        if (!isValidEmail) throw new BadRequestError(errorMessage.INVALID_EMAIL);

        const isUniqueEmail = await validateEmailUniqueness(email);
        if (!isUniqueEmail) throw new ConflictError(errorMessage.EMAIL_ALREADY_EXISTS);

        const newUser = await insertUser(req.body);
        sendUserCreationNotification(newUser).catch((error) => {
            logger.error(error);
        });

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        res.status(201).json(await sendCustomResponse(responseMessage.USER_CREATED, newUser));
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        next(error);
    }
}


/**
 * Controller function to create a new user
 * Filter the Users by roles
 * @protected only admin or manger can access this feature
 * - admin can read al users
 * - manager can read assigned users only
 */
export const readAllUsers = async (req: customRequestWithPayload<{}, any, any, UserFilterQuery>, res: Response, next: NextFunction) => {
    const functionName = readAllUsers.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const fetchResult = await fetchUsers(req.query);

        const message = fetchResult ? responseMessage.USER_DATA_FETCHED : errorMessage.USER_DATA_NOT_FOUND;

        let PageNationFeilds;
        if (fetchResult) {
            const { data, ...pageInfo } = fetchResult
            PageNationFeilds = pagenate(pageInfo, req.originalUrl);
        }

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        res.status(200).json({
            success: true, message, ...fetchResult, ...PageNationFeilds
        });
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        next(error);
    }
}
