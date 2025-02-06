import { YYYYMMDD } from "./date.type";
import { TimeInHHMM } from "./time.type";


export type InsertTodoArgs = {
    title: string;
    description: string;
    dueDate: YYYYMMDD;
    dueTime: TimeInHHMM;
}