import React from "react";

const Cookies = () => {
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
            Cookie Policy
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            How we use cookies and similar technologies on our website.
          </p>
        </div>
      </div>

      {/* Cookie Policy content */}
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
              This Cookie Policy explains how Aurora Voyages ("we", "us", or
              "our") uses cookies and similar technologies when you visit our
              website, mobile application, or interact with our online services
              (collectively, the "Services"). This policy provides you with
              information about what cookies are, what types of cookies we use,
              how we use them, and how you can control your cookie preferences.
            </p>
            <p>
              By using our Services, you consent to the use of cookies in
              accordance with this Cookie Policy. If you do not accept the use
              of cookies, please disable them as described in this policy or
              refrain from using our Services.
            </p>

            <h2>2. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device
              (computer, tablet, or mobile) when you visit a website. They are
              widely used to make websites work more efficiently, provide a
              better user experience, and give website owners information about
              how users interact with their site.
            </p>
            <p>
              Cookies are not harmful and do not contain viruses or personal
              information like credit card details. They simply help websites
              remember your preferences and activities.
            </p>

            <h2>3. Types of Cookies We Use</h2>
            <p>We use different types of cookies for various purposes:</p>

            <h3>3.1. Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly.
              They enable basic functions like page navigation, secure areas
              access, and remembering your preferences. The website cannot
              function properly without these cookies, and they cannot be
              disabled.
            </p>

            <h3>3.2. Performance Cookies</h3>
            <p>
              These cookies collect information about how visitors use our
              website, such as which pages they visit most often and if they
              receive error messages. They help us improve how our website works
              and measure the effectiveness of our advertising. All information
              these cookies collect is aggregated and anonymous.
            </p>

            <h3>3.3. Functionality Cookies</h3>
            <p>
              These cookies allow the website to remember choices you make (such
              as your username, language, or region) and provide enhanced, more
              personal features. They may also be used to provide services you
              have requested, like watching a video or commenting on a blog.
            </p>

            <h3>3.4. Targeting/Advertising Cookies</h3>
            <p>
              These cookies are used to deliver advertisements more relevant to
              you and your interests. They are also used to limit the number of
              times you see an advertisement and help measure the effectiveness
              of advertising campaigns. They remember that you have visited a
              website and this information may be shared with other
              organizations, such as advertisers.
            </p>

            <h3>3.5. Third-Party Cookies</h3>
            <p>
              Some cookies are placed by third parties on our website. These
              third parties may include analytics providers (like Google
              Analytics), advertising networks, and social media platforms.
              These third parties may use cookies, web beacons, and similar
              technologies to collect information about your use of our Services
              and other websites.
            </p>

            <h2>4. Specific Cookies We Use</h2>
            <p>Here are some of the specific cookies we use on our website:</p>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cookie Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    _session_id
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Essential
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Maintains your session while you browse our website
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Session
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    _ga
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Performance
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Used by Google Analytics to distinguish users
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2 years
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    _gid
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Performance
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Used by Google Analytics to distinguish users
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    24 hours
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    _fbp
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Targeting
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Used by Facebook to deliver advertisements
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    3 months
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    user_preferences
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Functionality
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Remembers your preferences (language, currency, etc.)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    1 year
                  </td>
                </tr>
              </tbody>
            </table>

            <h2>5. How to Control Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their
              settings preferences. Here's how you can manage cookies in
              different browsers:
            </p>

            <h3>5.1. Browser Settings</h3>
            <ul>
              <li>
                <strong>Google Chrome</strong>: Menu > Settings > Privacy and
                security > Cookies and other site data
              </li>
              <li>
                <strong>Mozilla Firefox</strong>: Menu > Options > Privacy &
                Security > Cookies and Site Data
              </li>
              <li>
                <strong>Safari</strong>: Preferences > Privacy > Cookies and
                website data
              </li>
              <li>
                <strong>Microsoft Edge</strong>: Menu > Settings > Cookies and
                site permissions > Cookies and site data
              </li>
            </ul>

            <h3>5.2. Opt-Out Tools</h3>
            <p>
              You can also use these tools to opt out of certain types of
              cookies:
            </p>
            <ul>
              <li>
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
              <li>
                <a
                  href="https://www.youronlinechoices.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Your Online Choices
                </a>{" "}
                (for EU users)
              </li>
              <li>
                <a
                  href="https://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Network Advertising Initiative Opt-out
                </a>
              </li>
            </ul>

            <p>
              Please note that restricting cookies may impact your experience on
              our website, as some features may not function properly.
            </p>

            <h2>6. Similar Technologies</h2>
            <p>
              In addition to cookies, we may use other similar technologies on
              our Services:
            </p>
            <ul>
              <li>
                <strong>Web Beacons</strong>: Small graphic images (also known
                as "pixel tags" or "clear GIFs") that may be included on our
                Services and used to track user navigation and web browsing
                behavior.
              </li>
              <li>
                <strong>Local Storage</strong>: Technologies like HTML5
                localStorage and IndexedDB that provide web browsers with data
                storage capabilities.
              </li>
              <li>
                <strong>Session Replay</strong>: Technologies that record and
                replay user sessions to help us understand how users interact
                with our Services.
              </li>
            </ul>

            <h2>7. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect
              changes in technology, regulation, or our business practices. Any
              changes will be posted on this page with an updated revision date.
              Please check back periodically to stay informed about our use of
              cookies.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie
              Policy, please contact us at:
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

export default Cookies;
