import Message from "./../models/messageModel.js";
import Chats from "./../models/chatModel.js";
import cloudinary from "../configs/cloudinary.js";

export async function newMessage(req, res) {
    try {
        const userId = req.body.userId; // from middleware
        const { chatId, text } = req.body;

        //  1. Validate inputs
        if (!chatId || !text) {
            return res.status(400).send({
                message: "chatId and text are required",
                success: false,
            });
        }

        // 2. Find the chat
        const chat = await Chats.findById(chatId);
        if (!chat) {
            return res.status(404).send({
                message: "Chat not found",
                success: false,
            });
        }

        // 3. Ensure user is a member of the chat
        const isMember = chat.members.some(
            (memberId) => memberId.toString() === userId.toString()
        );
        if (!isMember) {
            return res.status(403).send({
                message: "Access denied: You are not a member of this chat.",
                success: false,
            });
        }

        // 4. Create and save the message
        const newMessage = new Message({
            chatId,
            sender: userId,
            text,
        });

        const savedMessage = await newMessage.save();

        // 5. Update chat’s last message and unread count
        await Chats.findByIdAndUpdate(chatId, {
            lastMessage: savedMessage._id,
            $inc: { unreadMessageCount: 1 },
        });

        // 6. Send response
        res.status(201).send({
            message: "Message sent successfully",
            success: true,
            data: savedMessage,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
        });
    }
}

export async function getAllMessages(req, res) {
    try {
        const userId = req.body.userId; // Extracted from JWT middleware
        const chatId = req.params.chatId;

        // 1. Validate inputs
        if (!chatId) {
            return res.status(400).send({
                message: "chatId parameter is required",
                success: false,
            });
        }

        // 2. Check if chat exists
        const chat = await Chats.findById(chatId);
        if (!chat) {
            return res.status(404).send({
                message: "Chat not found",
                success: false,
            });
        }

        // 3. Verify the requesting user is a member of the chat
        const isMember = chat.members.some(
            (memberId) => memberId.toString() === userId.toString()
        );

        if (!isMember) {
            return res.status(403).send({
                message: "Access denied: You are not a member of this chat",
                success: false,
            });
        }

        // 4. Fetch all messages belonging to this chat, sorted by creation time
        const allMessages = await Message.find({ chatId }).sort({
            createdAt: 1,
        });

        // 5. Send successful response
        res.status(200).send({
            message: "All messages fetched successfully",
            success: true,
            data: allMessages,
        });
    } catch (error) {
        // 6. Handle unexpected server errors
        res.status(500).send({
            message: error.message,
            success: false,
        });
    }
}

export async function sendImageMessage(req, res) {
    try {
        const userId = req.body.userId;
        const { chatId } = req.body;

        // Validate
        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "chatId is required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file uploaded",
            });
        }

        // Upload to Cloudinary
        const uploadImage = () => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        { folder: "YegnaTalkChatImage" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    )
                    .end(req.file.buffer);
            });
        };

        const imageUrl = await uploadImage();

        // Create message with image
        const newMessage = new Message({
            chatId,
            sender: userId,
            text: "",
            image: imageUrl,
        });

        const savedMessage = await newMessage.save();

        // Update chat last message & unread count
        await Chats.findByIdAndUpdate(chatId, {
            lastMessage: savedMessage._id,
            $inc: { unreadMessageCount: 1 },
        });

        res.status(201).json({
            success: true,
            message: "Image message sent",
            data: savedMessage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

