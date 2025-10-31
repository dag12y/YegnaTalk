import Chats from "./../models/chatModel.js";

export async function createNewChat(req, res) {
    try {
        const chat = new Chats(req.body);
        const savedChat = await chat.save();


        res.status(201).send({
            message:"new chat created successfully",
            success:true,
            data:savedChat
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
}

export async function getAllChat(req,res) {
    try {
        //get all chat that contains the user id in the member
        const allChat = await Chats.find({members:{$in:req.body.userId}})
         res.status(201).send({
             message: "Chat fetched successfully",
             success: true,
             data: allChat,
         });

    } catch (error) {
         res.status(400).send({
             message: error.message,
             success: false,
         });
    }
}
