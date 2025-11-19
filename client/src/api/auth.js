import { axiosInstance } from "./index";

export async function signup(user) {
    const response = await axiosInstance.post("/api/auth/signup", user);
    return response.data;
}
export async function login(user) {
    const response = await axiosInstance.post("/api/auth/login", user);
    return response.data;
}

export async function sendOtp(email) {
    const response = await axiosInstance.post("/api/auth/send-otp", { email });
    return response.data;
}

export async function verifyOtp(email, otp) {
    const response = await axiosInstance.post("/api/auth/verify-otp", {
        email,
        otp,
    });
    return response.data;
}

