import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import MyPostCard from "../../components/forum/MyPostCard";
import SortingOptions from "../../components/forum/SortingOptions";

const MyPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/forum/my-posts" } });
      return;
    }

    // Don't try to fetch posts if user ID is not available
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log(`Fetching discussions for user ID: ${user.id}`);

        // Log the user object for debugging
        console.log("Current user object:", user);

        // First, use the debug route to find the user's posts
        console.log("Using debug route to find user posts...");
        const debugResponse = await api.get("/forum/debug/user-posts");
        console.log("Debug route response:", debugResponse.data);

        // Extract the user posts from the debug data
        const { userPosts, userPostsCount, fullUserPosts } = debugResponse.data;

        if (
          userPostsCount > 0 &&
          fullUserPosts &&
          Array.isArray(fullUserPosts)
        ) {
          // We have full post data directly from the debug route
          console.log(
            `Debug route found ${userPostsCount} posts with full data`
          );
          console.log("Full user posts from debug route:", fullUserPosts);

          // Process the posts to ensure author data is consistent
          const processedPosts = fullUserPosts.map((post) => {
            // Ensure the author field is properly formatted
            if (typeof post.author === "string") {
              post.author = {
                _id: post.author,
                name: "You (Author)",
                picture: "/images/default_profile.svg",
              };
            }

            // Force the post to be recognized as the user's
            post.isCurrentUserPost = true;

            return post;
          });

          // Set the posts
          setPosts(processedPosts);

          // Show success message with count
          if (processedPosts.length > 0) {
            // Don't show success message
            setSuccess(null);

            // Auto-hide success message after 3 seconds
            setTimeout(() => {
              setSuccess(null);
            }, 3000);
          }
        } else if (userPostsCount > 0) {
          // We have found posts using the debug route but no full data
          console.log(
            `Debug route found ${userPostsCount} posts, fetching full data`
          );

          // Get the post IDs
          const postIds = userPosts.map((post) => post.postId);
          console.log("Post IDs from debug route:", postIds);

          // Fetch all posts and filter to only include the ones we found
          const apiUrl = `/forum/posts?sort=${sortOption}`;
          console.log("API URL for all posts:", apiUrl);

          const allPostsResponse = await api.get(apiUrl);
          console.log(
            `Found ${allPostsResponse.data.length} total discussions`
          );

          if (allPostsResponse.data && Array.isArray(allPostsResponse.data)) {
            // Filter to only include the posts we found in the debug data
            const matchingPosts = allPostsResponse.data.filter((post) =>
              postIds.includes(post._id)
            );

            console.log(`Found ${matchingPosts.length} matching posts`);

            // Process the posts to ensure author data is consistent
            const processedPosts = matchingPosts.map((post) => {
              // Ensure the author field is properly formatted
              if (typeof post.author === "string") {
                post.author = {
                  _id: post.author,
                  name: "You (Author)",
                  picture: "/images/default_profile.svg",
                };
              }

              // Force the post to be recognized as the user's
              post.isCurrentUserPost = true;

              return post;
            });

            // Set the posts
            setPosts(processedPosts);

            // Show success message with count
            if (processedPosts.length > 0) {
              // Don't show success message
              setSuccess(null);

              // Auto-hide success message after 3 seconds
              setTimeout(() => {
                setSuccess(null);
              }, 3000);
            }
          } else {
            console.error("Invalid response format:", allPostsResponse.data);
            setError("Received invalid data format from server");
          }
        } else {
          // Fallback to the old method if debug route found no posts
          console.log(
            "Debug route found no posts, falling back to client-side filtering"
          );

          // Fetch all posts and filter them client-side
          const apiUrl = `/forum/posts?sort=${sortOption}`;
          console.log("Fallback API URL:", apiUrl);

          const postsRes = await api.get(apiUrl);
          console.log(`Found ${postsRes.data.length} total discussions`);

          if (postsRes.data && Array.isArray(postsRes.data)) {
            // Process the posts to ensure author data is consistent
            const processedPosts = postsRes.data.map((post) => {
              // Ensure the author field is properly formatted
              if (typeof post.author === "string") {
                post.author = {
                  _id: post.author,
                  name: "You (Author)",
                  picture: "/images/default_profile.svg",
                };
              }

              // Try multiple comparison methods
              const authorId =
                typeof post.author === "object"
                  ? String(post.author._id)
                  : String(post.author);
              const userId = String(user.id);

              // Check if this post belongs to the current user
              const isMatch = authorId === userId;

              // Add a flag to indicate if this post belongs to the current user
              post.isCurrentUserPost = isMatch;

              return post;
            });

            // Filter posts to only include those by the current user
            const userPosts = processedPosts.filter(
              (post) => post.isCurrentUserPost
            );
            console.log(
              `After filtering, found ${userPosts.length} user posts`
            );

            // Set only the user's posts
            setPosts(userPosts);

            // Show success message with count
            if (userPosts.length > 0) {
              // Don't show success message
              setSuccess(null);

              // Auto-hide success message after 3 seconds
              setTimeout(() => {
                setSuccess(null);
              }, 3000);
            }
          } else {
            console.error("Invalid response format:", postsRes.data);
            setError("Received invalid data format from server");
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching my discussions:", err);
        setError("Failed to load your discussions. Please try again later.");
        setLoading(false);
      }
    };

    // Only fetch posts when we have a valid user ID
    fetchPosts();
  }, [sortOption, isAuthenticated, navigate, user?.id]);

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Advanced debug function to check backend data and load posts
  const advancedDebug = async () => {
    try {
      setLoading(true);
      console.log("Running advanced debug...");
      const response = await api.get("/forum/debug/user-posts");
      console.log("Advanced debug response:", response.data);

      // Extract the user posts from the debug data
      const { userPosts, userPostsCount, totalPosts, fullUserPosts } =
        response.data;

      if (userPostsCount > 0 && fullUserPosts && Array.isArray(fullUserPosts)) {
        console.log("Full user posts from debug route:", fullUserPosts);

        // Process the posts to ensure author data is consistent
        const processedPosts = fullUserPosts.map((post) => {
          // Ensure the author field is properly formatted
          if (typeof post.author === "string") {
            post.author = {
              _id: post.author,
              name: "You (Author)",
              picture: "/images/default_profile.svg",
            };
          }

          // Force the post to be recognized as the user's
          post.isCurrentUserPost = true;

          return post;
        });

        // Set the posts
        setPosts(processedPosts);

        // Don't show success message
        setSuccess(null);
      } else if (userPostsCount > 0) {
        // Fallback to the old method if fullUserPosts is not available
        console.log("fullUserPosts not available, using post IDs");

        // We need to fetch the full post data for each post found
        const postIds = userPosts.map((post) => post.postId);
        console.log("Found post IDs:", postIds);

        // Fetch all posts and filter to only include the ones we found
        const allPostsResponse = await api.get(
          `/forum/posts?sort=${sortOption}`
        );
        console.log("All posts response:", allPostsResponse.data);

        if (allPostsResponse.data && Array.isArray(allPostsResponse.data)) {
          // Filter to only include the posts we found in the debug data
          const matchingPosts = allPostsResponse.data.filter((post) =>
            postIds.includes(post._id)
          );

          console.log("Matching posts:", matchingPosts);

          // Process the posts to ensure author data is consistent
          const processedPosts = matchingPosts.map((post) => {
            // Ensure the author field is properly formatted
            if (typeof post.author === "string") {
              post.author = {
                _id: post.author,
                name: "You (Author)",
                picture: "/images/default_profile.svg",
              };
            }

            // Force the post to be recognized as the user's
            post.isCurrentUserPost = true;

            return post;
          });

          // Set the posts
          setPosts(processedPosts);

          // Don't show success message
          setSuccess(null);
        } else {
          setError("Failed to fetch full post data");
        }
      } else {
        // Don't show success message
        setSuccess(null);
      }

      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 10000);

      setLoading(false);
    } catch (err) {
      console.error("Advanced debug error:", err);
      setError("Failed to fetch advanced debug data");
      setLoading(false);
    }
  };

  // Debug function to log user and posts data
  const debugData = () => {
    console.log("Current user:", user);
    console.log("Current posts:", posts);

    // Check if any posts have the current user as author using the same logic as fetchPosts
    const userPosts = posts
      .map((post) => {
        // Get author ID as string for comparison
        const authorId =
          typeof post.author === "object"
            ? String(post.author._id)
            : String(post.author);

        // Get user ID as string for comparison
        const userId = String(user.id);

        // Check if this post belongs to the current user
        const isMatch = authorId === userId;

        console.log(`Debug: Post ${post._id} author comparison:`, {
          title: post.title,
          authorId: authorId,
          userId: userId,
          authorIdType: typeof authorId,
          userIdType: typeof userId,
          isMatch: isMatch,
        });

        return {
          ...post,
          isCurrentUserPost: isMatch,
        };
      })
      .filter((post) => post.isCurrentUserPost);

    console.log(`Found ${userPosts.length} posts with current user as author`);

    // Try to fetch posts directly from the API for debugging
    const fetchDebugPosts = async () => {
      try {
        const response = await api.get(`/forum/posts?author=${user.id}`);
        console.log("Debug API response:", response.data);
        // Don't show success message
        setSuccess(null);
      } catch (err) {
        console.error("Debug API error:", err);
        setError("Failed to fetch debug data");
      }
    };

    fetchDebugPosts();

    // Auto-hide success message after 10 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 10000);
  };

  const handleRefresh = async () => {
    if (!user?.id || isRefreshing) return;

    setIsRefreshing(true);
    setError(null);
    setSuccess(null);

    try {
      console.log("Manually refreshing discussions...");
      console.log("User ID for API call:", user.id);

      // Use the debug route to find the user's posts
      console.log("Using debug route to find user posts...");
      const debugResponse = await api.get("/forum/debug/user-posts");
      console.log("Debug route response:", debugResponse.data);

      // Extract the user posts from the debug data
      const { userPosts, userPostsCount, fullUserPosts } = debugResponse.data;

      if (userPostsCount > 0 && fullUserPosts && Array.isArray(fullUserPosts)) {
        // We have full post data directly from the debug route
        console.log(`Debug route found ${userPostsCount} posts with full data`);
        console.log("Full user posts from debug route:", fullUserPosts);

        // Process the posts to ensure author data is consistent
        const processedPosts = fullUserPosts.map((post) => {
          // Ensure the author field is properly formatted
          if (typeof post.author === "string") {
            post.author = {
              _id: post.author,
              name: "You (Author)",
              picture: "/images/default_profile.svg",
            };
          }

          // Force the post to be recognized as the user's
          post.isCurrentUserPost = true;

          return post;
        });

        // Set the posts
        setPosts(processedPosts);
        console.log(`Refreshed: Found ${processedPosts.length} discussions`);
        // Don't show success message
        setSuccess(null);
      } else if (userPostsCount > 0) {
        // We have found posts using the debug route but no full data
        console.log(
          `Debug route found ${userPostsCount} posts, fetching full data`
        );

        // Get the post IDs
        const postIds = userPosts.map((post) => post.postId);
        console.log("Post IDs from debug route:", postIds);

        // Fetch all posts and filter to only include the ones we found
        const apiUrl = `/forum/posts?sort=${sortOption}`;
        console.log("API URL for all posts:", apiUrl);

        const allPostsResponse = await api.get(apiUrl);
        console.log(`Found ${allPostsResponse.data.length} total discussions`);

        if (allPostsResponse.data && Array.isArray(allPostsResponse.data)) {
          // Filter to only include the posts we found in the debug data
          const matchingPosts = allPostsResponse.data.filter((post) =>
            postIds.includes(post._id)
          );

          console.log(`Found ${matchingPosts.length} matching posts`);

          // Process the posts to ensure author data is consistent
          const processedPosts = matchingPosts.map((post) => {
            // Ensure the author field is properly formatted
            if (typeof post.author === "string") {
              post.author = {
                _id: post.author,
                name: "You (Author)",
                picture: "/images/default_profile.svg",
              };
            }

            // Force the post to be recognized as the user's
            post.isCurrentUserPost = true;

            return post;
          });

          // Set the posts
          setPosts(processedPosts);
          console.log(`Refreshed: Found ${processedPosts.length} discussions`);
          // Don't show success message
          setSuccess(null);
        } else {
          console.error("Invalid response format:", allPostsResponse.data);
          setError("Received invalid data format from server");
        }
      } else {
        // Fallback to the old method if debug route found no posts
        console.log(
          "Debug route found no posts, falling back to client-side filtering"
        );

        // Fetch all posts and filter them client-side
        const apiUrl = `/forum/posts?sort=${sortOption}`;
        console.log("Fallback API URL:", apiUrl);

        const postsRes = await api.get(apiUrl);
        console.log(`Found ${postsRes.data.length} total discussions`);

        if (postsRes.data && Array.isArray(postsRes.data)) {
          // Process the posts to ensure author data is consistent
          const processedPosts = postsRes.data.map((post) => {
            // Ensure the author field is properly formatted
            if (typeof post.author === "string") {
              post.author = {
                _id: post.author,
                name: "You (Author)",
                picture: "/images/default_profile.svg",
              };
            }

            // Try multiple comparison methods
            const authorId =
              typeof post.author === "object"
                ? String(post.author._id)
                : String(post.author);
            const userId = String(user.id);

            // Check if this post belongs to the current user
            const isMatch = authorId === userId;

            // Add a flag to indicate if this post belongs to the current user
            post.isCurrentUserPost = isMatch;

            return post;
          });

          // Filter posts to only include those by the current user
          const userPosts = processedPosts.filter(
            (post) => post.isCurrentUserPost
          );
          console.log(`After filtering, found ${userPosts.length} user posts`);

          // Set only the user's posts
          setPosts(userPosts);
          console.log(`Refreshed: Found ${userPosts.length} discussions`);
          // Don't show success message
          setSuccess(null);
        } else {
          console.error("Invalid response format:", postsRes.data);
          setError("Failed to refresh discussions. Invalid data format.");
        }
      }

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      console.error("Error refreshing discussions:", err);
      setError("Failed to refresh discussions. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (postId) => {
    // Confirmation is now handled in the MyPostCard component

    try {
      // Find the post title for better feedback
      const postToDelete = posts.find((post) => post._id === postId);
      const postTitle = postToDelete?.title || "Discussion";

      // Show loading state
      setLoading(true);
      setError(null);

      console.log(`Sending delete request for post ID: ${postId}`);

      // Send the delete request to the API
      const response = await api.delete(`/forum/posts/${postId}`);
      console.log("Delete response:", response.data);

      // Remove the deleted post from the state
      setPosts(posts.filter((post) => post._id !== postId));

      // Show success message with the post title
      setSuccess(`"${postTitle}" has been deleted successfully`);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

      setLoading(false);
    } catch (err) {
      console.error("Error deleting discussion:", err);

      // Provide more specific error messages based on the error
      if (err.response?.status === 403) {
        setError("You don't have permission to delete this discussion.");
      } else if (err.response?.status === 404) {
        setError("This discussion no longer exists.");
        // Remove it from the state if it doesn't exist on the server
        setPosts(posts.filter((post) => post._id !== postId));
      } else if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError("Failed to delete discussion. Please try again.");
      }

      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-neutral-100 rounded-2xl p-6 h-64"
              ></div>
            ))}
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
            My Discussions
          </h1>
          <p className="text-neutral-600 mt-2">
            Manage your contributions to the community
          </p>
          {posts.length > 0 && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              {posts.length} {posts.length === 1 ? "discussion" : "discussions"}{" "}
              found
            </div>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
          <SortingOptions
            currentSort={sortOption}
            onSortChange={handleSortChange}
          />
          <Link to="/forum/new-post" className="btn-primary whitespace-nowrap">
            Create New Discussion
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

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

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-8 text-center">
          <div className="flex justify-center mb-6">
            <svg
              className="w-16 h-16 text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">
            No Discussions Found
          </h3>
          <p className="text-neutral-600 mb-6">
            You haven't created any discussions yet. Start a new discussion to
            share your experiences or ask questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/forum/new-post" className="btn-primary">
              Create Your First Discussion
            </Link>
            <button
              onClick={advancedDebug}
              disabled={loading}
              className="btn-secondary flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Load Posts
                </>
              )}
            </button>
            <Link to="/forum" className="btn-outline-primary">
              Browse Existing Discussions
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <MyPostCard key={post._id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
