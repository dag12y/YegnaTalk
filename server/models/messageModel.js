import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
    },
    text: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
},{timestamps:true});

export default mongoose.model("messages", messageSchema);
