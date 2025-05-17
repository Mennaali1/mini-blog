import mongoose, { Types } from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: String,
    desc: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const postModel = mongoose.model("post", postSchema);
