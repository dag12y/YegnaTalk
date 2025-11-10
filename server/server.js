import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/dbConfig.js";
import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import chatRouter from "./routers/chatRouter.js";
import messageRouter from "./routers/messageRouter.js";
import verifyRouter from "./routers/verificationRouter.js";
import { createServer } from "node:http";
import { Server } from "socket.io";

dotenv.config();

// Connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Create HTTP server from Express app
const server = createServer(app);

const io = new Server(server, {
    // instantiate socket.io server
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// Routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api", verifyRouter);

// Socket.io connection
io.on("connection", (socket) => {
    socket.on("join-room", (userId) => {
        socket.join(userId);
                
    });
    socket.on('send-message',(data)=>{
        socket.to(data.recipient).emit('receive-message',data.text)
    })

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(" Server running on port:", PORT);
});
