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
export async function uploadProfilePic(file, userId) {
    try {
        const formData = new FormData();
        formData.append("image", file); 
        formData.append("userId", userId);

        const response = await axiosInstance.post(
            "/api/user/upload-profile-pic",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
}