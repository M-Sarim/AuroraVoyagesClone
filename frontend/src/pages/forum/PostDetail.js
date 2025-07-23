import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import CommentSection from "../../components/forum/CommentSection";
import LikeDislikeButtons from "../../components/forum/LikeDislikeButtons";
import PhotoGallery from "../../components/forum/PhotoGallery";
import { formatDistanceToNow } from "date-fns";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        // Fetch post details
        const postRes = await api.get(`/forum/posts/${postId}`);
        setPost(postRes.data);

        // If user is authenticated, fetch their vote on this post
        if (isAuthenticated) {
          try {
            const voteRes = await api.get(`/forum/posts/${postId}/vote`);
            setUserVote(voteRes.data.voteType);
          } catch (voteErr) {
            console.error("Error fetching user vote:", voteErr);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError("Failed to load post details. Please try again later.");
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, isAuthenticated]);

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/forum/posts/${postId}` } });
      return;
    }

    try {
      const res = await api.post(`/forum/posts/${postId}/vote`, { voteType });

      // Update post with new vote counts
      setPost({
        ...post,
        likes: res.data.likes,
        dislikes: res.data.dislikes,
        upvotes: res.data.upvotes,
        downvotes: res.data.downvotes,
      });

      // Update user's vote
      setUserVote(userVote === voteType ? null : voteType);
    } catch (err) {
      console.error("Error voting on post:", err);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/forum/posts/${postId}`);
      navigate(`/forum/region/${post.region._id}`);
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-custom py-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Post not found.{" "}
                <Link to="/forum" className="font-medium underline">
                  Return to forum home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = isAuthenticated && user && post.author._id === user.id;
  const isAdmin = isAuthenticated && user && user.role === "admin";
  const canEdit = isAuthor || isAdmin;

  return (
    <div className="container-custom py-12">
      <div className="flex items-center mb-6">
        <Link
          to={`/forum/region/${post.region._id}`}
          className="text-primary-600 hover:text-primary-700"
        >
          <svg
            className="w-5 h-5 mr-1 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to {post.region.name} Discussions
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Post Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-neutral-900">
              {post.title}
            </h1>
            <div className="flex space-x-2">
              <LikeDislikeButtons
                likes={post.likes || post.upvotes || 0}
                dislikes={post.dislikes || post.downvotes || 0}
                userVote={userVote}
                onVote={handleVote}
              />
            </div>
          </div>

          <div className="flex items-center mt-4">
            <div className="flex-shrink-0">
              <img
                src={post.author.picture || "/images/default-avatar.png"}
                alt={post.author.name}
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-900">
                {post.author.name}
              </p>
              <p className="text-xs text-neutral-500">
                Posted{" "}
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
                {post.createdAt !== post.updatedAt && " (edited)"}
              </p>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="p-6">
          <div className="prose max-w-none">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="mt-6">
              <PhotoGallery images={post.images} />
            </div>
          )}

          {/* Post Actions */}
          {canEdit && (
            <div className="mt-8 pt-4 border-t border-neutral-200">
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-3">
                  Post Management
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/forum/edit-post/${post._id}`}
                    className="inline-flex items-center px-4 py-2 border border-primary-600 text-primary-600 bg-white hover:bg-primary-50 rounded-lg font-medium transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                    Edit Post
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 bg-white hover:bg-red-50 rounded-lg font-medium transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                    Delete Post
                  </button>
                  <Link
                    to="/forum/my-posts"
                    className="inline-flex items-center px-4 py-2 border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 rounded-lg font-medium transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                    View All My Discussions
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <CommentSection
          postId={post._id}
          comments={post.comments}
          isPostClosed={post.isClosed}
        />
      </div>
    </div>
  );
};

export default PostDetail;
