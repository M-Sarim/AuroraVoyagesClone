import React from "react";

const Privacy = () => {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            How we collect, use, and protect your personal information.
          </p>
        </div>
      </div>

      {/* Privacy content */}
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
              At Aurora Voyages, we respect your privacy and are committed to
              protecting your personal information. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when
              you use our website, mobile application, and services
              (collectively, the "Services").
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using
              our Services, you acknowledge that you have read, understood, and
              agree to be bound by this Privacy Policy. If you do not agree with
              our policies and practices, please do not use our Services.
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              We collect several types of information from and about users of
              our Services, including:
            </p>
            <h3>2.1. Personal Information</h3>
            <p>
              Personal information is data that can be used to identify you
              individually. This may include:
            </p>
            <ul>
              <li>
                Contact information (name, email address, phone number, postal
                address)
              </li>
              <li>Account credentials (username, password)</li>
              <li>
                Payment information (credit card details, billing address)
              </li>
              <li>
                Identification information (passport details, national ID)
              </li>
              <li>Travel preferences and requirements</li>
              <li>Demographic information (age, gender, nationality)</li>
            </ul>

            <h3>2.2. Non-Personal Information</h3>
            <p>
              We also collect non-personal information that does not directly
              identify you, such as:
            </p>
            <ul>
              <li>Browser and device information</li>
              <li>IP address</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>Location data (with your consent)</li>
              <li>Aggregated or anonymized data</li>
            </ul>

            <h2>3. How We Collect Information</h2>
            <p>We collect information through various methods, including:</p>
            <ul>
              <li>
                Direct interactions (when you create an account, make a booking,
                or contact us)
              </li>
              <li>
                Automated technologies (cookies, web beacons, tracking
                technologies)
              </li>
              <li>
                Third-party sources (business partners, service providers)
              </li>
            </ul>

            <h2>4. How We Use Your Information</h2>
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul>
              <li>Providing and improving our Services</li>
              <li>Processing bookings and payments</li>
              <li>Communicating with you about your account or bookings</li>
              <li>
                Sending promotional materials and newsletters (with your
                consent)
              </li>
              <li>Personalizing your experience</li>
              <li>Analyzing usage patterns to improve our Services</li>
              <li>Ensuring the security of our Services</li>
              <li>Complying with legal obligations</li>
            </ul>

            <h2>5. Disclosure of Your Information</h2>
            <p>We may disclose your personal information to:</p>
            <ul>
              <li>
                Service providers (hotels, tour operators, transportation
                providers) to fulfill your bookings
              </li>
              <li>Payment processors to process transactions</li>
              <li>
                Business partners for joint marketing efforts or promotions
              </li>
              <li>Professional advisors (lawyers, accountants, insurers)</li>
              <li>Government authorities when required by law</li>
              <li>Affiliated companies within our corporate family</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information from unauthorized access,
              disclosure, alteration, or destruction. However, no method of
              transmission over the Internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>

            <h2>7. Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul>
              <li>
                Access: You can request access to your personal information we
                hold.
              </li>
              <li>
                Correction: You can request that we correct inaccurate or
                incomplete information.
              </li>
              <li>
                Deletion: You can request that we delete your personal
                information in certain circumstances.
              </li>
              <li>
                Restriction: You can request that we restrict the processing of
                your information.
              </li>
              <li>
                Data portability: You can request a copy of your information in
                a structured, commonly used format.
              </li>
              <li>
                Objection: You can object to our processing of your information
                in certain circumstances.
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information
              provided in the "Contact Us" section.
            </p>

            <h2>8. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect
              information about your browsing activities and to personalize your
              experience on our Services. You can control cookies through your
              browser settings, but disabling cookies may limit your ability to
              use certain features of our Services.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our Services are not intended for children under 13 years of age,
              and we do not knowingly collect personal information from children
              under 13. If we learn that we have collected personal information
              from a child under 13, we will promptly delete that information.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your country of residence, which may have different
              data protection laws. We ensure appropriate safeguards are in
              place to protect your information when it is transferred
              internationally.
            </p>

            <h2>11. Changes to Our Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date. You are advised to review
              this Privacy Policy periodically for any changes.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or
              our privacy practices, please contact us at:
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

export default Privacy;
