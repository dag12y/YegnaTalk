import {axiosInstance} from './index';

export async function getAllChats() {
    try {
        const response = await axiosInstance.get("/api/chat/get-all-chats");
        return response.data;
    } catch (error) {
        return error
    }
}

export async function createNewChat(members) {
    try {
        const response = await axiosInstance.post("api/chat/create-new-chat",{members});
        return response.data;
    } catch (error) {
        return error;
    }
}

export async function clearUnreadMessageCount(chatId) {
    try {
        const response = await axiosInstance.post(
            "/api/chat/clear-unread-message",
            {
                chatId, 
            }
        );
        return response.data;
    } catch (error) {
        return (
            error.response?.data || { success: false, message: error.message }
        );
    }
}
