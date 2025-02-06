import { Types } from "mongoose";
import { FunctionStatus } from "../enums";
import { CompletedStatus } from "../enums/todo.enum";
import { TodoFilterQuery } from "../types";
import { logFunctionInfo } from "../utils";
import { getDayRange } from "./date.helper";



/**
 * To get filter to use in match aggregation pipline in Todo 
 */
export const getTodoFilter = (query: Omit<TodoFilterQuery, 'pageNo' | 'pageLimit'>): Record<string, any> => {
    logFunctionInfo(getTodoFilter.name, FunctionStatus.START);
    const { status, createdBy, dueAt, title } = query;
    const matchFilter: Record<string, any> = {};
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