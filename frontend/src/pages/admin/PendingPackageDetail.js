import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageHelper';

const PendingPackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vacationPackage, setVacationPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/vacations/${id}`);
        setVacationPackage(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch package details');
        setLoading(false);
        console.error('Error fetching package details:', err);
      }
    };

    fetchPackageData();
  }, [id]);

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      setError(null); // Clear any previous errors

      console.log('Approving package with ID:', id);
      console.log('Admin token:', localStorage.getItem('token') ? 'Token exists' : 'No token found');

      // Check if we have a valid token before proceeding
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      // Add a delay to ensure the UI shows the loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('Sending approval request to:', `${process.env.REACT_APP_API_URL}/vacations/${id}/approve`);

      // Set a timeout to catch if the server doesn't respond
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out after 10 seconds')), 10000)
      );

      // Race the API call against the timeout
      const response = await Promise.race([
        api.patch(`/vacations/${id}/approve`),
        timeoutPromise
      ]);

      console.log('Approval response received:', response);
      console.log('Approval response data:', response.data);

      setIsSubmitting(false);

      // Show success message
      alert('Package approved successfully!');

      // Navigate back to the pending packages list
      navigate('/admin/pending-packages', {
        state: { message: 'Package approved successfully' }
      });
    } catch (err) {
      console.error('Error approving package:', err);

      // Show detailed error information
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        setError(`Failed to approve package: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        console.error('No response received. Request details:', err.request);
        console.error('Request URL:', `${process.env.REACT_APP_API_URL}/vacations/${id}/approve`);
        console.error('Request method:', 'PATCH');
        console.error('Request timeout reached:', err.message.includes('timeout'));
        setError('Failed to approve package: No response from server. The server might be down or unreachable.');
      } else {
        console.error('Error message:', err.message);
        setError(`Failed to approve package: ${err.message}`);
      }

      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null); // Clear any previous errors

      console.log('Rejecting package with ID:', id);
      console.log('Rejection reason:', rejectionReason);

      // Add a delay to ensure the UI shows the loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      const response = await api.patch(`/vacations/${id}/reject`, { rejectionReason });
      console.log('Rejection response:', response.data);

      setIsSubmitting(false);

      // Show success message
      alert('Package rejected successfully!');

      // Navigate back to the pending packages list
      navigate('/admin/pending-packages', {
        state: { message: 'Package rejected successfully' }
      });
    } catch (err) {
      console.error('Error rejecting package:', err);

      // Show detailed error information
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        setError(`Failed to reject package: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Failed to reject package: No response from server');
      } else {
        console.error('Error message:', err.message);
        setError(`Failed to reject package: ${err.message}`);
      }

      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !vacationPackage) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error || 'Package not found'}</p>
        <Link
          to="/admin/pending-packages"
          className="mt-2 inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Back to Pending Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Admin Action Bar */}
      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Review Pending Package</h1>
            <p className="text-sm text-gray-500">
              Submitted by: {vacationPackage.tourGuide?.name || 'Unknown'} on {new Date(vacationPackage.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/admin/pending-packages')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to List
            </button>
            <button
              onClick={() => setShowRejectionModal(true)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Reject'}
            </button>
            <button
              onClick={handleApprove}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Approve'}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
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
      </div>

      {/* Package Details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-900">{vacationPackage.name}</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {vacationPackage.duration} days | ${vacationPackage.price}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="border-t border-gray-200">
          <div className="px-4 sm:px-6">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'itinerary'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Itinerary
              </button>
              <button
                onClick={() => setActiveTab('inclusions')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inclusions'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Inclusions
              </button>
              {vacationPackage.tourGuide && (
                <button
                  onClick={() => setActiveTab('tourGuide')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tourGuide'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tour Guide
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-5 sm:px-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-gray-600">{vacationPackage.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Destinations</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {vacationPackage.destinations?.map((destination) => (
                    <span
                      key={destination._id}
                      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {destination.name}, {destination.country}
                    </span>
                  ))}
                </div>
              </div>

              {vacationPackage.activities && vacationPackage.activities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Activities</h3>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                    {vacationPackage.activities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                  </ul>
                </div>
              )}

              {vacationPackage.images && vacationPackage.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Images</h3>
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {vacationPackage.images.map((image, index) => (
                      <div key={index} className="relative h-48 overflow-hidden rounded-lg">
                        <img
                          src={getImageUrl(image)}
                          alt={`${vacationPackage.name} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <div>
              {vacationPackage.schedule && vacationPackage.schedule.length > 0 ? (
                <div className="space-y-8">
                  {vacationPackage.schedule.map((day) => (
                    <div key={day.day} className="border-l-4 border-primary-500 pl-4">
                      <h3 className="text-lg font-medium text-gray-900">Day {day.day}</h3>
                      <div className="mt-2 space-y-3">
                        {day.morning && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Morning</h4>
                            <p className="text-gray-600">{day.morning}</p>
                          </div>
                        )}
                        {day.afternoon && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Afternoon</h4>
                            <p className="text-gray-600">{day.afternoon}</p>
                          </div>
                        )}
                        {day.evening && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Evening</h4>
                            <p className="text-gray-600">{day.evening}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No detailed itinerary provided.</p>
              )}
            </div>
          )}

          {/* Inclusions Tab */}
          {activeTab === 'inclusions' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Transport</h3>
                {vacationPackage.includedTransport && vacationPackage.includedTransport.length > 0 ? (
                  <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                    {vacationPackage.includedTransport.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-500">No transport details provided.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Accommodation</h3>
                {vacationPackage.includedHotels && vacationPackage.includedHotels.length > 0 ? (
                  <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                    {vacationPackage.includedHotels.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-500">No accommodation details provided.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Meals</h3>
                {vacationPackage.includedMeals && vacationPackage.includedMeals.length > 0 ? (
                  <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                    {vacationPackage.includedMeals.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-500">No meal details provided.</p>
                )}
              </div>
            </div>
          )}

          {/* Tour Guide Tab */}
          {activeTab === 'tourGuide' && vacationPackage.tourGuide && (
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/3 mb-4 sm:mb-0 sm:pr-6">
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(vacationPackage.tourGuide.image) || '/images/default_profile.jpg'}
                    alt={vacationPackage.tourGuide.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="sm:w-2/3">
                <h3 className="text-lg font-medium text-gray-900">{vacationPackage.tourGuide.name}</h3>
                <div className="mt-2 flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <svg
                        key={rating}
                        className={`h-5 w-5 ${
                          rating < Math.floor(vacationPackage.tourGuide.rating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {vacationPackage.tourGuide.rating || 0} out of 5 stars
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">{vacationPackage.tourGuide.bio || 'No bio available.'}</p>
                {vacationPackage.tourGuide.experience && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Experience</h4>
                    <p className="text-gray-600">{vacationPackage.tourGuide.experience} years</p>
                  </div>
                )}
                {vacationPackage.tourGuide.languages && vacationPackage.tourGuide.languages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Languages</h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {vacationPackage.tourGuide.languages.map((language, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {vacationPackage.tourGuide.specialties && vacationPackage.tourGuide.specialties.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Specialties</h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {vacationPackage.tourGuide.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Reject Package</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please provide a reason for rejecting this package. This will be sent to the tour guide.
                      </p>
                      <div className="mt-4">
                        <textarea
                          rows="4"
                          className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Enter rejection reason..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Rejecting...' : 'Reject Package'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRejectionModal(false)}
                  disabled={isSubmitting}
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

export default PendingPackageDetail;
