import React from "react";
import {
  dummyFollowingData as following,
  dummyFollowersData as followers,
  dummyPendingConnectionsData as pendingConnections,
  dummyConnectionsData as connections,
} from "../assets/assets";
import {
  icons,
  MessagesSquare,
  UserCheck,
  UserRoundPen,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = React.useState("Followers");
  const dataArray = [
    { lable: "Followers", value: followers, icons: Users },
    { lable: "Following", value: following, icons: UserCheck },
    { lable: "pending", value: pendingConnections, icons: UserRoundPen },
    { lable: "Connections", value: connections, icons: Users },
  ];
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Connections
          </h1>
          <p className="text-slate-600">
            Manage your connections, followers and people you are following
          </p>
        </div>
        {/* Counts*/}
        <div className="mb-8  flex flex-wrap gap-5">
          {dataArray.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1  h-20 w-40
           bg-white rounded-md shadow"
            >
              <p className="text-slate-600">{item.value.length}</p>
              <p className="text-slate-600">{item.lable}</p>
            </div>
          ))}
        </div>

        {/*tab*/}
        <div
          className="inline-flex flex-wrap items-center border border-gray-200
                rounded-md p-1 bg-white shadow-sm"
        >
          {dataArray.map((tab) => (
            <button
              onClick={() => setCurrentTab(tab.lable)}
              key={tab}
              className={`flex items-center
                     px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${
                       currentTab === tab.lable
                         ? "bg-white text-black"
                         : "text-gray-500 hover:bg-slate-50 hover:text-black"
                     }`}
            >
              <tab.icons className="w-4 h-4" />
              <span className="ml-1">{tab.lable}</span>
              {tab.count !== undefined && <span>{tab.count}</span>}
            </button>
          ))}
        </div>
        {/* list */}
        <div className="flex flex-wrap gap-6 mt-6">
          {dataArray
            .find((item) => item.lable === currentTab)
            ?.value.map((user) => (
              <div
                key={user._id}
                className="w-full max-w-88 flex gap-5 p-6 bg-white
                      shadow rounded-md"
              >
                <img
                  src={user.profile_picture}
                  alt=""
                  className="rounded-full w-12 h-12
                shadow-md mx-auto"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-700">{user.full_name}</p>
                  <p className="text-slate-500">@{user.username}</p>
                  <p className="text-slate-500">{user.bio.slice(0, 30)}....</p>
                  <div className="flex max-sm:flex-col gap-2 mt-4">
                    {
                      <button
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="w-full p-2 text-sm rounded bg-gradient-to-r
                      from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700
                      active:scale-95 transition text-white cursor-pointer"
                      >
                        View Profile
                      </button>
                    }
                    {currentTab === "Following" && (
                      <button
                        className="w-full p-2 text-sm rounded bg-slate-100
                        hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer"
                      >
                        Unfollow
                      </button>
                    )}
                    {currentTab === "pending" && (
                      <button
                        className="w-full p-2 text-sm rounded bg-slate-100
                        hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer"
                      >
                        Accept
                      </button>
                    )}
                    {currentTab === "Connections" && (
                      <button
                        onClick={() => navigate(`/messages/${user._id}`)}
                        className="w-full p-2 text-sm rounded bg-slate-100
                        flex items-center justify-center gap-1
                        hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer"
                      >
                        <MessagesSquare className="w-4 h-4" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
