import express from "express";
import { addPost, getFeedPosts, likePost } from "../controllers/postController.js";
import { uplaod } from "../connfig/multer.js";
import { protect } from "../middlewares/auth.js";

const postRouter = express.Router();

postRouter.post("/add", uplaod.array('images', 4), protect, addPost);
postRouter.get("/feed", protect, getFeedPosts);
postRouter.post("/feed", protect, likePost);
export default postRouter;
