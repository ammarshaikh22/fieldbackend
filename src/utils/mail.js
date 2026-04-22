import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import 'dotenv/config'
import User from "../models/user.model.js";
const sendMail = async ({
    email,
    userId,
}) => {
    try {
        const hashed = Math.round(Math.random() * 100000 + 1)
        const hashedPassword = await bcrypt.hash(userId, 10)
            await User.findOneAndUpdate(
                { _id: userId },
                { verifyToken: hashed, verifyTokenExpiry: Date.now() + 3600000 }
            );

        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const verifyHtml = `<p>token: ${hashed}</p>`;

        const mailOptions = {
            from: "ammarshaikh50099@gmail.com",
            to: email,
            subject: "Verify Email",
            html: `<p>Click the link below to verify your email:</p> ${verifyHtml}`,
        };
        const mail = await transport.sendMail(mailOptions);
        return mail;
    } catch (error) {
        console.log(error.message);
    }
};
export default sendMail;
