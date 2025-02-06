import { Types } from "mongoose";
import { TodoSortKeys } from "../enums";
import { YYYYMMDD } from "./date.type";
import { PageFilter, PageInfo } from "./page.type";
import { TimeInHHMM } from "./time.type";
import { UserToShow } from "./user.type";
import { CompletedStatus } from "../enums/todo.enum";


export type InsertTodoArgs = {
    title: string;
    description: string;
    dueDate: YYYYMMDD;
    dueTime: TimeInHHMM;
}

export type TodoFilterQuery = PageFilter & {
    title?: string;
    status?: CompletedStatus;
    createdBy?: string;
    dueAt?: YYYYMMDD;
    sortKey?: TodoSortKeys;
}

export type TodoToShow = {
    _id: Types.ObjectId;
    title: string;
    description: string;
    dueAt: Date;
    completed: boolean;
    createdBy: UserToShow;
    createdAt: Date;
    updatedAt: Date;
}

export type TodoFetchResult = PageInfo & {
    data: TodoToShow[];
}

export type UpdateTodoBody = Partial<InsertTodoArgs> & {
    completed?: boolean;
}

export type UpdateTodoArgs = Omit<UpdateTodoBody, 'dueDate' | 'dueTime'> & {
    dueAt?: Date;
}