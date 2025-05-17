import { postModel } from "../../database/models/post.model.js";
export const addPost = async (req, res) => {
  const { title, desc, createdBy } = req.body;

  await postModel.insertMany({ title, desc, createdBy: req.userID });
  res.json({ message: "post added", createdBy });
};
export const getAllPosts = async (req, res) => {
  let posts = await postModel.find().populate("createdBy", "name -_id");
  res.json({ message: "success", posts });
};
export const getUserPosts = async (req, res) => {
  const { id } = req.params;
  let posts = await postModel
    .find({ createdBy: id })
    .populate("createdBy", "name");
  res.json({ message: "success", posts });
};
export const updatePosts = async (req, res) => {
  const { _id, title, desc } = req.body;
  let post = await postModel.findByIdAndUpdate(
    { _id },
    { title, desc },
    //true returns post after update
    { new: true }
  );
  if (post) {
    res.json({ message: "success update", post });
  } else {
    res.json({ message: "post not found" });
  }
};
export const deletePosts = async (req, res) => {
  const { _id } = req.body;
  let post = await postModel.findByIdAndDelete({ _id });

  if (post) {
    res.json({ message: "post deleted successfully", post });
  } else {
    res.json({ message: "post not found" });
  }
};
