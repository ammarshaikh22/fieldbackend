import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "technician", "client"],
      default: "client",
    },

    // for admin
    companyName: {
      type: String,
      default: null,
    },

    // for Technician
    field: {
      type: String,
      default: null,
    },

    // Technician approval system
    isApproved: {
      type: Boolean,
      default: false,
    },
    otp_expiry: Date,
    otp_token: String,
    verification: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
