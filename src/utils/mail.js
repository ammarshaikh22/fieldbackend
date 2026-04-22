import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import "dotenv/config";

export const sendMail = async ({ email, userId }) => {
  try {
    const hashed = Math.round(Math.random() * 100000 + 1);

    await User.findByIdAndUpdate(userId, {
      otp_token: hashed,
      otp_expiry: Date.now() + 3600000,
    });

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: process.env.NODE_ENV === "production" ? 465 : 587,
      secure: process.env.NODE_ENV === "production" ? true : false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Email",
      html: `<p>OTP: ${hashed}</p>`,
    });

    return true;
  } catch (error) {
    console.log("MAIL ERROR:", error.message);
    return false;
  }
};
