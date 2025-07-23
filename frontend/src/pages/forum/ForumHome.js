import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import RegionCard from "../../components/forum/RegionCard";
import RecentPostsList from "../../components/forum/RecentPostsList";
import ForumStats from "../../components/forum/ForumStats";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  GlobeAsiaAustraliaIcon,
} from "@heroicons/react/24/outline";

const ForumHome = () => {
  const [regions, setRegions] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch destinations to use as regions
        const regionsRes = await api.get("/destinations");

        // Fetch recent posts
        const postsRes = await api.get("/forum/posts?sort=newest&limit=5");

        setRegions(regionsRes.data);
        setRecentPosts(postsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching forum data:", err);
        setError("Failed to load forum data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/pakistan_landscape_2.jpg"
            alt="Pakistan Landscape"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container-custom relative z-10 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join the Conversation
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Connect with fellow travelers, share your experiences, and
              discover insider tips about Pakistan's most beautiful
              destinations.
            </p>
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/forum/new-post"
                    className="btn bg-white text-primary-700 hover:bg-white/90"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    Start a Discussion
                  </Link>
                  <Link
                    to="/forum/my-posts"
                    className="btn bg-white/80 text-primary-700 hover:bg-white/90"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
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
                    My Discussions
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn bg-white text-primary-700 hover:bg-white/90"
                >
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Login to Participate
                </Link>
              )}
              <Link
                to="#regions"
                className="btn bg-transparent border border-white text-white hover:bg-white/10"
              >
                <GlobeAsiaAustraliaIcon className="h-5 w-5 mr-2" />
                Explore Regions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Forum Stats */}
        <div className="bg-white rounded-2xl shadow-card p-6 -mt-12 relative z-20 mb-12">
          <ForumStats />
        </div>

        {/* Regions Grid */}
        <section id="regions" className="mt-12 scroll-mt-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900">
              Discussion Boards by Region
            </h2>
            <Link
              to="#"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All Regions
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((region) => (
              <RegionCard key={region._id} region={region} />
            ))}
          </div>
        </section>

        {/* Recent Posts */}
        <section className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900">
              Recent Discussions
            </h2>
            <Link
              to="/forum/all-discussions"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All Discussions
            </Link>
          </div>
          <RecentPostsList posts={recentPosts} />
        </section>

        {/* Call to Action */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-2xl font-bold text-primary-800 mb-2">
                  Share Your Pakistan Experience
                </h3>
                <p className="text-primary-700">
                  Your insights and stories help fellow travelers discover the
                  beauty of Pakistan.
                </p>
              </div>
              {isAuthenticated ? (
                <div className="flex gap-4">
                  <Link
                    to="/forum/new-post"
                    className="btn-primary whitespace-nowrap"
                  >
                    Create New Discussion
                  </Link>
                  <Link
                    to="/forum/my-posts"
                    className="btn-outline-primary whitespace-nowrap"
                  >
                    Manage My Discussions
                  </Link>
                </div>
              ) : (
                <Link to="/login" className="btn-primary whitespace-nowrap">
                  Sign In to Contribute
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ForumHome;
