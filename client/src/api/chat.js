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