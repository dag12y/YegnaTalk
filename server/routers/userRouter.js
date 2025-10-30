import express from 'express';
import { getLoggedUser,getAllUsers } from '../controllers/userControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/get-logged-user',authMiddleware,getLoggedUser)
userRouter.get('/get-all-users',authMiddleware,getAllUsers)

export default userRouter;