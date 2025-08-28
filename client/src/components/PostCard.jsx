import React from "react";
import moment from "moment";
import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import { dummyUserData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
const PostCard = ({ post }) => {

  const navigate=useNavigate();
    const[likes,setLikes]=React.useState(post.likes_count);
    const currentUser=dummyUserData
  const postWithHashtags = post.content.replace(
    /#(\w+)/g,
    '<span class="text-blue-500">#$1</span>'
  );
  const handleLike=async()=>{}
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
      {/* User info */}
      <div className="flex items-center  cursor-pointer " onClick={()=>navigate(`/profile/${post.user._id}`)} >
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-10 h-10 rounded-full
            inline-block mr-2 shadow"
        />
        <div>
          <div>
            <span>{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 inline-block text-blue-500 ml-1" />
          </div>
          <div className="">
            @{post.user.username} ● {""}
            {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>
      {/* Post content */}
      <div>
        {post.content && (
          <div
            className="text-gray-800 text-sm whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: postWithHashtags }}
          />
        )}
      </div>
      {/* Post image */}
      <div className="grid grid-cols-2 gap-2">
        {post.image_urls.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            className={`w-full h-48 object-cover rounded-lg       ${
              post.image_urls.length === 1 ? "col-span-2 h-auto" : ""
            }`}
          />
        ))}
      </div>
      {/* Post actions */
      }
      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
         
         <div className="flex items-center gap-1">
            <Heart onClick={handleLike} className={`w-4 h-4 cursor-pointer 
                ${likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} />
            <span className="ml-1">{likes.length}</span>
         </div>
         <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4 gap-1" />
            <span className="ml-1">{12}</span>
         </div>
         <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4 gap-1" />
            <span className="ml-1">{7}</span>
         </div>
      </div>
    </div>
  );
};

export default PostCard;
