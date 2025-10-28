import User from "./../models/userModel.js";
import bcrypt from "bcryptjs";

export async function signup(req, res) {
    try {
        //if user exist
        const user = await User.findOne({ email: req.body.email });

        //if user exist,send error
        if (user)
            return res.send({
                message: "User already exist.",
                success: false,
            });

        //encrypt the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        //create new user and upload to db

        const newUser = new User(req.body);
        await newUser.save();

        //displaying success text
        res.send({
            message: "User created successfully",
            success: true,
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
        });
    }
}
