import { axiosInstance } from "./index";

export async function signup(user) {
    try {
        const response = await axiosInstance.post("/api/auth/signup", user);
        return response.data;
    } catch (error) {
        return error;
    }
}
