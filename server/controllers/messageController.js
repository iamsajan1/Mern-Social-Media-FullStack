import fs from "fs";
import imagekit from "../connfig/imageKit.js";
import Message from "../models/Message.js";
import { json } from "stream/consumers";
//store server side event connectionn
const connections = {};

// controller function for server side event endpoint

export const sseController = (req, res) => {
  try {
    const { userId } = req.params;
    console.log("new client connected", userId);

    //set sse  header
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // add response object to connection object

    connections[userId] = res;

    // send an initial event  to the  client
    res.write("log: Connected to SSE stream\n\n");

    // Handle client disconnection
    req.on("close", () => {
      //Remove the client's response object from the connection array
      delete connections[userId];
      console.log(" Client Disconnected");
    });
  } catch (error) {
    console.error("Error in sseController:", error);
    res.status(500).end();
  }
};

//  send message

export const sendMesage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id, text } = req.body;
    const image = req.file;

    let media_url = "";
    let message_type = image ? "image" : "text";

    if (message_type === "image") {
      const fileBuffer = fs.readFileSync(image.path);

      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: image.originalname,
      });
      media_url = imagekit.url({
        path: res.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }
    const message = await Message.create({
      from_user_id: userId,
      to_user_id,
      text,
      media_url,
      message_type,
    });
    res.json({ success: true, message });

    // send message to user using sse

    const messageWithUserData = await Message.findById(message._id).populate(
      "from_user_id"
    );
    if (connections[to_user_id]) {
      connections[to_user_id].write(
        `data : ${JSON.stringify(messageWithUserData)}\n\n`
      );
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// get chat message

export const getChatMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id } = req.body;
    const messages = await Message.find({
      $or: [
        { from_user_id: userId, to_user_id },
        { from_user_id: to_user_id, to_user_id: userId },
      ],
    }).sort({ createdAt: -1 });
    await Message.updateMany(
      {
        from_user_id: to_user_id,
        to_user_id: userId,
      },
      { seen: true }
    );
    return res.json({ success: true, messages });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// get user recent message

export const getUserRecentMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const messages = await Message.find(
      {
        to_user_id: userId,
      }.populate("from_user_id to_user_id")
    ).sort({ createdAt: -1 });
    return res.json({ success: true, messages });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
