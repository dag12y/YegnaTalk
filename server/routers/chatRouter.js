import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js';
import {createNewChat} from './../controllers/chatController.js'

const chatRouter = express.Router();

chatRouter.post('/create-new-chat',authMiddleware,createNewChat)


export default chatRouter;