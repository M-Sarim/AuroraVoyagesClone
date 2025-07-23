import React from "react";
import { Link } from "react-router-dom";

const BookingSuccessModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Success header */}
          <div className="bg-green-100 px-4 py-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Booking Confirmed!
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Your booking has been successfully confirmed. You will
                    receive a confirmation email shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking details */}
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Booking Reference
                </h4>
                <p className="mt-1 text-sm text-gray-900">{booking._id}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Booking Details
                </h4>
                <div className="mt-1 bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className="text-sm font-medium text-green-600 capitalize">
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Total Price:</span>
                    <span className="text-sm font-medium">
                      ${booking.totalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Passengers:</span>
                    <span className="text-sm font-medium">
                      {booking.passengers || 1}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Next Steps
                </h4>
                <ul className="mt-1 text-sm text-gray-500 list-disc list-inside space-y-1">
                  <li>Check your email for booking confirmation</li>
                  <li>Review your booking details in your account</li>
                  <li>Contact customer support if you have any questions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Link
              to={`/bookings/${booking._id}`}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              View Booking Details
            </Link>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
