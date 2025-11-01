import express from 'express';
import authMiddleware from "../middleware/authMiddleware.js";
import { newMessage} from '../controllers/messageControllers.js ';

const messageRouter = express.Router()

messageRouter.post('/new-message',authMiddleware,newMessage)


export default messageRouter;
