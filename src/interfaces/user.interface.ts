import { Document, Types } from "mongoose";
import { Roles } from "../enums";



export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    role: Roles;
    refreshToken?: string;
    verified:boolean
    createdAt: Date;
    updatedAt: Date;
}