import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["admine", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("user", userSchema);
