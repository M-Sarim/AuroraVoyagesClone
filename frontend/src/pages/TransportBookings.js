import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/transport/BookingCard';
import BookingFilter from '../components/transport/BookingFilter';
import BookingSort from '../components/transport/BookingSort';

const TransportBookings = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOption, setSortOption] = useState('date-desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/transport-bookings');
    }
  }, [isAuthenticated, navigate]);

  // Fetch user's bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setLoading(true);
        const response = await api.get('/bookings/user');
        
        // Filter bookings that have transport data
        const transportBookings = response.data.filter(booking => 
          booking.transport && booking.transport.length > 0
        );
        
        setBookings(transportBookings);
        setFilteredBookings(transportBookings);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your bookings. Please try again later.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, user]);

  // Apply filters and sorting
  useEffect(() => {
    if (!bookings.length) return;

    let result = [...bookings];

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(booking => booking.status === filterStatus);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(booking => 
        booking.transport.some(t => 
          t.name?.toLowerCase().includes(query) || 
          t.origin?.toLowerCase().includes(query) || 
          t.destination?.toLowerCase().includes(query) ||
          t.provider?.toLowerCase().includes(query)
        ) ||
        booking._id.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'date-asc':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-asc':
        result.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      default:
        break;
    }

    setFilteredBookings(result);
  }, [bookings, filterStatus, sortOption, searchQuery]);

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      
      // Update booking status in state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">My Transport Bookings</h1>
          <Link
            to="/how-to-get-there"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book New Transport
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            {/* Search */}
            <div className="flex-1 mb-4 md:mb-0">
              <label htmlFor="search" className="sr-only">Search bookings</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by destination, provider, or booking ID"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <BookingFilter 
                activeFilter={filterStatus} 
                onFilterChange={handleFilterChange} 
              />
              <BookingSort 
                activeSort={sortOption} 
                onSortChange={handleSortChange} 
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* No Bookings State */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try changing your search or filter criteria.' 
                : 'You haven\'t made any transport bookings yet.'}
            </p>
            <div className="mt-6">
              <Link
                to="/how-to-get-there"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Book Your First Transport
              </Link>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div className="space-y-6">
            {filteredBookings.map(booking => (
              <BookingCard 
                key={booking._id} 
                booking={booking} 
                onCancel={() => handleCancelBooking(booking._id)} 
              />
            ))}
          </div>
        )}

        {/* Pagination (for future implementation) */}
        {!loading && !error && filteredBookings.length > 10 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                aria-current="page"
                className="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                1
              </a>
              <a
                href="#"
                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                2
              </a>
              <a
                href="#"
                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                3
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportBookings;
