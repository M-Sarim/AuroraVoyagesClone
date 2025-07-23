import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { getTotalCommentCount } from "../../utils/commentUtils";

const ForumStats = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    activeUsers: 0,
    popularRegions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real implementation, you would have an API endpoint for forum stats
        // For now, we'll simulate it with some placeholder data

        // Fetch total posts count
        const postsRes = await api.get("/forum/posts");
        const totalPosts = postsRes.data.length;

        // Calculate other stats based on the posts
        let commentCount = 0;
        const userSet = new Set();
        const regionCounts = {};

        // Use the imported getTotalCommentCount function

        postsRes.data.forEach((post) => {
          // Count comments including replies
          commentCount += getTotalCommentCount(post.comments);

          // Count unique users
          userSet.add(post.author._id);
          if (post.comments) {
            post.comments.forEach((comment) => {
              userSet.add(comment.author._id);
              // Also count users from replies
              if (comment.replies && Array.isArray(comment.replies)) {
                comment.replies.forEach((reply) => {
                  if (reply.author && reply.author._id) {
                    userSet.add(reply.author._id);
                  }
                });
              }
            });
          }

          // Count posts per region
          const regionId = post.region._id;
          const regionName = post.region.name;
          if (!regionCounts[regionId]) {
            regionCounts[regionId] = {
              id: regionId,
              name: regionName,
              count: 0,
            };
          }
          regionCounts[regionId].count += 1;
        });

        // Get top 3 popular regions
        const popularRegions = Object.values(regionCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        setStats({
          totalPosts,
          totalComments: commentCount,
          activeUsers: userSet.size,
          popularRegions,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching forum stats:", err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-24 bg-neutral-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {/* Total Discussions */}
        <div className="bg-primary-50 rounded-xl p-4 flex items-center">
          <div className="bg-primary-100 rounded-full p-3 mr-4">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-neutral-600 text-sm font-medium">
              Total Discussions
            </p>
            <p className="text-2xl font-bold text-primary-700 mt-1">
              {stats.totalPosts}
            </p>
          </div>
        </div>

        {/* Total Comments */}
        <div className="bg-blue-50 rounded-xl p-4 flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-neutral-600 text-sm font-medium">
              Total Comments
            </p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {stats.totalComments}
            </p>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-green-50 rounded-xl p-4 flex items-center">
          <div className="bg-green-100 rounded-full p-3 mr-4">
            <UserGroupIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-neutral-600 text-sm font-medium">Active Users</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {stats.activeUsers}
            </p>
          </div>
        </div>

        {/* Popular Regions */}
        <div className="bg-amber-50 rounded-xl p-4 flex flex-col">
          <div className="flex items-center mb-3">
            <div className="bg-amber-100 rounded-full p-2 mr-3">
              <FireIcon className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-neutral-600 text-sm font-medium">
              Popular Regions
            </p>
          </div>
          <ul className="space-y-2 flex-1">
            {stats.popularRegions.map((region) => (
              <li key={region.id} className="flex items-center justify-between">
                <Link
                  to={`/forum/region/${region.id}`}
                  className="text-neutral-700 hover:text-primary-600 transition-colors"
                >
                  {region.name}
                </Link>
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {region.count}
                </span>
              </li>
            ))}
            {stats.popularRegions.length === 0 && (
              <li className="text-neutral-500 text-sm text-center">
                No data available
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ForumStats;
