import express from "express";
import {
    getLoggedUser,
    getAllUsers,
    uploadProfilePic,
} from "../controllers/userControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const userRouter = express.Router();

// Configure Multer with memory storage and file size limit
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, 
});

userRouter.get("/get-logged-user", authMiddleware, getLoggedUser);
userRouter.get("/get-all-users", authMiddleware, getAllUsers);
userRouter.post(
    "/upload-profile-pic",
    authMiddleware,
    upload.single("image"),
    uploadProfilePic
);

export default userRouter;
