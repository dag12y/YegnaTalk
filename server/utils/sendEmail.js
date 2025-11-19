import nodemailer from "nodemailer";

export const sendOTPEmail = async (to, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Your OTP Code",
        html: `
            <h2>Your Verification Code</h2>
            <p style="font-size:24px; font-weight:bold">${otp}</p>
            <p>This code expires in 5 minutes.</p>
        `,
    });
};
