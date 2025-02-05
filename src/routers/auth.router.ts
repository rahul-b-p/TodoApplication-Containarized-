import { Router } from "express";
import { accessTokenAuth, refreshTokenAuth, validateReqBody } from "../middlewares";
import { userLoginSchema, userSignupSchema } from "../schemas";
import { authController } from "../controllers";




export const router = Router();

// API to login
router.post('/login', validateReqBody(userLoginSchema), authController.login);

// API to signup as user(can't signup as an admin)
router.post('/signup', validateReqBody(userSignupSchema), authController.signUp);

// API to refresh tokens
router.post('/refresh', refreshTokenAuth, authController.refresh);

// API ro logout
router.post('/logout', accessTokenAuth, authController.logout);