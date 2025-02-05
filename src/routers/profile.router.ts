import { Router } from "express";
import { profileController } from "../controllers";



export const router = Router();


// API to view Profile
router.get('/', profileController.readMyProfile);