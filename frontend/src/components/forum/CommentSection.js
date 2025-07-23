import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import LikeDislikeButtons from "./LikeDislikeButtons";
import FileUploader from "../uploads/FileUploader";
import { formatDistanceToNow } from "date-fns";
import { getTotalCommentCount } from "../../utils/commentUtils";

const CommentSection = ({
  postId,
  comments: initialComments,
  isPostClosed,
}) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [commentImages, setCommentImages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  useEffect(() => {
    // Fetch user's votes on comments if authenticated
    const fetchUserVotes = async () => {
      if (!isAuthenticated || !comments.length) return;

      try {
        const votes = {};

        // This would be more efficient with a batch API endpoint
        // For now, we'll fetch votes for each comment
        for (const comment of comments) {
          try {
            const res = await api.get(`/forum/comments/${comment._id}/vote`);
            if (res.data.voteType) {
              votes[comment._id] = res.data.voteType;
            }
          } catch (err) {
            console.error(
              `Error fetching vote for comment ${comment._id}:`,
              err
            );
          }
        }

        setUserVotes(votes);
      } catch (err) {
        console.error("Error fetching user votes:", err);
      }
    };

    fetchUserVotes();
  }, [isAuthenticated, comments]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleUploadSuccess = (data) => {
    const uploadedFiles = data.files || [data.file];
    const fileUrls = uploadedFiles.map((file) => file.url);

    setCommentImages((prev) => [...prev, ...fileUrls]);
  };

  const handleRemoveImage = (index) => {
    setCommentImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/forum/posts/${postId}` } });
      return;
    }

    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const commentData = {
        content: newComment,
        images: commentImages,
        parentComment: replyingTo,
      };

      const res = await api.post(
        `/forum/posts/${postId}/comments`,
        commentData
      );

      // Add the new comment to the list
      if (replyingTo) {
        // If it's a reply, add it to the parent comment's replies
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === replyingTo
              ? { ...comment, replies: [...(comment.replies || []), res.data] }
              : comment
          )
        );
      } else {
        // Otherwise add it to the main comments list
        setComments((prev) => [...prev, res.data]);
      }

      // Reset form
      setNewComment("");
      setCommentImages([]);
      setReplyingTo(null);
      setSubmitting(false);
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Failed to submit comment. Please try again.");
      setSubmitting(false);
    }
  };

  const handleVote = async (commentId, voteType) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/forum/posts/${postId}` } });
      return;
    }

    try {
      const res = await api.post(`/forum/comments/${commentId}/vote`, {
        voteType,
      });

      // Update comment with new vote counts
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: res.data.likes,
                dislikes: res.data.dislikes,
                upvotes: res.data.upvotes,
                downvotes: res.data.downvotes,
              }
            : comment
        )
      );

      // Update user's vote
      setUserVotes((prev) => ({
        ...prev,
        [commentId]: prev[commentId] === voteType ? null : voteType,
      }));
    } catch (err) {
      console.error("Error voting on comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this comment? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/forum/comments/${commentId}`);

      // Remove the comment from the list
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Failed to delete comment. Please try again.");
    }
  };

  const renderComment = (comment, isReply = false) => {
    const isAuthor = isAuthenticated && user && comment.author._id === user.id;
    const isAdmin = isAuthenticated && user && user.role === "admin";
    const canDelete = isAuthor || isAdmin;

    return (
      <div
        key={comment._id}
        className={`${
          isReply ? "ml-12 mt-4" : "border-t border-neutral-200 py-6"
        }`}
      >
        <div className="flex">
          <div className="flex-shrink-0 mr-4">
            <img
              src={comment.author.picture || "/images/default-avatar.png"}
              alt={comment.author.name}
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {comment.author.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                  {comment.createdAt !== comment.updatedAt && " (edited)"}
                </p>
              </div>
              <LikeDislikeButtons
                likes={comment.likes || comment.upvotes || 0}
                dislikes={comment.dislikes || comment.downvotes || 0}
                userVote={userVotes[comment._id]}
                onVote={(voteType) => handleVote(comment._id, voteType)}
                size="small"
              />
            </div>
            <div className="mt-2 text-sm text-neutral-700 space-y-4">
              {comment.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Comment Images */}
            {comment.images && comment.images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {comment.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Comment attachment ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            <div className="mt-3 flex space-x-4 text-sm">
              {!isPostClosed && isAuthenticated && (
                <button
                  onClick={() => setReplyingTo(comment._id)}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Reply
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              )}
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-4">
                {comment.replies.map((reply) => renderComment(reply, true))}
              </div>
            )}

            {/* Reply Form */}
            {replyingTo === comment._id && (
              <div className="mt-4">
                <form onSubmit={handleSubmitComment}>
                  <div className="border border-neutral-300 rounded-xl overflow-hidden focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">
                    <textarea
                      value={newComment}
                      onChange={handleCommentChange}
                      placeholder="Write a reply..."
                      className="block w-full border-0 py-3 px-4 resize-none focus:ring-0 sm:text-sm"
                      rows="3"
                    ></textarea>

                    {/* Image Previews */}
                    {commentImages.length > 0 && (
                      <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200">
                        <div className="flex flex-wrap gap-2">
                          {commentImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Upload ${index + 1}`}
                                className="h-16 w-16 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
                      <div>
                        <FileUploader
                          onUploadSuccess={handleUploadSuccess}
                          onUploadError={(err) =>
                            setError(
                              "Failed to upload images. Please try again."
                            )
                          }
                          maxFiles={3}
                          maxSize={2}
                          acceptedTypes="image/*"
                          uploadEndpoint="/uploads/multiple"
                          multiple={true}
                          buttonLabel={
                            <svg
                              className="w-5 h-5 text-neutral-500 hover:text-neutral-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                          }
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setNewComment("");
                            setCommentImages([]);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-neutral-300 text-sm font-medium rounded-lg text-neutral-700 bg-white hover:bg-neutral-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting || !newComment.trim()}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                        >
                          {submitting ? "Posting..." : "Post Reply"}
                        </button>
                      </div>
                    </div>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Calculate total comment count including replies
  const totalCommentCount = getTotalCommentCount(comments);

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-neutral-900">
          Comments ({totalCommentCount})
        </h2>

        {/* New Comment Form */}
        {!isPostClosed ? (
          isAuthenticated ? (
            <div className="mt-6">
              <form onSubmit={handleSubmitComment}>
                <div className="border border-neutral-300 rounded-xl overflow-hidden focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">
                  <textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Write a comment..."
                    className="block w-full border-0 py-3 px-4 resize-none focus:ring-0 sm:text-sm"
                    rows="4"
                  ></textarea>

                  {/* Image Previews */}
                  {commentImages.length > 0 && (
                    <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200">
                      <div className="flex flex-wrap gap-2">
                        {commentImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="h-16 w-16 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
                    <div>
                      <FileUploader
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={(err) =>
                          setError("Failed to upload images. Please try again.")
                        }
                        maxFiles={3}
                        maxSize={2}
                        acceptedTypes="image/*"
                        uploadEndpoint="/uploads/multiple"
                        multiple={true}
                        buttonLabel={
                          <svg
                            className="w-5 h-5 text-neutral-500 hover:text-neutral-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                        }
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                    >
                      {submitting ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </form>
            </div>
          ) : (
            <div className="mt-6 bg-neutral-50 rounded-xl p-4 text-center">
              <p className="text-neutral-600">
                <Link to="/login" className="text-primary-600 font-medium">
                  Sign in
                </Link>{" "}
                to join the conversation
              </p>
            </div>
          )
        ) : (
          <div className="mt-6 bg-yellow-50 rounded-xl p-4 text-center">
            <p className="text-yellow-700">
              This discussion has been closed and no longer accepts new comments
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="mt-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div>{comments.map((comment) => renderComment(comment))}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
