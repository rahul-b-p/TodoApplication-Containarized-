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
            ref: 'User',
        },
        dueDate: {
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


todoSchema.pre('save', function (this: IToDo, next: () => void) {
    if (this.isModified('isDeleted') && this.isDeleted) {
        this.deletedAt = new Date();
    }
    next();
});

const Todo = mongoose.model<IToDo>('todos', todoSchema);

export default Todo;