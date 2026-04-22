import { Resend } from "resend";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ email, userId }) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    await User.findByIdAndUpdate(userId, {
      otp_token: otp,
      otp_expiry: Date.now() + 3600000,
    });

    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // testing sender
      to: email,
      subject: "Verify Email",
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    });

    return response;
  } catch (error) {
    console.log("MAIL ERROR:", error.message);
    return null;
  }
};

export default sendMail;