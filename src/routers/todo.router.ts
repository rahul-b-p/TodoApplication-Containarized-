import { Router } from "express";
import { roleAuth, validateReqBody, validateReqQuery } from "../middlewares";
import { createTodoSchema, todoFilterSchema } from "../schemas";
import { todoController } from "../controllers";
import { Roles } from "../enums";



export const router = Router();


// API to create todo
router.post('/', validateReqBody(createTodoSchema), todoController.createTodo);

// API to create todo for given user, only Admin
router.post('/:userId', roleAuth(Roles.ADMIN), validateReqBody(createTodoSchema), todoController.createUserTodo);

// API to fetch all todos,Admin can view all, user can view thir own created todos
router.get('/', validateReqQuery(todoFilterSchema), todoController.readAllTodos);