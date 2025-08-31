import express from "express";
import { getChatMessages, sendMesage, sseController } from "../controllers/messageController.js";
import { protect } from "../middlewares/auth.js";
import { uplaod } from "../connfig/multer.js";

const messageRouter = express.Router();
messageRouter.get("/:userId", protect, sseController);
messageRouter.get("/get", protect, getChatMessages);
messageRouter.post("/send", uplaod.single('images'), protect, sendMesage);


export default messageRouter;