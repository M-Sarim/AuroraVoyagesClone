import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { format } from 'date-fns';

const ItineraryList = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch user's itineraries
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true);
        const response = await api.get('/itineraries');
        setItineraries(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching itineraries:', err);
        setError('Failed to load your itineraries. Please try again later.');
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchItineraries();
    }
  }, [isAuthenticated]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/itineraries' } });
    }
  }, [isAuthenticated, navigate]);
  
  // Delete an itinerary
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      try {
        await api.delete(`/itineraries/${id}`);
        setItineraries(itineraries.filter(itinerary => itinerary._id !== id));
      } catch (err) {
        console.error('Error deleting itinerary:', err);
        setError('Failed to delete itinerary. Please try again.');
      }
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-3xl font-bold text-gray-900">My Itineraries</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all your saved travel itineraries.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Link
                to="/itinerary-planner"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
              >
                Create New Itinerary
              </Link>
            </div>
          </div>
          
          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {itineraries.length === 0 ? (
            <div className="mt-6 text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No itineraries</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new itinerary.
              </p>
              <div className="mt-6">
                <Link
                  to="/itinerary-planner"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Itinerary
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Name
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Dates
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Destinations
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Visibility
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Created
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {itineraries.map((itinerary) => (
                          <tr key={itinerary._id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              <Link to={`/itineraries/${itinerary._id}`} className="text-primary-600 hover:text-primary-900">
                                {itinerary.name}
                              </Link>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {format(new Date(itinerary.startDate), 'MMM d, yyyy')} - {format(new Date(itinerary.endDate), 'MMM d, yyyy')}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500">
                              <div className="flex flex-wrap gap-1">
                                {itinerary.items.slice(0, 3).map((item, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {item.destination.name}
                                  </span>
                                ))}
                                {itinerary.items.length > 3 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    +{itinerary.items.length - 3} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {itinerary.isPublic ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Public
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Private
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {format(new Date(itinerary.createdAt), 'MMM d, yyyy')}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <div className="flex justify-end space-x-2">
                                <Link
                                  to={`/itineraries/${itinerary._id}/edit`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Edit
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(itinerary._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryList;
