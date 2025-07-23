import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageHelper';

const TourGuideBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [rejectionModal, setRejectionModal] = useState({
    isOpen: false,
    bookingId: null,
    reason: '',
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/bookings/tour-guide/packages');
        setBookings(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load bookings');
        setIsLoading(false);
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'pending') {
      return booking.tourGuideApproval.status === 'pending';
    } else if (activeTab === 'approved') {
      return booking.tourGuideApproval.status === 'approved';
    } else if (activeTab === 'rejected') {
      return booking.tourGuideApproval.status === 'rejected';
    }
    return true;
  });

  const handleApprove = async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/tour-guide-approval`, {
        status: 'approved'
      });
      
      // Update the booking in the state
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, tourGuideApproval: response.data.booking.tourGuideApproval } 
          : booking
      ));
      
      alert('Booking approved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve booking');
      console.error('Error approving booking:', err);
    }
  };

  const openRejectionModal = (bookingId) => {
    setRejectionModal({
      isOpen: true,
      bookingId,
      reason: '',
    });
  };

  const closeRejectionModal = () => {
    setRejectionModal({
      isOpen: false,
      bookingId: null,
      reason: '',
    });
  };

  const handleReasonChange = (e) => {
    setRejectionModal({
      ...rejectionModal,
      reason: e.target.value,
    });
  };

  const handleReject = async () => {
    if (!rejectionModal.reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const response = await api.put(`/bookings/${rejectionModal.bookingId}/tour-guide-approval`, {
        status: 'rejected',
        reason: rejectionModal.reason
      });
      
      // Update the booking in the state
      setBookings(bookings.map(booking => 
        booking._id === rejectionModal.bookingId 
          ? { ...booking, tourGuideApproval: response.data.booking.tourGuideApproval, status: 'cancelled' } 
          : booking
      ));
      
      closeRejectionModal();
      alert('Booking rejected successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject booking');
      console.error('Error rejecting booking:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Package Bookings</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage bookings for your vacation packages.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`${
              activeTab === 'pending'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`${
              activeTab === 'approved'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`${
              activeTab === 'rejected'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Rejected
          </button>
        </nav>
      </div>

      {error ? (
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
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
      ) : filteredBookings.length === 0 ? (
        <div className="mt-6 text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'pending'
              ? "You don't have any pending bookings to review."
              : activeTab === 'approved'
              ? "You haven't approved any bookings yet."
              : "You haven't rejected any bookings yet."}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Package
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Dates
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Price
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {booking.vacationPackage?.images && booking.vacationPackage.images.length > 0 ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={getImageUrl(booking.vacationPackage.images[0])}
                            alt={booking.vacationPackage.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{booking.vacationPackage?.name || 'Unknown Package'}</div>
                        <div className="text-gray-500">{booking.vacationPackage?.duration || 'N/A'} days</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="font-medium text-gray-900">{booking.user?.name || 'Unknown User'}</div>
                    <div className="text-gray-500">{booking.user?.email || 'No email'}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                    <div>to {new Date(booking.endDate).toLocaleDateString()}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    ${booking.totalPrice}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </div>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link to={`/bookings/${booking._id}`} className="text-primary-600 hover:text-primary-900 mr-4">
                      View
                    </Link>
                    {booking.tourGuideApproval.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(booking._id)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openRejectionModal(booking._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Reject Booking</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please provide a reason for rejecting this booking. This will be visible to the customer.
                      </p>
                      <div className="mt-4">
                        <textarea
                          rows="4"
                          className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Enter rejection reason..."
                          value={rejectionModal.reason}
                          onChange={handleReasonChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleReject}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeRejectionModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourGuideBookings;
