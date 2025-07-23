import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const PendingTourGuides = () => {
  const [pendingGuides, setPendingGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectionModal, setRejectionModal] = useState({
    isOpen: false,
    guideId: null,
    guideName: '',
    reason: '',
  });

  useEffect(() => {
    const fetchPendingGuides = async () => {
      try {
        const res = await api.get('/tour-guides/pending');
        setPendingGuides(res.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load pending tour guide applications');
        setIsLoading(false);
      }
    };

    fetchPendingGuides();
  }, []);

  const approveGuide = async (id) => {
    try {
      await api.patch(`/tour-guides/${id}/approve`);
      // Remove from pending list
      setPendingGuides(pendingGuides.filter(guide => guide._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve tour guide');
    }
  };

  const openRejectionModal = (id, name) => {
    setRejectionModal({
      isOpen: true,
      guideId: id,
      guideName: name,
      reason: '',
    });
  };

  const closeRejectionModal = () => {
    setRejectionModal({
      isOpen: false,
      guideId: null,
      guideName: '',
      reason: '',
    });
  };

  const handleReasonChange = (e) => {
    setRejectionModal({
      ...rejectionModal,
      reason: e.target.value,
    });
  };

  const rejectGuide = async () => {
    if (!rejectionModal.reason.trim()) {
      return; // Don't submit if reason is empty
    }

    try {
      await api.patch(`/tour-guides/${rejectionModal.guideId}/reject`, {
        rejectionReason: rejectionModal.reason,
      });

      // Remove from pending list
      setPendingGuides(pendingGuides.filter(guide => guide._id !== rejectionModal.guideId));

      // Close modal
      closeRejectionModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject tour guide');
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
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Pending Tour Guide Applications</h1>
          <p className="mt-2 text-sm text-gray-700">
            Review and approve or reject tour guide applications.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {pendingGuides.length === 0 ? (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md p-6 text-center text-gray-500">
          No pending tour guide applications at this time.
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
                        Email
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Phone
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Experience
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Applied On
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {pendingGuides.map((guide) => (
                      <tr key={guide._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {guide.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {guide.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {guide.phone}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {guide.experience} years
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(guide.createdAt).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => approveGuide(guide._id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectionModal(guide._id, guide.name)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
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

      {/* Rejection Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Reject Tour Guide Application
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You are about to reject {rejectionModal.guideName}'s application. Please provide a reason for the rejection.
                      </p>
                      <div className="mt-4">
                        <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700">
                          Rejection Reason
                        </label>
                        <textarea
                          id="rejection-reason"
                          name="rejection-reason"
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Please explain why this application is being rejected..."
                          value={rejectionModal.reason}
                          onChange={handleReasonChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={rejectGuide}
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

export default PendingTourGuides;
