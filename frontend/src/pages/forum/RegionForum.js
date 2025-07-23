import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import PostCard from "../../components/forum/PostCard";
import SortingOptions from "../../components/forum/SortingOptions";

const RegionForum = () => {
  const { regionId } = useParams();
  const [region, setRegion] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch region details
        const regionRes = await api.get(`/destinations/${regionId}`);
        setRegion(regionRes.data);

        // Fetch posts for this region
        const postsRes = await api.get(
          `/forum/posts/region/${regionId}?sort=${sortOption}`
        );
        setPosts(postsRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching region forum data:", err);
        setError("Failed to load region forum data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [regionId, sortOption]);

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleDelete = async (postId) => {
    try {
      setLoading(true);
      await api.delete(`/forum/posts/${postId}`);

      // Remove the deleted post from the state
      setPosts(posts.filter((post) => post._id !== postId));

      // Show success message
      setSuccess("Discussion deleted successfully");

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

      setLoading(false);
    } catch (err) {
      console.error("Error deleting discussion:", err);
      setError("Failed to delete discussion. Please try again.");
      setLoading(false);
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

  if (!region) {
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
                Region not found.{" "}
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

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <div className="flex items-center mb-2">
            <Link
              to="/forum"
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
              Back to Forum
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {region.name} Discussions
          </h1>
          <p className="text-neutral-600 mt-2">{region.country}</p>
        </div>
        {isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <Link to="/forum/my-posts" className="btn-outline-primary">
              My Discussions
            </Link>
            <Link
              to={`/forum/new-post?region=${regionId}`}
              className="btn-primary"
            >
              Create New Discussion
            </Link>
          </div>
        )}
      </div>

      {/* Success and Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>{success}</span>
          <button
            onClick={() => setSuccess(null)}
            className="text-green-700 hover:text-green-900"
          >
            <svg
              className="w-5 h-5"
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
      )}

      {/* Region Image */}
      {region.images && region.images.length > 0 && (
        <div className="mb-8 rounded-2xl overflow-hidden h-64 md:h-80">
          <img
            src={region.images[0]}
            alt={region.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Region Description */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
        <h2 className="text-xl font-semibold text-neutral-900 mb-3">
          About {region.name}
        </h2>
        <p className="text-neutral-700">{region.description}</p>
      </div>

      {/* Posts Section */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4 sm:mb-0">
            Discussions
          </h2>
          <SortingOptions
            currentSort={sortOption}
            onSortChange={handleSortChange}
          />
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-8 text-center">
            <p className="text-neutral-600 mb-4">
              No discussions yet for this region.
            </p>
            {isAuthenticated ? (
              <Link
                to={`/forum/new-post?region=${regionId}`}
                className="btn-primary"
              >
                Start the First Discussion
              </Link>
            ) : (
              <Link to="/login" className="btn-primary">
                Login to Start a Discussion
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={
                  user &&
                  post.author &&
                  (user.id === post.author._id || // Check object comparison
                    user.id === post.author) // Check string comparison
                    ? handleDelete
                    : null
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionForum;
