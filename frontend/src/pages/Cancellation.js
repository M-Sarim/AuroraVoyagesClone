import React from "react";

const Cancellation = () => {
  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Hero section */}
      <div className="relative bg-primary-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/pakistan_landscape.jpg"
            alt="Pakistan landscape"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cancellation Policy
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Our policies regarding booking cancellations, changes, and refunds.
          </p>
        </div>
      </div>

      {/* Cancellation Policy content */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <h2>1. Introduction</h2>
            <p>
              This Cancellation Policy outlines the terms and conditions
              regarding cancellations, changes, and refunds for bookings made
              through Aurora Voyages. We understand that plans can change, and
              we strive to offer flexible options while maintaining fair
              policies for all parties involved.
            </p>
            <p>
              Please note that this policy applies to bookings made directly
              through Aurora Voyages. For bookings made through third-party
              providers, their respective cancellation policies will apply.
            </p>

            <h2>2. Definitions</h2>
            <ul>
              <li>
                <strong>Booking</strong>: A confirmed reservation for any
                service offered through Aurora Voyages, including but not
                limited to accommodation, tours, transportation, and activities.
              </li>
              <li>
                <strong>Cancellation</strong>: The act of terminating a
                confirmed booking before the service date.
              </li>
              <li>
                <strong>Modification</strong>: Any change to a confirmed
                booking, such as dates, number of travelers, or service type.
              </li>
              <li>
                <strong>Refund</strong>: The return of payment, either partial
                or full, for a cancelled booking.
              </li>
              <li>
                <strong>No-show</strong>: Failure to arrive for a confirmed
                booking without prior cancellation.
              </li>
            </ul>

            <h2>3. General Cancellation Terms</h2>
            <p>Our general cancellation terms are as follows:</p>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Before Service Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Refund Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processing Fee
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    30+ days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    100%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $25 per booking
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    15-29 days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    75%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $25 per booking
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    7-14 days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    50%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $25 per booking
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    3-6 days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    25%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $25 per booking
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    0-2 days or No-show
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    0%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Not applicable
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mt-4">
              <strong>Note</strong>: These are our general terms. Specific
              services may have different cancellation policies, which will be
              clearly communicated during the booking process.
            </p>

            <h2>4. Service-Specific Cancellation Policies</h2>

            <h3>4.1. Accommodation</h3>
            <p>
              Cancellation policies for accommodations vary by property. Each
              accommodation listing on our platform includes its specific
              cancellation policy. Generally, these fall into the following
              categories:
            </p>
            <ul>
              <li>
                <strong>Flexible</strong>: Free cancellation up to 24 hours
                before check-in.
              </li>
              <li>
                <strong>Moderate</strong>: Free cancellation up to 5 days before
                check-in.
              </li>
              <li>
                <strong>Strict</strong>: Free cancellation up to 14 days before
                check-in.
              </li>
              <li>
                <strong>Non-refundable</strong>: No refund regardless of when
                cancelled.
              </li>
            </ul>

            <h3>4.2. Tours and Activities</h3>
            <p>
              For tours and activities, the following cancellation terms
              typically apply:
            </p>
            <ul>
              <li>Cancellation 7+ days before: 90% refund</li>
              <li>Cancellation 3-6 days before: 50% refund</li>
              <li>Cancellation 0-2 days before: No refund</li>
            </ul>
            <p>
              Some specialized tours, particularly those involving extensive
              preparation or limited availability, may have stricter
              cancellation policies.
            </p>

            <h3>4.3. Transportation</h3>
            <p>
              For transportation bookings (private transfers, car rentals,
              etc.), the following terms typically apply:
            </p>
            <ul>
              <li>
                Cancellation 48+ hours before: Full refund minus processing fee
              </li>
              <li>Cancellation 24-48 hours before: 50% refund</li>
              <li>Cancellation less than 24 hours before: No refund</li>
            </ul>

            <h3>4.4. Vacation Packages</h3>
            <p>
              For comprehensive vacation packages, our standard cancellation
              policy applies as outlined in Section 3, unless otherwise
              specified in the package details.
            </p>

            <h2>5. Modifications to Bookings</h2>
            <p>
              Requests to modify bookings are subject to availability and may
              incur additional charges:
            </p>
            <ul>
              <li>
                Date changes: May be accommodated without penalty if requested
                at least 14 days before the original service date, subject to
                availability.
              </li>
              <li>
                Service upgrades: Generally accommodated without penalty, with
                payment of any price difference.
              </li>
              <li>
                Service downgrades: May be accommodated, but refunds will be
                subject to the cancellation policy percentages.
              </li>
              <li>
                Traveler changes: May be accommodated without penalty if the
                total number of travelers remains the same.
              </li>
            </ul>

            <h2>6. Force Majeure</h2>
            <p>
              In cases of force majeure (natural disasters, political unrest,
              pandemic-related restrictions, etc.), we will work with you to
              reschedule your booking without penalty or provide a credit for
              future use. If neither option is feasible, we will process a
              refund according to our ability to recover costs from service
              providers.
            </p>

            <h2>7. Cancellation Process</h2>
            <p>To cancel a booking, you must:</p>
            <ol>
              <li>Log in to your Aurora Voyages account</li>
              <li>Navigate to "My Bookings"</li>
              <li>Select the booking you wish to cancel</li>
              <li>Click the "Cancel Booking" button and follow the prompts</li>
            </ol>
            <p>
              Alternatively, you can contact our customer service team at
              auroravoyagesinfo@gmail.com or call +92 51 1234 5678.
            </p>

            <h2>8. Refund Processing</h2>
            <p>
              Refunds will be processed to the original payment method used for
              the booking. Processing times vary:
            </p>
            <ul>
              <li>Credit/debit cards: 7-14 business days</li>
              <li>PayPal: 3-5 business days</li>
              <li>Bank transfers: 7-21 business days</li>
            </ul>

            <h2>9. Travel Insurance</h2>
            <p>
              We strongly recommend purchasing comprehensive travel insurance
              that includes cancellation coverage. Travel insurance can provide
              reimbursement for non-refundable expenses in case you need to
              cancel for covered reasons such as illness, injury, or other
              unforeseen circumstances.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              If you have any questions about our Cancellation Policy, please
              contact us at:
            </p>
            <p>
              Aurora Voyages
              <br />
              123 Travel Street, Islamabad
              <br />
              Pakistan, 44000
              <br />
              Email: auroravoyagesinfo@gmail.com
              <br />
              Phone: +92 51 1234 5678
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancellation;
