import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const PendingPackages = () => {
  const [pendingPackages, setPendingPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectionModal, setRejectionModal] = useState({
    isOpen: false,
    packageId: null,
    packageName: '',
    reason: '',
  });

  useEffect(() => {
    const fetchPendingPackages = async () => {
      try {
        const res = await api.get('/vacations/admin/pending');
        setPendingPackages(res.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load pending packages');
        setIsLoading(false);
      }
    };

    fetchPendingPackages();
  }, []);

  const approvePackage = async (id) => {
    try {
      await api.patch(`/vacations/${id}/approve`);
      // Remove from pending list
      setPendingPackages(pendingPackages.filter(pkg => pkg._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve package');
    }
  };

  const openRejectionModal = (id, name) => {
    setRejectionModal({
      isOpen: true,
      packageId: id,
      packageName: name,
      reason: '',
    });
  };

  const closeRejectionModal = () => {
    setRejectionModal({
      isOpen: false,
      packageId: null,
      packageName: '',
      reason: '',
    });
  };

  const handleReasonChange = (e) => {
    setRejectionModal({
      ...rejectionModal,
      reason: e.target.value,
    });
  };

  const rejectPackage = async () => {
    if (!rejectionModal.reason.trim()) {
      return; // Don't submit if reason is empty
    }

    try {
      await api.patch(`/vacations/${rejectionModal.packageId}/reject`, {
        rejectionReason: rejectionModal.reason,
      });

      // Remove from pending list
      setPendingPackages(pendingPackages.filter(pkg => pkg._id !== rejectionModal.packageId));

      // Close modal
      closeRejectionModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject package');
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
          <h1 className="text-xl font-semibold text-gray-900">Pending Packages</h1>
          <p className="mt-2 text-sm text-gray-700">
            Review and approve or reject vacation packages submitted by tour guides.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
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

      {pendingPackages.length === 0 ? (
        <div className="mt-8 text-center py-12 border-2 border-dashed border-gray-300 rounded-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pending packages</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no vacation packages waiting for approval.
          </p>
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
                        Package Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Tour Guide
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Price
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Duration
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Submitted
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {pendingPackages.map((pkg) => (
                      <tr key={pkg._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {pkg.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {pkg.tourGuide?.name || 'Unknown'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${pkg.price}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {pkg.duration} days
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(pkg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link to={`/admin/pending-packages/${pkg._id}`} className="text-primary-600 hover:text-primary-900 mr-4">
                            View
                          </Link>
                          <button
                            onClick={() => approvePackage(pkg._id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectionModal(pkg._id, pkg.name)}
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
                      Reject Package
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You are about to reject "{rejectionModal.packageName}". Please provide a reason for rejection.
                      </p>
                      <div className="mt-4">
                        <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700">
                          Rejection Reason
                        </label>
                        <textarea
                          id="rejection-reason"
                          name="rejection-reason"
                          rows={4}
                          value={rejectionModal.reason}
                          onChange={handleReasonChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Explain why this package is being rejected..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={rejectPackage}
                  disabled={!rejectionModal.reason.trim()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={closeRejectionModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default PendingPackages;
