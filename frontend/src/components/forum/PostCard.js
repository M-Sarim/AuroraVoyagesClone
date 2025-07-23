import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { getTotalCommentCount } from "../../utils/commentUtils";
import { useAuth } from "../../context/AuthContext";
import { getConsistentDefaultImage } from "../../utils/imageHelper";

const PostCard = ({ post, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();

  // Check if the current user is the author of this post
  const isUserPost =
    user &&
    post.author &&
    (user.id === post.author._id || // Check string comparison
      user.id === post.author); // Check direct ID comparison

  // Handle delete action
  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this discussion? This action cannot be undone."
      )
    ) {
      if (onDelete) {
        onDelete(post._id);
      }
    }
  };

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  // Get image for the post
  const hasImages = post.images && post.images.length > 0 && !imageError;

  // Get the image to display
  const displayImage = hasImages
    ? post.images[0]
    : getConsistentDefaultImage(post.title);

  // Get region name if available
  const regionName = post.region?.name || "General";

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Post Header with Title and Region */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <Link to={`/forum/posts/${post._id}`} className="block">
              <h3 className="text-xl font-semibold text-neutral-900 hover:text-primary-600 transition-colors">
                {post.title}
              </h3>
            </Link>
            {isUserPost && (
              <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Your Discussion
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Link
              to={post.region ? `/forum/region/${post.region._id}` : "/forum"}
              className="ml-2 flex-shrink-0 bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-primary-100 transition-colors"
            >
              {regionName}
            </Link>
            {isUserPost && (
              <div className="flex gap-2">
                <Link
                  to={`/forum/edit-post/${post._id}`}
                  className="ml-2 flex-shrink-0 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors"
                >
                  Edit
                </Link>
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="flex-shrink-0 bg-red-50 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Post Content */}
          <div className="flex-1">
            {/* Author Info */}
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <img
                  src={post.author?.picture || "/images/default_profile.svg"}
                  alt={post.author?.name || "User"}
                  className="h-10 w-10 rounded-full border border-neutral-200"
                  onError={(e) => {
                    e.target.src = "/images/default_profile.svg";
                  }}
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">
                  {post.author?.name || "Anonymous"}
                </p>
                <p className="text-xs text-neutral-500">{formattedDate}</p>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-neutral-600 line-clamp-3 mb-4">
              {post.content?.substring(0, 180)}
              {post.content?.length > 180 ? "..." : ""}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Stats */}
            <div className="flex items-center space-x-4 text-sm text-neutral-600">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                {post.views || 0} views
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  ></path>
                </svg>
                {post.likes || post.upvotes || 0} likes
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2"
                  ></path>
                </svg>
                {post.dislikes || post.downvotes || 0} dislikes
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  ></path>
                </svg>
                {getTotalCommentCount(post.comments)} comments
              </div>
            </div>
          </div>

          {/* Post Image */}
          <div className="md:w-1/3 flex-shrink-0 order-first md:order-last">
            <div className="h-48 md:h-full rounded-lg overflow-hidden">
              <img
                src={displayImage}
                alt={post.title || "Post image"}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          </div>
        </div>

        {/* Read More Link */}
        <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-end">
          <Link
            to={`/forum/posts/${post._id}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Read More
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
