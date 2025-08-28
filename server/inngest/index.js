import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "hangout-app" });
//ingest function to save user data in database
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
let username = email_addresses[0].email_address.split("@")[0];

    // if username is available

    const user = await User.find({ username });
    if (user) {
      username = username + Math.floor(Math.random() * 10000);
    }
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      full_name: first_name + "" + last_name,
      username,
      profile_picture: image_url,
    };
    await User.create(userData);
  }
);

// update user in database 

const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
   
      const updateUserData={
        email:email_addresses[0].email_addresses,
           full_name: first_name + "" + last_name,
           profile_picture: image_url,
      }
   await User.findByIdAndUpdate(id, updateUserData)

  }
);
// Dalete user in database 

const syncUseDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } =
      event.data;
   
   await User.findByIdAndDelete(id)

  }
);
// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation,syncUserUpdation,syncUseDeletion ];
