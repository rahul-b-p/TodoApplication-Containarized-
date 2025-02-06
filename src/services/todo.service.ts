import { FunctionStatus, TodoSortArgs } from "../enums";
import { getDateFromStrings, getPaginationParams, getTodoFilter } from "../helpers";
import { IToDo } from "../interfaces";
import { Todo } from "../models";
import { InsertTodoArgs, TodoFetchResult, TodoFilterQuery, TodoToShow, UpdateTodoArgs } from "../types";
import { getTodoSortArgs, logFunctionInfo } from "../utils";



/**
 * TO insert a new todo
*/
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

        logFunctionInfo(functionName, FunctionStatus.SUCCESS)
        return newTodo;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}


/**
 * To aggregate todo filter count
*/
export const getTodoFilterCount = async (matchFilter: Record<string, string>): Promise<number> => {
    logFunctionInfo(getTodoFilterCount.name, FunctionStatus.START);

    try {
        const totalFilter = await Todo.aggregate([
            { $match: matchFilter },
            {
                $count: 'totalCount'  // Count all documents matching the filter
            }
        ]);

        return totalFilter.length > 0 ? totalFilter[0].totalCount : 0;
    } catch (error) {
        throw error;
    }
}


/**
 * To aggreagate user by filter,search, sort and pagenating
 */
export const filterTodos = async (matchFilter: Record<string, any>, sort: TodoSortArgs, skip: number, limit: number): Promise<TodoToShow[]> => {
    logFunctionInfo(filterTodos.name, FunctionStatus.START)
    try {
        return await Todo.aggregate([
            { $match: matchFilter },
            { $sort: JSON.parse(sort) },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                email: 1,
                                role: 1

                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: '$createdBy',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    createdBy: 1,
                    dueAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    completed: 1,
                    isDeleted: 1
                },
            },
        ]);
    } catch (error) {
        throw error;
    }
}


/**
 * To fetch todos with serach, filter, sort and pagenation
 */
export const fetchTodos = async (query: TodoFilterQuery): Promise<TodoFetchResult | null> => {
    const functionName = fetchTodos.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const { sortKey, pageLimit, pageNo, ...matchQuery } = query;

        const matchFilter = getTodoFilter(matchQuery);
        const { page, limit, skip } = getPaginationParams(pageNo, pageLimit);
        const sort = getTodoSortArgs(sortKey);

        const totalItems = await getTodoFilterCount(matchFilter)

        const allTodos: TodoToShow[] = await filterTodos(matchFilter, sort, skip, limit)

        const totalPages = Math.ceil(totalItems / limit);
        const fetchResult: TodoFetchResult = {
            page,
            pageSize: limit,
            totalPages,
            totalItems,
            data: allTodos
        }
        return allTodos.length > 0 ? fetchResult : null;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}


/**
 * To find todo using its unique id
 */
export const findTodoById = async (_id: string): Promise<IToDo | null> => {
    const functionName = findTodoById.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const todo = await Todo.findById(_id);
        delete (todo as any).__v;

        if (todo) logFunctionInfo(functionName, FunctionStatus.SUCCESS);

        return todo;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error);
    }
}


/**
 * to update todo by its ubique id
 */
export const updateTodoById = async (_id: string, updateBody: UpdateTodoArgs): Promise<IToDo | null> => {
    const functionName = updateTodoById.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(_id, updateBody, { new: true }).lean();
        if (!updatedTodo) return null;

        delete (updatedTodo as any).__v;

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return updatedTodo;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error);
    }
}