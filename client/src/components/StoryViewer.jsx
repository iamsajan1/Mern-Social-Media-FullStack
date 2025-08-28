import { BadgeCheck, X } from "lucide-react";
import React from "react";

const StoryViewer = ({ viewStory, setViewStory }) => {
  const [progress, setProgress] = React.useState(0);
  
  React.useEffect(() => {
    let progressInterval, timer;
    if (viewStory && viewStory.media_type !== "video") {
      setProgress(0);
      const duration = 10000;
      const settime = 100;
      let elapsed = 0;
      progressInterval = setInterval(() => {
        elapsed += settime;
        setProgress((elapsed / duration) * 100);
      }, settime);
      timer = setTimeout(() => {
        setViewStory(null);
      }, duration);
    }
    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [viewStory, setViewStory]);

  const handleClose = () => {
    setViewStory(null);
  };
  if (!viewStory) return null;
  const renderStoryContent = () => {
    switch (viewStory?.media_type) {
      case "image":
        return (
          <img
            src={viewStory.media_url}
            alt="story"
            className="max-w-full max-h-screen object-contain"
          />
        );
      case "video":
        return (
          <video
            onEnded={handleClose}
            src={viewStory.media_url}
            className="max-w-full max-h-screen"
            autoPlay
            controls
          />
        );
      case "text":
        return (
          <div
            className="p-6 sm:p-10 rounded max-w-screen max-h-full overflow-auto text-white"
            style={{ color: viewStory.text_color }}
          >
            <p className="whitespace-pre-wrap text-lg sm:text-2xl">
              {viewStory.content}
            </p>
          </div>
        );

        break;

      default:
        break;
    }
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-110 h-screen
    "
      style={{
        backgroundColor:
          viewStory?.media_type === "text"
            ? viewStory.background_color
            : "#000000",
      }}
    >
      {/* Progress bar*/}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
        <div
          className="h-full bg-white transition-all duration-100 linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {/* User Infor  */}
      <div
        className="absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 py-2 
      sm:p-4 sm:px-8 backdrop-blur-3xl rounded bg-black/50"
      >
        <img
          src={viewStory.user?.profile_picture}
          alt=""
          className="size-7 sm:size-8 rounded-full
        object-cover border border-white"
        />
        <div className="text-white flex items-center gap-1.5 font-medium">
          <span>{viewStory.user?.full_name}</span>
          <BadgeCheck size={18} />
        </div>
      </div>
      <button onClick={handleClose}>
        <X size={30} className="absolute top-4 right-4 text-white" />
      </button>
      {/* Story Content */}
      <div className="max-w-[90vh] max-h-[90vh] flex items-center justify-center">
        {renderStoryContent()}
      </div>
    </div>
  );
};

export default StoryViewer;
