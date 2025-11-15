import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    newMessage,
    getAllMessages,
    sendImageMessage
} from "../controllers/messageControllers.js";
import multer from "multer";

// Configure Multer with memory storage and file size limit
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
});

const messageRouter = express.Router();

messageRouter.post("/new-message", authMiddleware, newMessage);
messageRouter.get("/get-all-messages/:chatId", authMiddleware, getAllMessages);

messageRouter.post(
    "/send-image",
    authMiddleware,
    upload.single("image"),
    sendImageMessage
);

export default messageRouter;
