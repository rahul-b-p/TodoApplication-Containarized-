import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces";
import { Roles } from "../enums";



const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(Roles)
    },
    refreshToken: {
        type: String
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
    toObject: {
        transform(doc, ret) {
            delete ret.__v;
            return ret;
        }
    }
});



const User = mongoose.model<IUser>('users', userSchema);
export default User;