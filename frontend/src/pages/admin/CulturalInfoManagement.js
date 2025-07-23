import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  GlobeAsiaAustraliaIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const CulturalInfoManagement = () => {
  const [culturalInfo, setCulturalInfo] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    destination: '',
    category: '',
    importance: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch cultural info and destinations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all cultural info
        const infoRes = await api.get('/cultural-info');
        setCulturalInfo(infoRes.data);
        
        // Fetch all destinations for the filter dropdown
        const destRes = await api.get('/destinations');
        setDestinations(destRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load cultural information');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      destination: '',
      category: '',
      importance: ''
    });
  };

  // Delete cultural info
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cultural information? This action cannot be undone.')) {
      try {
        await api.delete(`/cultural-info/${id}`);
        setCulturalInfo(prev => prev.filter(info => info._id !== id));
      } catch (err) {
        console.error('Error deleting cultural info:', err);
        setError('Failed to delete cultural information');
      }
    }
  };

  // Filter cultural info based on selected filters
  const filteredInfo = culturalInfo.filter(info => {
    return (
      (filters.destination === '' || info.destination._id === filters.destination) &&
      (filters.category === '' || info.category === filters.category) &&
      (filters.importance === '' || info.importance === filters.importance)
    );
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(culturalInfo.map(info => info.category))];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="lg:flex lg:items-center lg:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Cultural Information Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage cultural information for all destinations
          </p>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <span className="hidden sm:block ml-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </span>
          <span className="sm:ml-3">
            <Link
              to="/admin/cultural-info/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Cultural Information
            </Link>
          </span>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Clear all filters
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                Destination
              </label>
              <select
                id="destination"
                name="destination"
                value={filters.destination}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Destinations</option>
                {destinations.map(dest => (
                  <option key={dest._id} value={dest._id}>
                    {dest.name}, {dest.country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="importance" className="block text-sm font-medium text-gray-700">
                Importance
              </label>
              <select
                id="importance"
                name="importance"
                value={filters.importance}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Importance Levels</option>
                <option value="essential">Essential</option>
                <option value="recommended">Recommended</option>
                <option value="good-to-know">Good to Know</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destination
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Importance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInfo.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No cultural information found. {filters.destination || filters.category || filters.importance ? 'Try adjusting your filters.' : ''}
                        </td>
                      </tr>
                    ) : (
                      filteredInfo.map((info) => (
                        <tr key={info._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{info.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {info.description.substring(0, 60)}...
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <GlobeAsiaAustraliaIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <div className="text-sm text-gray-900">
                                {info.destination.name}, {info.destination.country}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {info.category.charAt(0).toUpperCase() + info.category.slice(1)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              info.importance === 'essential' 
                                ? 'bg-red-100 text-red-800' 
                                : info.importance === 'recommended'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {info.importance === 'good-to-know' ? 'Good to Know' : info.importance.charAt(0).toUpperCase() + info.importance.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(info.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link
                                to={`/admin/cultural-info/edit/${info._id}`}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                <PencilIcon className="h-5 w-5" />
                                <span className="sr-only">Edit</span>
                              </Link>
                              <button
                                onClick={() => handleDelete(info._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" />
                                <span className="sr-only">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalInfoManagement;
