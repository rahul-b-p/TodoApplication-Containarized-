import { Router } from "express";
import { roleAuth, validateReqBody, validateReqQuery } from "../middlewares";
import { createUserSchema, userFilterQuerySchema } from "../schemas";
import { Roles } from "../enums";
import { userController } from "../controllers";



export const router = Router();


// API to create user by admin
router.post('/', roleAuth(Roles.ADMIN), validateReqBody(createUserSchema), userController.createUser);

// API to fetch users by admin(included filter, serach, sort and pagenation)
router.get('/', roleAuth(Roles.ADMIN), validateReqQuery(userFilterQuerySchema), userController.readAllUsers);