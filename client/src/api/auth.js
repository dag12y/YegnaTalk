import { axiosInstance } from "./index";

export async function signup(user) {
    const response = await axiosInstance.post("/api/auth/signup", user);
    return response.data;
}
export async function login(user) {
    const response = await axiosInstance.post("/api/auth/login", user);
    return response.data;
}
