import { z } from "zod";
import { dueDateSchema, dueTimeSchema } from "./date.schema";
import { errorMessage } from "../constants";


const titleSchema = z.string({ message: errorMessage.TITLE_REQUIRED }).min(5, errorMessage.TITLE_MIN_LENGTH);
const descriptionSchema = z.string({ message: errorMessage.DESC_REQUIRED }).min(5, errorMessage.DESC_MIN_LENGTH).max(200, errorMessage.DESC_MAX_LENGTH);


export const createTodoSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    dueDate: dueDateSchema,
    dueTime: dueTimeSchema
}).strict();