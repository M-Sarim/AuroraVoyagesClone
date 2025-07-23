import React from "react";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as HandThumbUpSolidIcon,
  HandThumbDownIcon as HandThumbDownSolidIcon,
} from "@heroicons/react/24/solid";

const LikeDislikeButtons = ({
  likes,
  dislikes,
  userVote,
  onVote,
  orientation = "horizontal",
  size = "medium",
}) => {
  const isVertical = orientation === "vertical";

  // Determine button sizes based on the size prop
  const buttonSizeClasses = {
    small: isVertical ? "w-8 h-8" : "w-7 h-7",
    medium: isVertical ? "w-10 h-10" : "w-8 h-8",
    large: isVertical ? "w-12 h-12" : "w-10 h-10",
  };

  const iconSizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  };

  const textSizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  const buttonSize = buttonSizeClasses[size] || buttonSizeClasses.medium;
  const iconSize = iconSizeClasses[size] || iconSizeClasses.medium;
  const textSize = textSizeClasses[size] || textSizeClasses.medium;

  return (
    <div
      className={`flex ${
        isVertical ? "flex-col" : "flex-row"
      } items-center gap-2`}
    >
      {/* Like Button */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => onVote("like")}
          className={`flex items-center justify-center ${buttonSize} rounded-full ${
            userVote === "like"
              ? "bg-primary-100 text-primary-600"
              : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
          } transition-colors`}
          aria-label="Like"
        >
          {userVote === "like" ? (
            <HandThumbUpSolidIcon className={iconSize} />
          ) : (
            <HandThumbUpIcon className={iconSize} />
          )}
        </button>
        <span className={`${textSize} font-medium text-neutral-600 mt-1`}>
          {likes}
        </span>
      </div>

      {/* Dislike Button */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => onVote("dislike")}
          className={`flex items-center justify-center ${buttonSize} rounded-full ${
            userVote === "dislike"
              ? "bg-red-100 text-red-600"
              : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
          } transition-colors`}
          aria-label="Dislike"
        >
          {userVote === "dislike" ? (
            <HandThumbDownSolidIcon className={iconSize} />
          ) : (
            <HandThumbDownIcon className={iconSize} />
          )}
        </button>
        <span className={`${textSize} font-medium text-neutral-600 mt-1`}>
          {dislikes}
        </span>
      </div>
    </div>
  );
};

export default LikeDislikeButtons;
