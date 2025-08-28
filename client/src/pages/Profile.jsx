import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyPostsData, dummyUserData } from "../assets/assets";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import moment from "moment";
import ProfileMoadl from "../components/ProfileModal";
import ProfileModal from "../components/ProfileModal";

const Profile = () => {
  const { profilId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/*profile header section */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {/*profile cover */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {/*user info */}
          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profilId}
            setShowEdit={setShowEdit}
          />
        </div>

        {/* {tab} */}
        <div className="mt-6">
         <div className="bg-white rounded-xl shadow p-1 flex max-w-md mx-auto">
             {
              ["posts", "media", "likes"].map((tab)=>(
                <button onClick={()=>setActiveTab(tab)} key={tab} className={`flex-1 px-4 py-2 text-sm font-medium
                rounded-lg transition-colors cursor-pointer ${activeTab === tab ?"bg-indigo-600 text-white":
                  "text-gray-600 hover:text-gray-900"
                }`}>
                {tab.charAt(0) + tab.slice(1)}
                </button>
              ))
             }
         </div>
         {/* {Posts} */}
         {
          activeTab==='posts' && (
            <div className="mt-6  flex flex-col items-center gap-6">
              {posts.map((post)=>(
                <PostCard key={post._id} post={post}/>
              ))}
            </div>
          )
         }
         {/* {media} */}
         {
          activeTab==='media' && (
            <div className="flex flex-wrap mt-6 max-w-6xl">
              {posts.filter((post)=> post.image_urls.length >0
              ).map((post)=>(
                <>
                {post.image_urls.map((image, index)=>(
                  <Link target="_blank" to={image} key={index} className="relative group">
                  <img src={image}  key={index} alt="" className="w-64 aspect-video object-cover" />
                  <p className="absolute bottom-0 right-0 text-xs p-1 px-3
                  backdrop-blur-xl text-white  ">Posted{moment(post.createdAt).fromNow()}</p>
                  </Link>
                ))}
                </>
              ))
                
            }
            </div>
          )
         }
        </div>
      </div>
      {/* {edit profile modal} */}
      {showEdit && <ProfileModal setShowEdit={setShowEdit}/>}
    </div>
  ) : (
    <Loading />
  );
};
export default Profile;
