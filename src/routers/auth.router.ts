import { Router } from "express";
import { validateReqBody } from "../middlewares";
import { userLoginSchema } from "../schemas";
import { authController } from "../controllers";




export const router = Router();

router.post('/login', validateReqBody(userLoginSchema), authController.login);