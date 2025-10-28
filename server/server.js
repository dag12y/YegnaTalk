import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";
dotenv.config();

// Connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
});
