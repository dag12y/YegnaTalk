import User from "./../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP } from "../utils/otpGenerator.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

let otpStore = {}; // Use DB in production
let verifiedEmails = {}; 



export async function signup(req, res) {
    try {
        const { email, password } = req.body;

        // Check if email was verified
        if (!verifiedEmails[email]) {
            return res.status(400).send({
                message: "Please verify your email before signing up.",
                success: false,
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send({
                message: "User already exists.",
                success: false,
            });
        }

        // Validate password
        if (!password || password.length < 8) {
            return res.status(400).send({
                message: "Password must be at least 8 characters long",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            ...req.body,
            password: hashedPassword,
        });

        await newUser.save();

        // Remove email from verified list after signup
        delete verifiedEmails[email];

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
        const user = await User.findOne({ email: req.body.email }).select("+password");
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

export const sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const otp = generateOTP();

        otpStore[email] = {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        };

        await sendOTPEmail(email, otp);

        res.json({ success: true, message: "OTP sent to email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

export const verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    const stored = otpStore[email];

    if (!stored) {
        return res.json({ success: false, message: "OTP not found" });
    }

    if (Date.now() > stored.expiresAt) {
        delete otpStore[email];
        return res.json({ success: false, message: "OTP expired" });
    }

    if (stored.otp !== otp) {
        return res.json({ success: false, message: "Incorrect OTP" });
    }

    // mark email as verified
    verifiedEmails[email] = true;

    delete otpStore[email];

    res.json({ success: true, message: "Email verified successfully" });
};


