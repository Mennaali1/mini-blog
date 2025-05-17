import express from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  addPost,
  deletePosts,
  getAllPosts,
  getUserPosts,
  updatePosts,
} from "./post.controller.js";
const postRouter = express.Router();

postRouter.post("/", verifyToken, addPost);
postRouter.get("/", verifyToken, getAllPosts);
postRouter.get("/:id", verifyToken, getUserPosts);
postRouter.put("/", verifyToken, updatePosts);
postRouter.delete("/", verifyToken, deletePosts);
export default postRouter;
