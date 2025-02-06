import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { logFunctionInfo, logger, sendCustomResponse } from "../utils";
import { DateStatus, FunctionStatus } from "../enums";
import { InsertTodoArgs } from "../types";
import { AuthenticationError, BadRequestError, InternalServerError, NotFoundError } from "../errors";
import { errorMessage, responseMessage } from "../constants";
import { findUserById, insertTodo } from "../services";
import { compareDatesWithCurrentDate } from "../helpers";
import { validateObjectId } from "../validators";


/**
 * Controller Function to create tod
 */
export const createTodo = async (req: customRequestWithPayload<{}, any, InsertTodoArgs>, res: Response, next: NextFunction) => {
    const functionName = createTodo.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const userId = req.payload?.id;
        if (!userId) throw new InternalServerError(errorMessage.NO_USER_ID_IN_PAYLOAD);

        const userData = await findUserById(userId);
        if (!userData) throw new AuthenticationError();

        const { dueDate } = req.body;
        const dateStatus = compareDatesWithCurrentDate(dueDate);
        logger.info(dateStatus)
        if (dateStatus == DateStatus.Past) throw new BadRequestError(errorMessage.PAST_DATE_NOT_ALLOWED);

        const insertedTodo = await insertTodo(userId, req.body);

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        res.status(200).json(await sendCustomResponse(responseMessage.TODO_CREATED, insertedTodo));
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        next(error);
    }
}


/**
 * Controller Function to create new todo for given user
 * @protected only admin can access the feature
 * @param userId unique id of user
 */
export const createUserTodo = async (req: customRequestWithPayload<{ userId: string }, any, InsertTodoArgs>, res: Response, next: NextFunction) => {
    const functionName = createUserTodo.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const { userId } = req.params;
        const isValidId = validateObjectId(userId);
        if (!isValidId) throw new BadRequestError(errorMessage.INVALID_ID);

        const existingUser = await findUserById(userId);
        if (!existingUser) throw new NotFoundError(errorMessage.USER_NOT_FOUND);

        const { dueDate } = req.body;
        const dateStatus = compareDatesWithCurrentDate(dueDate);
        logger.info(dateStatus)
        if (dateStatus == DateStatus.Past) throw new BadRequestError(errorMessage.PAST_DATE_NOT_ALLOWED);

        const insertedTodo = await insertTodo(userId, req.body);

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        res.status(200).json(await sendCustomResponse(responseMessage.TODO_CREATED, insertedTodo));
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        next(error);
    }
}