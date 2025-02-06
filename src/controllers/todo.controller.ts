import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { logFunctionInfo, logger, sendCustomResponse } from "../utils";
import { DateStatus, FunctionStatus, Roles } from "../enums";
import { InsertTodoArgs, TodoFilterQuery, UpdateTodoBody } from "../types";
import { AuthenticationError, BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from "../errors";
import { errorMessage, responseMessage } from "../constants";
import { fetchTodos, findTodoById, findUserById, insertTodo, updateTodoById } from "../services";
import { compareDatesWithCurrentDate, getTodoUpdateArgs, pagenate } from "../helpers";
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


/**
 * Controller Function to read all todos 
 *  - Admin can read all todos
 *  - User can read all their own todos
 */
export const readAllTodos = async (req: customRequestWithPayload<{}, any, any, TodoFilterQuery>, res: Response, next: NextFunction) => {
    const functionName = readAllTodos.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const reqOwnerId = req.payload?.id;
        if (!reqOwnerId) throw new InternalServerError(errorMessage.NO_USER_ID_IN_PAYLOAD);
        const reqOwner = await findUserById(reqOwnerId);
        if (!reqOwner) throw new AuthenticationError();

        const query = req.query;

        if (reqOwner.role !== Roles.ADMIN) {
            if (query.createdBy) throw new ForbiddenError(errorMessage.UNAUTHORIZED_TODO_ACCESS);

            query.createdBy = reqOwnerId;
        }

        const todoFetchResult = await fetchTodos(query);
        const message = todoFetchResult ? responseMessage.TODO_DATA_FETCHED : errorMessage.TODO_DATA_NOT_FOUND;

        let PageNationFeilds;
        if (todoFetchResult) {
            const { data, ...pageInfo } = todoFetchResult
            PageNationFeilds = pagenate(pageInfo, req.originalUrl);
        }

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        res.status(200).json({
            success: true, message, ...todoFetchResult, ...PageNationFeilds
        });
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        next(error);
    }
}


/**
 * Controller Function to update todo using its unique id
 *  - Admin can update todos
 *  - User can update their own todos
 * @param id unique id of todo
 */
export const updateTodo = async (req: customRequestWithPayload<{ id: string }, any, UpdateTodoBody>, res: Response, next: NextFunction) => {
    const functionName = updateTodo.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const reqOwnerId = req.payload?.id;
        if (!reqOwnerId) throw new InternalServerError(errorMessage.NO_USER_ID_IN_PAYLOAD);
        const reqOwner = await findUserById(reqOwnerId);
        if (!reqOwner) throw new AuthenticationError();

        const { id } = req.params;
        const isValidId = validateObjectId(id);
        if (!isValidId) throw new BadRequestError(errorMessage.INVALID_ID);

        const existingTodo = await findTodoById(id);
        if (!existingTodo) throw new NotFoundError(errorMessage.TODO_NOT_FOUND);

        if (reqOwner.role !== Roles.ADMIN && existingTodo.createdBy.toString() !== reqOwnerId) {
            throw new ForbiddenError(errorMessage.UNAUTHORIZED_TODO_ACCESS);
        }

        const todoUpdateArgs = getTodoUpdateArgs(req.body, existingTodo);

        const updatedTodo = await updateTodoById(id, todoUpdateArgs);
        if (!updateTodo) throw new InternalServerError(errorMessage.TODO_NOT_FOUND);

        logFunctionInfo(functionName, FunctionStatus.START);
        res.status(200).json(await sendCustomResponse(responseMessage.TODO_UPDATED, updatedTodo));
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        next(error);
    }
}