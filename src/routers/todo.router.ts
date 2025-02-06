import { Router } from "express";
import { roleAuth, validateReqBody } from "../middlewares";
import { createTodoSchema } from "../schemas";
import { todoController } from "../controllers";
import { Roles } from "../enums";



export const router = Router();


// API to create todo
router.post('/', validateReqBody(createTodoSchema), todoController.createTodo);

// API to create todo for given user, only Admin
router.post('/:userId', roleAuth(Roles.ADMIN), validateReqBody(createTodoSchema), todoController.createUserTodo);