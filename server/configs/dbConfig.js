import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("DB connected successfully");
    } catch (error) {
        console.error("DB connection failed:", error);
        
    }
};

export default connectDB;
