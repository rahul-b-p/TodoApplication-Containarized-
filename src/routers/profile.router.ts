import { Router } from "express";
import { profileController } from "../controllers";
import { validateReqBody } from "../middlewares";
import { userUpdateSchema } from "../schemas";



export const router = Router();


// API to view Profile
router.get('/', profileController.readMyProfile);

// API to update profile
router.put('/', validateReqBody(userUpdateSchema), profileController.updateProfile);