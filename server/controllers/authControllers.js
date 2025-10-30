import User from "./../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
    try {
        //if user exist
        const user = await User.findOne({ email: req.body.email });

        //if user exist,send error
        if (user)
            return res.status(400).send({
                message: "User already exist.",
                success: false,
            });
        // check for the password length
        if (!req.body.password || req.body.password.length < 8) {
            return res.status(400).send({
                message: "Password must be at least 8 characters long",
                success: false,
            });
        }

        //encrypt the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        //create new user and upload to db

        const newUser = new User(req.body);
        await newUser.save();

        //displaying success text
        res.status(201).send({
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

export async function login(req, res) {
    try {
        //check if user exist
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send({
                message: "user not found",
                success: false,
            });

        //check if password is correct
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid)
            return res.status(400).send({
                message: "incorrect password",
                success: false,
            });

        //if passed, assign a jwt
        const token = jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1d"});

         res.send({
             message: "user logged in.",
             success: true,
             token:token
         });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
        });
    }
}
