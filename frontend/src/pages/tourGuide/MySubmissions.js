import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/vacations/tour-guide/submissions');
        setSubmissions(res.data);
        setFilteredSubmissions(res.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load submissions');
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const filterSubmissions = (status) => {
    setActiveFilter(status);

    if (status === 'all') {
      setFilteredSubmissions(submissions);
    } else {
      setFilteredSubmissions(submissions.filter(sub => sub.status === status));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">My Package Submissions</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your submitted vacation packages and their current status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/tour-guide/submit-package"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Package
          </Link>
        </div>
      </div>

      <div className="mt-6 border-b border-gray-200">
        <div className="sm:flex sm:items-baseline">
          <div className="mt-4 sm:mt-0">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => filterSubmissions('all')}
                className={`${
                  activeFilter === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                All
                <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {submissions.length}
                </span>
              </button>
              <button
                onClick={() => filterSubmissions('pending')}
                className={`${
                  activeFilter === 'pending'
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                Pending
                <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {submissions.filter(sub => sub.status === 'pending').length}
                </span>
              </button>
              <button
                onClick={() => filterSubmissions('approved')}
                className={`${
                  activeFilter === 'approved'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                Approved
                <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {submissions.filter(sub => sub.status === 'approved').length}
                </span>
              </button>
              <button
                onClick={() => filterSubmissions('rejected')}
                className={`${
                  activeFilter === 'rejected'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                Rejected
                <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {submissions.filter(sub => sub.status === 'rejected').length}
                </span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="mt-8 text-center py-12 border-2 border-dashed border-gray-300 rounded-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No packages found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeFilter === 'all'
              ? "You haven't submitted any packages yet."
              : `You don't have any ${activeFilter} packages.`}
          </p>
          <div className="mt-6">
            <Link
              to="/tour-guide/submit-package"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create a new package
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
                        Package Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Price
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Duration
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
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
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {submission.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${submission.price}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {submission.duration} days
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            submission.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : submission.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                          {submission.status === 'rejected' && submission.rejectionReason && (
                            <p className="mt-1 text-xs text-red-600">
                              Reason: {submission.rejectionReason}
                            </p>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link to={`/vacations/${submission._id}`} className="text-primary-600 hover:text-primary-900 mr-4">
                            View
                          </Link>
                          {submission.status === 'rejected' && (
                            <Link to={`/tour-guide/edit-package/${submission._id}`} className="text-primary-600 hover:text-primary-900">
                              Edit & Resubmit
                            </Link>
                          )}
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
  );
};

export default MySubmissions;
