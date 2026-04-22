import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import "dotenv/config";
const sendMail = async ({ email, userId }) => {
  try {
    const hashed = Math.round(Math.random() * 100000 + 1);
    const hashedPassword = await bcrypt.hash(userId, 10);

    await User.findOneAndUpdate(
      { _id: userId },
      { otp_token: hashed, otp_expiry: Date.now() + 3600000 },
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

    const verifyHtml = `<p><p>token: ${hashed}</p>`;

    const mailOptions = {
      from: "ammarshaikh50099@gmail.com",
      to: email,
      subject: "Verify Email",
      html: `<p> click to verify your email + ${verifyHtml}</p>`,
    };
    const mail = await transport.sendMail(mailOptions);
    return mail;
  } catch (error) {
    console.log(error.message);
  }
};
export default sendMail;
