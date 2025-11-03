import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/dbConfig.js";
import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import chatRouter from "./routers/chatRouter.js";
import messageRouter from "./routers/messageRouter.js";
import verifyRouter from "./routers/verificationRouter.js";
dotenv.config();

// Connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());

//routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use('/api/message',messageRouter)
app.use('/api',verifyRouter)

app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
});


