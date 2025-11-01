import express from 'express';
import authMiddleware from "../middleware/authMiddleware.js";
import { newMessage,getAllMessages} from '../controllers/messageControllers.js ';

const messageRouter = express.Router()

messageRouter.post('/new-message',authMiddleware,newMessage)
messageRouter.get('/get-all-messages/:chatId',authMiddleware,getAllMessages)


export default messageRouter;
