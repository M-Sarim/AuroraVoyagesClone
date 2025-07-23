import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { getTotalCommentCount } from "../../utils/commentUtils";

const RecentPostsList = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <p className="text-neutral-600">
          No discussions yet. Be the first to start a conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <ul className="divide-y divide-neutral-200">
        {posts.map((post) => (
          <li key={post._id} className="hover:bg-neutral-50 transition-colors">
            <Link to={`/forum/posts/${post._id}`} className="block p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <img
                    src={post.author.picture || "/images/default-avatar.png"}
                    alt={post.author.name}
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {post.title}
                    </h3>
                    <span className="text-xs text-neutral-500">
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
                    {post.content.substring(0, 150)}
                    {post.content.length > 150 ? "..." : ""}
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-primary-600 font-medium">
                      {post.region.name}, {post.region.country}
                    </span>
                    <span className="mx-2 text-neutral-300">•</span>
                    <span className="text-neutral-500">
                      {getTotalCommentCount(post.comments)} comments
                    </span>
                    <span className="mx-2 text-neutral-300">•</span>
                    <span className="text-neutral-500">
                      {post.likes || post.upvotes || 0} likes
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200">
        <Link
          to="/forum/all-discussions"
          className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center justify-center"
        >
          View All Discussions
          <svg
            className="w-4 h-4 ml-1"
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
  );
};

export default RecentPostsList;
