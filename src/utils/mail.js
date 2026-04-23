import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendMail = async ({ email, userId }) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    await User.findByIdAndUpdate(userId, {
      otp_token: otp,
      otp_expiry: Date.now() + 3600000,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 1 hour.`,
    };

    const mail = await transporter.sendMail(mailOptions);
    return mail;
    return true;
  } catch (error) {
    console.log("MAIL ERROR:", error.message);
    return null;
  }
};

export default sendMail;
