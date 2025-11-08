import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js';
import {createNewChat,getAllChat,clearUnreadMessageCount} from './../controllers/chatController.js'

const chatRouter = express.Router();

chatRouter.post('/create-new-chat',authMiddleware,createNewChat)
chatRouter.get('/get-all-chats',authMiddleware,getAllChat)
chatRouter.post('/clear-unread-message',authMiddleware,clearUnreadMessageCount)


export default chatRouter;