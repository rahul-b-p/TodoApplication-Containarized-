import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { AuthenticationError, InternalServerError } from "../errors";
import { errorMessage, responseMessage } from "../constants";
import { logFunctionInfo, sendCustomResponse } from "../utils";
import { FunctionStatus } from "../enums";
import { findUserDatasById } from "../services";



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