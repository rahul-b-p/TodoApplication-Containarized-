import { Router } from "express";
import { validateReqBody } from "../middlewares";
import { createTodoSchema } from "../schemas";
import { todoController } from "../controllers";



export const router = Router();


// API to create todo
router.post('/', validateReqBody(createTodoSchema), todoController.createTodo);