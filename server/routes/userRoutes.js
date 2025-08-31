import express from "express";
import {
  acceptConnectionRequest,
  discoverUsers,
  followUser,
  getUserConnections,
  getUserData,
  getUserProfiles,
  sendConnectionRequest,
  unfollowUser,
  updateUserData,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { uplaod } from "../connfig/multer.js";
import { getUserRecentMessages } from "../controllers/messageController.js";

const userRouter = express.Router();

userRouter.get("/data", protect, getUserData);
userRouter.post(
  "/update",
  uplaod.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  protect,
  updateUserData
);
userRouter.post("/discover", protect, discoverUsers);
userRouter.post("/follow", protect, followUser);
userRouter.post("/unfollow", protect, unfollowUser);

userRouter.post("/connect", protect, sendConnectionRequest);
userRouter.post("/accept", protect, acceptConnectionRequest);
userRouter.post("/profiles", protect, getUserProfiles);
userRouter.get("/connections", protect, getUserConnections);
userRouter.get("/recent-messages", protect, getUserRecentMessages);
export default userRouter;
