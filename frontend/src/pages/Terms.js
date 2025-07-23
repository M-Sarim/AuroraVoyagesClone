import React from "react";

const Terms = () => {
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
            Terms of Service
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Please read these terms carefully before using Aurora Voyages
            services.
          </p>
        </div>
      </div>

      {/* Terms content */}
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
              Welcome to Aurora Voyages. These Terms of Service ("Terms") govern
              your use of the Aurora Voyages website, mobile application, and
              services (collectively, the "Services"). By accessing or using our
              Services, you agree to be bound by these Terms. If you do not
              agree to these Terms, please do not use our Services.
            </p>

            <h2>2. Definitions</h2>
            <p>
              <strong>"Aurora Voyages"</strong>, <strong>"we"</strong>,{" "}
              <strong>"us"</strong>, or <strong>"our"</strong> refers to Aurora
              Voyages, the company operating this platform.
            </p>
            <p>
              <strong>"User"</strong>, <strong>"you"</strong>, or{" "}
              <strong>"your"</strong> refers to any individual or entity that
              accesses or uses our Services.
            </p>
            <p>
              <strong>"Content"</strong> refers to all information, text,
              images, data, links, software, or other material that Aurora
              Voyages provides through the Services, or that users submit, post,
              or share through the Services.
            </p>

            <h2>3. Account Registration</h2>
            <p>
              To access certain features of our Services, you may need to create
              an account. You agree to provide accurate, current, and complete
              information during the registration process and to update such
              information to keep it accurate, current, and complete. You are
              responsible for safeguarding your password and for all activities
              that occur under your account. You agree to notify us immediately
              of any unauthorized use of your account.
            </p>

            <h2>4. Booking and Reservations</h2>
            <p>
              4.1. <strong>Booking Process</strong>: When you make a booking
              through our Services, you agree to provide accurate and complete
              information for all travelers included in the booking.
            </p>
            <p>
              4.2. <strong>Confirmation</strong>: A booking is not confirmed
              until you receive a confirmation notice from us, usually via
              email. Please review all details in the confirmation for accuracy.
            </p>
            <p>
              4.3. <strong>Pricing and Payments</strong>: All prices are
              displayed in the currency indicated and are subject to change
              until your booking is confirmed. Payment terms are specified
              during the booking process.
            </p>
            <p>
              4.4. <strong>Cancellations and Refunds</strong>: Cancellation and
              refund policies vary depending on the service provider and are
              specified during the booking process. Please review these policies
              carefully before completing your booking.
            </p>

            <h2>5. User Conduct</h2>
            <p>You agree not to use our Services to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe the rights of others</li>
              <li>Submit false or misleading information</li>
              <li>Upload or transmit viruses or malicious code</li>
              <li>Interfere with the proper working of the Services</li>
              <li>
                Attempt to gain unauthorized access to our systems or user
                accounts
              </li>
              <li>Harass, abuse, or harm another person</li>
              <li>Send spam or other unsolicited communications</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>
              6.1. <strong>Our Content</strong>: All content provided through
              our Services, including but not limited to text, graphics, logos,
              images, and software, is owned by Aurora Voyages or our licensors
              and is protected by copyright, trademark, and other intellectual
              property laws.
            </p>
            <p>
              6.2. <strong>Limited License</strong>: We grant you a limited,
              non-exclusive, non-transferable, and revocable license to access
              and use our Services and Content for personal, non-commercial
              purposes.
            </p>
            <p>
              6.3. <strong>User Content</strong>: By submitting content to our
              Services (such as reviews, photos, or forum posts), you grant
              Aurora Voyages a worldwide, non-exclusive, royalty-free license to
              use, reproduce, modify, adapt, publish, translate, and distribute
              such content in connection with our Services.
            </p>

            <h2>7. Disclaimers</h2>
            <p>
              7.1. <strong>Service Providers</strong>: Aurora Voyages acts as an
              intermediary between users and third-party service providers (such
              as hotels, tour operators, and transportation providers). We are
              not responsible for the actions, omissions, or policies of these
              service providers.
            </p>
            <p>
              7.2. <strong>Travel Information</strong>: While we strive to
              provide accurate and up-to-date information, we cannot guarantee
              the accuracy, completeness, or reliability of any travel
              information provided through our Services. Users should verify
              critical information with relevant authorities or service
              providers.
            </p>
            <p>
              7.3. <strong>As-Is Basis</strong>: Our Services are provided on an
              "as is" and "as available" basis, without warranties of any kind,
              either express or implied.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Aurora Voyages shall not
              be liable for any indirect, incidental, special, consequential, or
              punitive damages, including but not limited to loss of profits,
              data, or use, arising out of or in connection with your use of our
              Services.
            </p>

            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Aurora Voyages and its
              officers, directors, employees, and agents from any claims,
              liabilities, damages, losses, and expenses (including legal fees)
              arising from or related to your use of our Services or violation
              of these Terms.
            </p>

            <h2>10. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will
              provide notice of significant changes by posting the updated Terms
              on our website or through other appropriate means. Your continued
              use of our Services after such modifications constitutes your
              acceptance of the updated Terms.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of Pakistan, without regard to its conflict of law
              provisions.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              Aurora Voyages
              <br />
              123 Travel Street, Islamabad
              <br />
              Pakistan, 44000
              <br />
              Email: auroravoyagesinfo@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
