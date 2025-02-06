import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { logFunctionInfo, logger, sendCustomResponse } from "../utils";
import { DateStatus, FunctionStatus } from "../enums";
import { InsertTodoArgs } from "../types";
import { AuthenticationError, BadRequestError, InternalServerError } from "../errors";
import { errorMessage, responseMessage } from "../constants";
import { findUserById, insertTodo } from "../services";
import { compareDatesWithCurrentDate } from "../helpers";



export const createTodo = async (req: customRequestWithPayload<{}, any, InsertTodoArgs>, res: Response, next: NextFunction) => {
    const functionName = createTodo.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const id = req.payload?.id;
        if (!id) throw new InternalServerError(errorMessage.NO_USER_ID_IN_PAYLOAD);

        const userData = await findUserById(id);
        if (!userData) throw new AuthenticationError();

        const { dueDate } = req.body;
        const dateStatus = compareDatesWithCurrentDate(dueDate);
        logger.info(dateStatus)
        if (dateStatus == DateStatus.Past) throw new BadRequestError(errorMessage.PAST_DATE_NOT_ALLOWED);

        const insertedTodo = await insertTodo(id, req.body);

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        res.status(200).json(await sendCustomResponse(responseMessage.TODO_CREATED));
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        next(error);
    }
}