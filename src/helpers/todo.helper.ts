import { Types } from "mongoose";
import { FetchType, FunctionStatus } from "../enums";
import { CompletedStatus } from "../enums/todo.enum";
import { TimeInHHMM, TodoFilterQuery, TodoToShow, UpdateTodoArgs, UpdateTodoBody, YYYYMMDD } from "../types";
import { logFunctionInfo } from "../utils";
import { getDateFromStrings, getDayRange } from "./date.helper";
import { errorMessage } from "../constants";
import { IToDo } from "../interfaces";



/**
 * To get filter to use in match aggregation pipline in Todo 
 */
export const getTodoFilter = (fetchType: FetchType, query: Omit<TodoFilterQuery, 'pageNo' | 'pageLimit'>): Record<string, any> => {
    logFunctionInfo(getTodoFilter.name, FunctionStatus.START);
    const { status, createdBy, dueAt, title } = query;
    let matchFilter: Record<string, any> = {};


    if (fetchType == FetchType.ACTIVE) {
        matchFilter.isDeleted = false;
    }

    if (fetchType == FetchType.TRASH) {
        matchFilter.isDeleted = true;
    }

    if (createdBy) {
        matchFilter.createdBy = new Types.ObjectId(createdBy);
    }
    if (status) {
        if (status == CompletedStatus.COMPLETE) {
            matchFilter.completed = true;
        }
        else {
            matchFilter.completed = false;
        }

    }
    if (dueAt) {
        const dayRange = getDayRange(dueAt);
        matchFilter.dueAt = { $gte: dayRange[0], $lte: dayRange[1] };
    }
    if (title) {
        matchFilter.title = { $regex: title, $options: "i" };
    }

    return matchFilter;
}


/**
 * To update dateFeild with changing date and hours
 */
export const updateTodoDueAt = (dateFeild: Date, dateString?: YYYYMMDD, timeString?: TimeInHHMM): Date => {
    logFunctionInfo(updateTodoDueAt.name, FunctionStatus.START);

    if (dateString && timeString) {
        return getDateFromStrings(dateString, timeString);
    }

    else if (dateString) {
        const timeString = dateFeild.toString().split(' ')[4].slice(0, 5) as TimeInHHMM;
        return getDateFromStrings(dateString, timeString);
    }

    else if (timeString) {
        const dateString = dateFeild.toISOString().slice(0, 10) as YYYYMMDD;
        return getDateFromStrings(dateString, timeString);
    }

    else throw new Error(errorMessage.UNWANTED_DATE_UPDATE)

}


/**
 * To get feilds for update in proper format
 */
export const getTodoUpdateArgs = (updateBody: UpdateTodoBody, existingTodo: IToDo): UpdateTodoArgs => {
    logFunctionInfo(getTodoUpdateArgs.name, FunctionStatus.START);

    const { dueDate, dueTime, ...restTodoUpdateBody } = updateBody;

    if (dueDate || dueTime) {
        const dueAt = updateTodoDueAt(existingTodo.dueAt, dueDate, dueTime);
        return { dueAt, ...restTodoUpdateBody }
    }

    return restTodoUpdateBody;
}


/**
 * To converts the type, in to `TodoToShow`, for more clarity in usage
 */
export const convertTodoToShow = (todoData: any): TodoToShow => {
    return {
        _id: todoData._id,
        title: todoData.title,
        description: todoData.description,
        createdBy: todoData.createdBy,
        dueAt: todoData.dueAt,
        completed: todoData.completed,
        createdAt: todoData.createdAt,
        updatedAt: todoData.updatedAt,
    }
}