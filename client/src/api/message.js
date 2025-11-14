import { axiosInstance } from "./index";

export async function createNewMessage(message) {
    try {
        const response = await axiosInstance.post(
            "/api/message/new-message",
            message
        );
        return response.data;
    } catch (error) {
        return error;
    }
}

export async function getAllMessages(chatId) {
    try {
        const response = await axiosInstance.get(
            `/api/message/get-all-messages/${chatId}`
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
