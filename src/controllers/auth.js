import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import sendMail from "../utils/mail.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, companyName, field } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Restrict multiple admins per company
    if (role === "admin") {
      if (!companyName) {
        return res.status(400).json({
          message: "Company name is required for admin",
        });
      }

      const existingAdmin = await User.findOne({
        role: "admin",
      });

      if (existingAdmin) {
        return res.status(400).json({
          message:
            "Only one admin account is allowed. Please contact support if you need assistance.",
        });
      }
    }

    if (role === "technician" && !field) {
      return res.status(400).json({
        message: "Field is required for technician",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      verification: false,
      otp_expiry: new Date(Date.now() + 10 * 60 * 1000),
    };

    if (role === "admin") {
      userData.companyName = companyName;
    }

    if (role === "technician") {
      userData.field = field;
      userData.isApproved = false;
    }

    if (role === "client") {
      userData.field = null;
      userData.isApproved = null;
      userData.companyName = null;
    }

    const newUser = await User.create(userData);

    const mailResult = await sendMail({ email, userId: newUser._id });

    if (!mailResult) {
      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    return res.status(201).json({
      message: `${role} registered successfully. Please check your email for OTP verification.`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Please provide email and OTP" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.otp_token !== otp) {
      return res
        .status(400)
        .json({ message: "OTP not found or invalid email" });
    }
    if (user.otp_expiry < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    user.verification = true;
    user.otp_token = null;
    user.otp_expiry = null;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.verification === false) {
      return res.status(400).json({
        message: "Please verify your email to login",
      });
    }

    if (user.isApproved === false && user.role === "technician") {
      return res.status(400).json({
        message: "Your account is pending approval from admin",
      });
    }

    const payload = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
