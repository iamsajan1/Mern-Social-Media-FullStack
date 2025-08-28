import React, { useEffect, useState } from "react";
import { assets, dummyPostsData } from "../assets/assets";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";

const Feed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchFeed = async () => {
    setFeed(dummyPostsData);
  };

  useEffect(() => {
    fetchFeed();
    setLoading(false);
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll scrollbar-none py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      {/* stories  and post*/}
      <div>
       <StoriesBar/>
        <div className="p-4 space-y-6">
          {feed.map((post)=>(
            <PostCard key={post._id} post={post}/>
          ))}
        </div>
      </div>

      {/*right sidebar*/}
      <div className="max-xl:hidden sticky top-0">
        <div className="max-w-xs bg-white text-xs p-4 rounded-md
        inline-flex flex-col gap-2 shadow">
          <h3 className="text-slate-800 font-semibold">Sponsered</h3>
          <img src={assets.sponsored_img} className="w-75 h-50 rounded-md"/>
          <p className="text-gray-600">Your Ad Here</p>
          <p className="text-slate-400">Grow your bussiness with us and make your company at the top, use our plateform 
          to reach more customers</p>
          <a href="#" className="text-blue-600 font-semibold">www.yourbussiness.com</a>
          <hr/>
          <h3 className="text-slate-800 font-semibold">Grow Bussiness Now</h3>
         
        </div>
        <div className="">
          <RecentMessages/>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
