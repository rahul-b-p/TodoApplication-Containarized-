import { Types } from "mongoose";
import { TodoSortKeys } from "../enums";
import { IToDo } from "../interfaces";
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
    isDeleted: boolean;
    createdAt: Date;
    deletedAt: Date;
}

export type TodoFetchResult = PageInfo & {
    data: TodoToShow[];
}