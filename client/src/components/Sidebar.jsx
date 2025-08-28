import React from "react";
import { assets, dummyUserData } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import { useClerk, UserButton } from "@clerk/clerk-react";
const Sidebar = ({ SidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const user=dummyUserData;
  const {signOut} = useClerk();
  return (
    <div
      className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col
        justify-between items-center max-sm:absolute top-0 bottom-0 z-20
        ${
          SidebarOpen ? "translate-x-0" : "max-sm:translate-x-full"
        } transition-all duration-300 sm:static sm:left-0 ease-in-out`}
    >
      <div className="w-full">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt=""
          className="w-26 ml-7 my-2 cursor-pointer"
        />
        <hr className="border-gray-300 mb-8" />
        <MenuItems setSidebarOpen={setSidebarOpen} />
        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 
        py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600
        hover:from-indigo-700 hover:to-purple-800
        active:scale-95 transition text-white cursor-pointer"
        >
          <CirclePlus className="h-5 w-5" />
          Create Post
        </Link>
      </div>
      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <UserButton />
          <div>
            <h1>{user.full_name}</h1>
            <p>@{user.username}</p>
          </div>
        </div>
        <LogOut onClick={signOut} className="w-4.5 text-gray-400 hover:text-gray-700 cursor-pointer transition"/>
      </div>
    </div>
  );
};

export default Sidebar;
