import Chats from "./../models/chatModel.js";
import User from "./../models/userModel.js";

// Create a new chat
export async function createNewChat(req, res) {
    try {
        const userId = req.body.userId; // from JWT middleware
        const { members } = req.body; // array of user IDs

        // Validate input
        if (!members || !Array.isArray(members) || members.length === 0) {
            return res.status(400).send({
                message: "Members array is required",
                success: false,
            });
        }

        // Ensure logged-in user is part of the chat
        if (!members.includes(userId)) {
            return res.status(403).send({
                message: "You must be included as a member of the chat",
                success: false,
            });
        }

        // Prevent duplicate one-to-one chats
        if (members.length === 2) {
            const existingChat = await Chats.findOne({
                members: { $all: members, $size: 2 },
            });
            if (existingChat) {
                return res.status(200).send({
                    message: "Chat already exists",
                    success: true,
                    data: existingChat,
                });
            }
        }

        // Create new chat
        const chat = new Chats({ members });
        const savedChat = await chat.save();

        res.status(201).send({
            message: "New chat created successfully",
            success: true,
            data: savedChat,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
        });
    }
}

// Get all chats for the logged-in user
export async function getAllChat(req, res) {
    try {
        const userId = req.body.userId; // from JWT middleware

        const allChats = await Chats.find({ members: { $in: [userId] } }).populate('members').sort({updatedAt:-1});
            
        res.status(200).send({
            message: "Chats fetched successfully",
            success: true,
            data: allChats,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
        });
    }
}
