import React from "react";
import { dummyConnectionsData } from "../assets/assets";
import { Eye, MessagesSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate =useNavigate();
  return (
    <div className="min-h-screen relative bg-slate-50">
      <div className="max-w-6xl mt-auto p-6">
        {/* title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600">
            Talk to your collegues and friends in private messages
          </p>
        </div>

        {/* Connected persons*/}
        <div className="flex flex-col gap-3">
          {/* map through connected persons */}
          {dummyConnectionsData.map((user) => (
            <div
              key={user.id}
              className="max-w-xl flex gap-5 p-6 bg-white rounded-md shadow"
            >
              <img src={user.profile_picture} alt="" className="rounded-full size-10 mx-auto"/>
            <div className="flex-1">
             <p className="font-medium text-slate-700">{user.full_name}</p>
             <p className="text-slate-500">@ {user.username}</p>
             <p className="text-sm text-gray-600">{user.bio}</p>
            </div>
            <div className="flex flex-col gap-2 mt-5">
          <button onClick={()=>navigate(`/messages/${user._id}`)} className="size-10 flex items-center justify-center text-sm rounded bg-slate-100
          hover:bg-slate-200 tesxt-slate-800
          active:scale-95 transition cursor-pointer gap-1">
            <MessagesSquare className="w-5 h-5" />
          </button>
          <button onClick={()=>navigate(`/profile/${user._id}`)} className="size-10 flex items-center justify-center text-sm rounded bg-slate-100
          hover:bg-slate-200 tesxt-slate-800
          active:scale-95 transition cursor-pointer ">
            <Eye
             className="w-5 h-5" />
          </button>
            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
