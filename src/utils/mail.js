import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (email, userId) => {
  try {
    // OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000);

    // DB update
    await User.findByIdAndUpdate(userId, {
      otp_token: otp,
      otp_expiry: Date.now() + 3600000, // 1 hour
    });

    // transporter (Gmail SMTP)
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
      subject: "Verify Email OTP",
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    };

    const mail = await transporter.sendMail(mailOptions);

    return mail;
  } catch (error) {
    console.log("MAIL ERROR:", error.message);
    return null;
  }
};

export default sendMail;