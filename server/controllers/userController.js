// get user


import imagekit from "../connfig/imageKit.js";
import { inngest } from "../inngest/index.js";
import Connection from "../models/Connection.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import fs from "fs";

export const getUserData = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: error.message });
  }
};

// update userData

export const updateUserData = async (req, res) => {
  try {
    const { userId } = await req.auth();
    let { username, bio, location, full_name } = req.body;

    const tempUser = await User.findById(userId);
    !username && (username = tempUser.username);
    if (tempUser.username !== username) {
      const user = await User.findOne({ username });
      if (user) {
        // we will not set the user name if it si already take
        username = tempUser.username;
      }
    }

    const updateUserData = {
      username,
      bio,
      location,
      full_name,
    };
    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          {
            quality: "auto",
          },
          { format: "webp" },
          { width: "512" },
        ],
      });
      updateUserData.profile_picture = url;
    }
    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: cover.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          {
            quality: "auto",
          },
          { format: "webp" },
          { width: "1280" },
        ],
      });
      updateUserData.cover_photo = url;
    }
    const user = await User.findByIdAndUpdate(userId, updateUserData, {
      new: true,
    });
    res.json({ success: true, user, message: "profile updated successfully" });
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: error.message });
  }
};

// find user

export const discoverUsers = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { input } = req.body;
    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { userlocationname: new RegExp(input, "i") },
      ],
    });
    const filteredUsers = allUsers.filter((user) => user._id !== userId);
    return res.json({ success: true, users: filteredUsers });
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: error.message });
  }
};

// follow users
export const followUser = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body;
    const user = await User.findById(userId);
    if (user.following.includes(id)) {
      return res.json({
        success: false,
        message: "already following this user",
      });
    }
    user.following.push(id);
    await User.save();

    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();

    return res.json({
      success: true,
      message: "now you are following this user",
    });
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: error.message });
  }
};

//unFolow user
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body;
    const user = await User.findById(userId);
    user.following = user.following.filter((user) => user !== id);
    await User.save();

    const toUser = await User.findById(id);
    toUser.following = toUser.following.filter((user) => user !== id);
    await toUser.save();

    return res.json({ success: true, message: "Unfollowed SuccessFully" });
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: error.message });
  }
};

//sent connection request

export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;
    // check to allow user sent only20 req in 24 h
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectioRequest = await Connection.find({
      from_user_id: userId,
      created_at: { $gt: last24Hours },
    });
    if (connectioRequest.length >= 20) {
      return res.json({ success: false, message: "limit reached" });
    }
    //check user is  already connected

    const connection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });
    if (!connection) {
      const newConnection=await Connection.create({
        from_user_id: userId,
        to_user_id: id,
      });
      await inngest.send({
        name:'app/connection-request',
        data:{connectionId: newConnection._id}
      })
      return res.json({ success: true, message: "sent successfully" });
    } else if (connection && connection.status === "accepted") {
      return res.json({ success: false, message: "already Connected" });
    }
    return res.json({ success: false, message: "connection request pending" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// get user conection

export const getUserConnections = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const user = await User.findById(userId).populate(
      "connections followers following"
    );
    const connections = user.collection;
    const followers = user.followers;
    const following = user.following;
    const pendingConnections = (
      await Connection.find({ to_user_id: userId, status: "pending" }).populate(
        "from_user_id"
      )
    ).map((connection) => connection.from_user_id);
    res.json({
      success: true,
      connections,
      followers,
      following,
      pendingConnections,
    });
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: error.message });
  }
};

// for accepting the connection request

export const acceptConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;
    const connection = await Connection.findOne({
      from_user_id: id,
      to_user_id: userId,
    });
    if (!connection) {
      return res.json({ success: false, message: "connection not found" });
    }

    const user = await User.findById(userId);
    user.connections.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.connections.push(userId);
    await toUser.save();

    connection.status = "accepted";
    await connection.save();

    res.json({
      success: true,
      message: "Connection Reqquest accepted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: error.message });
  }
};

//get user profile for others

export const getUserProfiles = async (req, res) => {
  try {
   const {profileId}=req.body;
   const profile =await User.findById(profileId);
   if(!profile){
    return res.json({success:false, message:"profile not found"});

   }
   const posts= await Post.find({
    user:profileId
   }).populate('user')
   res.json({success:true, profile, posts})
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: error.message });
  }
};
