import Message from './../models/messageModel.js'
import Chats from './../models/chatModel.js'

export async function newMessage(req,res) {
    try {
        //store the message in the db
        const newMessage = new Message(req.body);

        const savedMessage = await newMessage.save();

        //update lastmessage in chat application

        // const currentChat = await Chats.findById(req.body.chatId) 
        // currentChat.lastMessage = savedMessage._id;
        // await currentChat.save()

        const currentChat = await Chats.findOneAndUpdate({
            _id:req.body.chatId
        },{
            lastMessage:savedMessage._id,
            $inc:{unreadMessageCount:1}
        })

        res.status(201).send({
            message:"Message sent successfully",
            success:true,
            data:savedMessage
        })

    } catch (error) {
        res.status(400).send({
            message:error.message,
            success:false
        })
    }
}