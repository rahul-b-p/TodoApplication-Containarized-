import { Document, Types } from "mongoose";



export interface IToDo extends Document {
    title: string;
    description: string;
    createdBy: Types.ObjectId;
    dueDate: Date;
    completed: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}