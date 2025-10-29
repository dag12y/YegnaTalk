import express from 'express';
import { getLoggedUser } from '../controllers/userControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/get-logged-user',authMiddleware,getLoggedUser)

export default userRouter;