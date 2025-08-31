import express from "express";
import { addUserStory, getStories } from "../controllers/storyController.js";
import { protect } from "../middlewares/auth.js";
import { uplaod } from "../connfig/multer.js";

const storyRouter = express.Router();

storyRouter.post("/create", uplaod.single('media'), protect, addUserStory);
storyRouter.get("/get",  protect, getStories);

export default storyRouter;