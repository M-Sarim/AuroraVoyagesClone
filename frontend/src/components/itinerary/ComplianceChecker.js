import React from "react";

const ComplianceChecker = ({ results, onClose }) => {
  const { requirementsByDestination } = results;

  // Count total requirements
  const totalRequirements = requirementsByDestination.reduce(
    (total, item) => total + item.requirements.length,
    0
  );

  // Count required permits
  const requiredPermits = requirementsByDestination.reduce(
    (total, item) =>
      total +
      item.requirements.filter((req) => req.type === "permit" && req.isRequired)
        .length,
    0
  );

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 bg-primary-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Travel Requirements</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {totalRequirements === 0 ? (
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No special requirements found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                The destinations in your itinerary don't have any specific
                travel requirements or permits registered in our system.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Important:</strong> Your itinerary includes
                      destinations that require {requiredPermits} permit(s).
                      Make sure to obtain all necessary permits before your
                      trip.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {requirementsByDestination.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="px-4 py-5 sm:px-6 bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.destination.name}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {item.requirements.length} requirement(s)
                      </p>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                      <dl className="sm:divide-y sm:divide-gray-200">
                        {item.requirements.map((req, reqIndex) => (
                          <div
                            key={reqIndex}
                            className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                          >
                            <dt className="text-sm font-medium text-gray-500">
                              <div className="flex items-center">
                                {req.isRequired ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                                    Required
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                    Recommended
                                  </span>
                                )}
                                {req.name}
                              </div>
                              <div className="mt-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {req.type.charAt(0).toUpperCase() +
                                    req.type.slice(1)}
                                </span>
                              </div>
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <p>{req.description}</p>

                              {req.cost && req.cost.amount > 0 && (
                                <p className="mt-2">
                                  <span className="font-medium">Cost:</span>{" "}
                                  {req.cost.amount} {req.cost.currency}
                                </p>
                              )}

                              {req.processingTime && (
                                <p className="mt-1">
                                  <span className="font-medium">
                                    Processing time:
                                  </span>{" "}
                                  {req.processingTime}
                                </p>
                              )}

                              {req.validityPeriod && (
                                <p className="mt-1">
                                  <span className="font-medium">Validity:</span>{" "}
                                  {req.validityPeriod}
                                </p>
                              )}

                              {req.applicationProcess && (
                                <p className="mt-2">
                                  <span className="font-medium">
                                    How to apply:
                                  </span>{" "}
                                  {req.applicationProcess}
                                </p>
                              )}

                              {req.applicationUrl && (
                                <p className="mt-2">
                                  <a
                                    href={req.applicationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-500"
                                  >
                                    Apply online
                                  </a>
                                </p>
                              )}

                              {req.notes && (
                                <p className="mt-2 text-sm text-gray-500">
                                  <span className="font-medium">Note:</span>{" "}
                                  {req.notes}
                                </p>
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceChecker;
