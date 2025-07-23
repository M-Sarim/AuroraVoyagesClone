import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    tourGuides: 0,
    destinations: 0,
    vacationPackages: 0,
    pendingPackages: 0,
    pendingTourGuides: 0,
  });
  const [recentPackages, setRecentPackages] = useState([]);
  const [destinationsByType, setDestinationsByType] = useState({});
  const [culturalInfoByRegion, setCulturalInfoByRegion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Get dashboard statistics from the admin API
        const statsRes = await api.get("/admin/analytics/stats");

        // Get user statistics
        const userStatsRes = await api.get("/admin/analytics/users");

        // Get pending packages
        const pendingPackagesRes = await api.get("/admin/pending-packages");

        // Get pending tour guide applications
        const pendingGuidesRes = await api.get("/admin/pending-tour-guides");

        // Get destinations
        const destinationsRes = await api.get("/destinations");

        // Get all packages
        const packagesRes = await api.get("/vacations", {
          params: { status: "all" },
        });

        // Get cultural info
        const culturalInfoRes = await api.get("/cultural-info");

        setStats({
          users: userStatsRes.data.total,
          tourGuides: userStatsRes.data.tourGuides,
          destinations: destinationsRes.data.length,
          vacationPackages: packagesRes.data.length,
          pendingPackages: pendingPackagesRes.data.length,
          pendingTourGuides: pendingGuidesRes.data.length,
          totalBookings: statsRes.data.totalBookings,
          totalRevenue: statsRes.data.totalRevenue,
        });

        // Get recent packages (most recently created)
        setRecentPackages(
          packagesRes.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        );

        // Group destinations by type
        const destinationGroups = {};
        destinationsRes.data.forEach((destination) => {
          if (!destinationGroups[destination.type]) {
            destinationGroups[destination.type] = [];
          }
          destinationGroups[destination.type].push(destination);
        });
        setDestinationsByType(destinationGroups);

        // Group cultural info by region
        const culturalInfoGroups = [];
        const destinationMap = {};

        // Create a map of destination IDs to destination objects
        destinationsRes.data.forEach((destination) => {
          destinationMap[destination._id] = destination;
        });

        // Group cultural info by destination
        culturalInfoRes.data.forEach((info) => {
          const destinationId = info.destination._id;
          const existingGroup = culturalInfoGroups.find(
            (group) => group.destinationId === destinationId
          );

          if (existingGroup) {
            existingGroup.items.push(info);
          } else {
            culturalInfoGroups.push({
              destinationId,
              destinationName: info.destination.name,
              country: info.destination.country,
              items: [info],
            });
          }
        });

        // Sort groups by number of items (descending)
        culturalInfoGroups.sort((a, b) => b.items.length - a.items.length);

        // Take top 5 regions with most cultural info
        setCulturalInfoByRegion(culturalInfoGroups.slice(0, 5));

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(err.response?.data?.message || "Failed to load admin data");
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Admin Dashboard
          </h2>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <span className="hidden sm:block ml-3">
            <Link
              to="/admin/pending-packages"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Review Pending Packages
            </Link>
          </span>
          <span className="hidden sm:block ml-3">
            <Link
              to="/admin/pending-tour-guides"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Review Tour Guide Applications
            </Link>
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
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

      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Overview
        </h3>
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Users
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.users}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tour Guides
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.tourGuides}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Destinations
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.destinations}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Bookings
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.totalBookings || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Revenue
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        $
                        {stats.totalRevenue
                          ? stats.totalRevenue.toLocaleString()
                          : "0"}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Vacation Packages
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.vacationPackages}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Packages
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.pendingPackages}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link
                  to="/admin/pending-packages"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  View all pending packages
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Tour Guides
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.pendingTourGuides}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link
                  to="/admin/pending-tour-guides"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  View all pending tour guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regions by Type Section */}
      <div className="mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Regions by Type
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Overview of destinations categorized by type.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/admin/destinations"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Manage Regions
            </Link>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(destinationsByType).map(([type, destinations]) => (
            <div
              key={type}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-gray-900 capitalize mb-2">
                  {type.replace("_", " ")} Destinations
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  {destinations.length}{" "}
                  {destinations.length === 1 ? "destination" : "destinations"}
                </p>
                <ul className="space-y-2">
                  {destinations.slice(0, 5).map((destination) => (
                    <li key={destination._id} className="text-sm">
                      <span className="font-medium">{destination.name}</span>
                      <span className="text-gray-500">
                        {" "}
                        - {destination.country}
                      </span>
                    </li>
                  ))}
                  {destinations.length > 5 && (
                    <li className="text-sm text-primary-600">
                      +{destinations.length - 5} more...
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cultural Info by Region Section */}
      <div className="mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Cultural Information by Region
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Regions with the most cultural information entries.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/admin/cultural-info"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Manage Cultural Info
            </Link>
          </div>
        </div>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Region
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Country
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Entries
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Categories
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {culturalInfoByRegion.map((region) => (
                <tr key={region.destinationId}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {region.destinationName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {region.country}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {region.items.length}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {Array.from(
                      new Set(region.items.map((item) => item.category))
                    )
                      .slice(0, 3)
                      .map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1 capitalize"
                        >
                          {category}
                        </span>
                      ))}
                    {Array.from(
                      new Set(region.items.map((item) => item.category))
                    ).length > 3 && (
                      <span className="text-xs text-gray-500">
                        +
                        {Array.from(
                          new Set(region.items.map((item) => item.category))
                        ).length - 3}{" "}
                        more
                      </span>
                    )}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link
                      to={`/admin/cultural-info?destination=${region.destinationId}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View
                      <span className="sr-only">
                        , {region.destinationName}
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Vacation Packages Section */}
      <div className="mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Vacation Packages
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              The most recently created vacation packages.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/admin/create-package"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Package
            </Link>
          </div>
        </div>
        <div className="mt-4 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Package Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Destinations
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Duration
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Tour Guide
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentPackages.map((pkg) => (
                      <tr key={pkg._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {pkg.name}
                          <div className="text-xs text-gray-500">
                            Created{" "}
                            {new Date(pkg.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {pkg.destinations && pkg.destinations.length > 0 ? (
                            <div>
                              {pkg.destinations.slice(0, 2).map((dest) => (
                                <div key={dest._id} className="text-sm">
                                  {dest.name}, {dest.country}
                                </div>
                              ))}
                              {pkg.destinations.length > 2 && (
                                <div className="text-xs text-gray-400">
                                  +{pkg.destinations.length - 2} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">
                              No destinations
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {pkg.duration} {pkg.duration === 1 ? "day" : "days"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {pkg.tourGuide?.name || "Admin"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${pkg.price.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              pkg.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : pkg.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {pkg.status.charAt(0).toUpperCase() +
                              pkg.status.slice(1)}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            to={`/vacations/${pkg._id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View<span className="sr-only">, {pkg.name}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
