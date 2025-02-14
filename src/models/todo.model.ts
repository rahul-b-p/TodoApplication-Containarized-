import { IToDo } from "../interfaces";
import mongoose, { Schema } from 'mongoose';



const todoSchema = new Schema<IToDo>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users',
        },
        dueAt: {
            type: Date,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                if (!ret.isDeleted) {
                    delete ret.deletedAt;
                }
                return ret;
            },
        },
        toObject: {
            transform: function (doc, ret) {
                if (!ret.isDeleted) {
                    delete ret.deletedAt;
                }
                return ret;
            },
        },
    }
);


const Todo = mongoose.model<IToDo>('todos', todoSchema);

export default Todo;