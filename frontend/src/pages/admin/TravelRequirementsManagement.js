import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  DocumentTextIcon,
  FunnelIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const TravelRequirementsManagement = () => {
  const [travelRequirements, setTravelRequirements] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    destination: '',
    type: '',
    isRequired: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch travel requirements and destinations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all travel requirements
        const reqRes = await api.get('/travel-requirements');
        setTravelRequirements(reqRes.data);
        
        // Fetch all destinations for the filter dropdown
        const destRes = await api.get('/destinations');
        setDestinations(destRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load travel requirements');
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
      type: '',
      isRequired: ''
    });
  };

  // Delete travel requirement
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this travel requirement? This action cannot be undone.')) {
      try {
        await api.delete(`/travel-requirements/${id}`);
        setTravelRequirements(prev => prev.filter(req => req._id !== id));
      } catch (err) {
        console.error('Error deleting travel requirement:', err);
        setError('Failed to delete travel requirement');
      }
    }
  };

  // Filter travel requirements based on selected filters
  const filteredRequirements = travelRequirements.filter(req => {
    return (
      (filters.destination === '' || req.destination._id === filters.destination) &&
      (filters.type === '' || req.type === filters.type) &&
      (filters.isRequired === '' || 
        (filters.isRequired === 'true' && req.isRequired) || 
        (filters.isRequired === 'false' && !req.isRequired))
    );
  });

  // Get requirement icon based on type
  const getRequirementIcon = (type) => {
    switch (type) {
      case 'visa':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'permit':
        return <DocumentTextIcon className="h-5 w-5 text-green-500" />;
      case 'vaccination':
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />;
      case 'document':
        return <DocumentTextIcon className="h-5 w-5 text-purple-500" />;
      case 'equipment':
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="lg:flex lg:items-center lg:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Travel Requirements Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage travel requirements for all destinations
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
              to="/admin/travel-requirements/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Travel Requirement
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
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Types</option>
                <option value="visa">Visa</option>
                <option value="permit">Permit</option>
                <option value="vaccination">Vaccination</option>
                <option value="document">Document</option>
                <option value="equipment">Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="isRequired" className="block text-sm font-medium text-gray-700">
                Required Status
              </label>
              <select
                id="isRequired"
                name="isRequired"
                value={filters.isRequired}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="true">Required</option>
                <option value="false">Optional</option>
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
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destination
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequirements.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No travel requirements found. {filters.destination || filters.type || filters.isRequired ? 'Try adjusting your filters.' : ''}
                        </td>
                      </tr>
                    ) : (
                      filteredRequirements.map((req) => (
                        <tr key={req._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {getRequirementIcon(req.type)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{req.name}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {req.description.substring(0, 60)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {req.destination.name}, {req.destination.country}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {req.type.charAt(0).toUpperCase() + req.type.slice(1)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              req.isRequired 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {req.isRequired ? 'Required' : 'Optional'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {req.cost && req.cost.amount > 0 
                              ? `${req.cost.amount} ${req.cost.currency}` 
                              : 'Free'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link
                                to={`/admin/travel-requirements/edit/${req._id}`}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                <PencilIcon className="h-5 w-5" />
                                <span className="sr-only">Edit</span>
                              </Link>
                              <button
                                onClick={() => handleDelete(req._id)}
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

export default TravelRequirementsManagement;
