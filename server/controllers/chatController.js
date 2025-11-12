import Chats from "./../models/chatModel.js";
import Message from './.././models/messageModel.js'
import messageModel from "./.././models/messageModel.js";
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

        // Populate members before sending response
        const populatedChat = await savedChat.populate("members");

        res.status(201).send({
            message: "New chat created successfully",
            success: true,
            data: populatedChat,
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

        const allChats = await Chats.find({ members: { $in: [userId] } })
            .populate("members")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

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

// clearing unread message count
export async function clearUnreadMessageCount(req,res) {
    try {
        const chatId=req.body.chatId;

        //update in chat collection
        const chat = await Chats.findById(chatId)
        if(!chat){
            return res.send({
                message:'No chat found with given chat id.',
                success:false
            })
        }

        const updatedChat =await Chats.findByIdAndUpdate(chatId,{unreadMessageCount:0},{new:true}).populate('members').populate('lastMessage');
        //update read property to true
        await Message.updateMany({
            chatId:chatId,
            read:false,


        },{
            read:true
        })
        
        res.status(201).send({
            message:"Unread message cleared successfully",
            success:true,
            data:updatedChat
        })
    } catch (error) {
        res.status(400).send({
            message:error.message,
            success:false
        })
    }
}