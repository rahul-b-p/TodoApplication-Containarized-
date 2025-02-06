import { FunctionStatus } from "../enums";
import { getDateFromStrings } from "../helpers";
import { IToDo } from "../interfaces";
import { Todo } from "../models";
import { InsertTodoArgs } from "../types";
import { logFunctionInfo } from "../utils";




export const insertTodo = async (createdBy: string, todoToInsert: InsertTodoArgs): Promise<IToDo> => {
    const functionName = insertTodo.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        let { dueDate, dueTime, description, title } = todoToInsert;
        const dueAt = getDateFromStrings(dueDate, dueTime);

        const newTodo = new Todo({
            title,
            description,
            createdBy,
            dueAt
        });

        newTodo.save();

        delete (newTodo as any).__v;

        return newTodo;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}