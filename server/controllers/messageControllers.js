import Message from "./../models/messageModel.js";
import Chats from "./../models/chatModel.js";

export async function newMessage(req, res) {
    try {
        //create and store the message in the db
        const newMessage = new Message(req.body);

        const savedMessage = await newMessage.save();

        //update lastmessage in chat application

        // const currentChat = await Chats.findById(req.body.chatId)
        // currentChat.lastMessage = savedMessage._id;
        // await currentChat.save()

        const currentChat = await Chats.findOneAndUpdate(
            {
                _id: req.body.chatId,
            },
            {
                lastMessage: savedMessage._id,
                $inc: { unreadMessageCount: 1 },
            }
        );

        res.status(201).send({
            message: "Message sent successfully",
            success: true,
            data: savedMessage,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
}

export async function getAllMessages(req, res) {
    try {
        //get user id
        const userId = req.body.userId
        const chatId =req.params.chatId

        //check if it exists

        const allMessages = await Message.find({
            chatId: chatId,
        }).sort({ createdAt: 1 });


        const chat = await Chats.findById(req.params.chatId);

        if (!chat) {
            return res.status(404).send({
                message: "Chat not found",
                success: false,
            });
        }

        // making sure the user is a member of this chat
        const isMember = chat.members.some(
            (memberId) => memberId.toString() === req.body.userId.toString()
        );

        if (!isMember) {
            return res.status(403).send({
                message: "Access denied: You are not a member of this chat",
                success: false,
            });
        }



        res.status(200).send({
            message: "all message fetched successfully",
            success: true,
            data: allMessages,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
}
