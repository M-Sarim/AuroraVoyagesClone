import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  RevenueChart,
  BookingsChart,
  PopularDestinationsChart,
  UserStatisticsChart,
  DashboardStats,
} from "../../components/charts/DashboardCharts";
import api from "../../utils/api";

const AdminDashboard = () => {
  const [period, setPeriod] = useState("monthly");
  const [pendingApprovals, setPendingApprovals] = useState({
    tourGuides: [],
    packages: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        setLoading(true);

        // Fetch pending tour guide applications
        const tourGuidesResponse = await api.get("/admin/pending-tour-guides");

        // Fetch pending vacation packages
        const packagesResponse = await api.get("/vacations/admin/pending");

        setPendingApprovals({
          tourGuides: tourGuidesResponse.data,
          packages: packagesResponse.data,
        });

        setLoading(false);
        setError(null);
      } catch (error) {
        console.error("Error fetching pending approvals:", error);
        setError("Failed to load pending approvals. Please try again later.");
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="mt-8">
            <DashboardStats />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-8 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
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
          )}

          {/* Pending Approvals */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pending Approvals
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Pending Tour Guide Applications */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Tour Guide Applications
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : pendingApprovals.tourGuides.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Experience
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date Applied
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pendingApprovals.tourGuides.map((guide) => (
                            <tr key={guide._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                    {guide.user?.name
                                      ?.charAt(0)
                                      .toUpperCase() || "U"}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {guide.user?.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {guide.user?.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {guide.yearsOfExperience} years
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(
                                    guide.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link
                                  to={`/admin/tour-guides/${guide._id}`}
                                  className="text-primary-600 hover:text-primary-900 mr-4"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No pending tour guide applications
                    </div>
                  )}

                  <div className="mt-4 text-right">
                    <Link
                      to="/admin/pending-tour-guides"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View all tour guide applications →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pending Vacation Packages */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Vacation Packages
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : pendingApprovals.packages.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Package
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tour Guide
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pendingApprovals.packages.map((pkg) => (
                            <tr key={pkg._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {pkg.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {pkg.duration} days
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {pkg.tourGuide?.name || "Unknown"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  ${pkg.price}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link
                                  to={`/admin/pending-packages/${pkg._id}`}
                                  className="text-primary-600 hover:text-primary-900 mr-4"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No pending vacation packages
                    </div>
                  )}

                  <div className="mt-4 text-right">
                    <Link
                      to="/admin/pending-packages"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View all pending packages →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Management */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Content Management
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Destinations/Regions Management */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Destinations & Regions
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage all destinations and regions
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Add, edit, and delete destinations and regions for
                      vacation packages.
                    </div>
                    <Link
                      to="/admin/destinations"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>

              {/* Vacation Packages Management */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Vacation Packages
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage all vacation packages
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Create, edit, and delete vacation packages for customers.
                    </div>
                    <Link
                      to="/admin/packages"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>

              {/* Cultural Information */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Cultural Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage cultural information for all destinations
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Add and manage cultural information to help travelers
                      understand local customs and traditions.
                    </div>
                    <Link
                      to="/admin/cultural-info"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>

              {/* Travel Requirements */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Travel Requirements
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage travel requirements for all destinations
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Add and manage travel requirements such as visas, permits,
                      and vaccinations.
                    </div>
                    <Link
                      to="/admin/travel-requirements"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>

              {/* Transport Management */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Transport Options
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage transport options for all destinations
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Add and manage transport options including flights, buses,
                      trains, and more.
                    </div>
                    <Link
                      to="/admin/transport"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Analytics
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Revenue
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPeriod("monthly")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          period === "monthly"
                            ? "bg-primary-100 text-primary-800"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setPeriod("yearly")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          period === "yearly"
                            ? "bg-primary-100 text-primary-800"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        Yearly
                      </button>
                    </div>
                  </div>
                  <RevenueChart period={period} />
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Bookings
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPeriod("monthly")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          period === "monthly"
                            ? "bg-primary-100 text-primary-800"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setPeriod("yearly")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          period === "yearly"
                            ? "bg-primary-100 text-primary-800"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        Yearly
                      </button>
                    </div>
                  </div>
                  <BookingsChart period={period} />
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Popular Destinations
                  </h2>
                  <PopularDestinationsChart />
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    User Statistics
                  </h2>
                  <UserStatisticsChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
