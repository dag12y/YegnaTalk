import express from 'express';
import { getLoggedUser,getAllUsers,uploadProfilePic } from '../controllers/userControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/get-logged-user',authMiddleware,getLoggedUser)
userRouter.get('/get-all-users',authMiddleware,getAllUsers)
userRouter.post('/upload-profile-pic',authMiddleware,uploadProfilePic)

export default userRouter;