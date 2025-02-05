import { Router } from "express";
import { roleAuth, validateReqBody } from "../middlewares";
import { createUserSchema } from "../schemas";
import { Roles } from "../enums";
import { userController } from "../controllers";



export const router = Router();


// API to create user by admin
router.post('/', roleAuth(Roles.ADMIN), validateReqBody(createUserSchema), userController.createUser);