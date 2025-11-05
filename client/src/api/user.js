import {axiosInstance} from './index.js'

export async function getLoggedUser() {
    try {
        const response = await axiosInstance.get("/api/user/get-logged-user");
        return response.data
    } catch (error) {
        return error
    }
    
}

export async function getAllUsers() {
    try {
        const response = await axiosInstance.get("/api/user/get-all-users");
        return response.data;
    } catch (error) {
        return error;
    }
}