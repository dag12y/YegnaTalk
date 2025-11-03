import express from "express";
import verifyToken from "../middleware/verifyToken.js";

const verifyRouter = express.Router();

verifyRouter.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "Access granted", user: req.user });
});

export default verifyRouter;
