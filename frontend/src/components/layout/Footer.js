import { Link, useNavigate } from "react-router-dom";
import { useForm, ValidationError } from "@formspree/react";
import { useState, useCallback } from "react";

const Footer = () => {
  const navigate = useNavigate();

  // Custom Link handler that scrolls to top when clicked
  const handleLinkClick = useCallback(
    (to) => (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        navigate(to);
      }, 500); // Small delay to allow smooth scrolling
    },
    [navigate]
  );
  const [email, setEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formState, handleSubmit] = useForm("xldbndnr");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleTermsChange = (e) => {
    setAcceptTerms(e.target.checked);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert("Please accept the terms to subscribe to our newsletter");
      return;
    }
    await handleSubmit(e);
  };
  return (
    <footer className="bg-primary-900 text-white">
      {/* Main footer content */}
      <div className="w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Company Info */}
          <div className="md:col-span-2">
            <a href="/" onClick={handleLinkClick("/")} className="block">
              <img
                src="/logo.png"
                alt="Aurora Voyages"
                className="h-12 w-auto"
              />
            </a>
            <p className="mt-3 text-xs text-gray-300">
              Your gateway to the breathtaking landscapes and rich cultural
              heritage of Pakistan. Discover the beauty, adventure, and
              hospitality that Pakistan has to offer.
            </p>
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-white mb-2">
                Contact Us
              </h4>
              <p className="text-xs text-gray-300 mb-1">
                <span className="block">123 Travel Street, Islamabad</span>
                <span className="block">Pakistan, 44000</span>
              </p>
              <p className="text-xs text-gray-300">
                <span className="block">
                  Email: auroravoyagesinfo@gmail.com
                </span>
                <span className="block">Phone: +92 51 1234 5678</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/destinations"
                  onClick={handleLinkClick("/destinations")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Destinations
                </a>
              </li>
              <li>
                <a
                  href="/vacations"
                  onClick={handleLinkClick("/vacations")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Vacation Packages
                </a>
              </li>
              <li>
                <a
                  href="/adventure"
                  onClick={handleLinkClick("/adventure")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Adventure Tours
                </a>
              </li>
              <li>
                <a
                  href="/culture"
                  onClick={handleLinkClick("/culture")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Cultural Experiences
                </a>
              </li>
              <li>
                <a
                  href="/scenic-routes"
                  onClick={handleLinkClick("/scenic-routes")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Scenic Routes
                </a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Information
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/safe-travel"
                  onClick={handleLinkClick("/safe-travel")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Safe Travel
                </a>
              </li>
              <li>
                <a
                  href="/visa-info"
                  onClick={handleLinkClick("/visa-info")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Visa Information
                </a>
              </li>
              <li>
                <a
                  href="/weather"
                  onClick={handleLinkClick("/weather")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Weather & Seasons
                </a>
              </li>
              <li>
                <a
                  href="/regulations-culture"
                  onClick={handleLinkClick("/regulations-culture")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Regulations & Culture
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  onClick={handleLinkClick("/faq")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/terms"
                  onClick={handleLinkClick("/terms")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={handleLinkClick("/privacy")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  onClick={handleLinkClick("/cookies")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="/cancellation"
                  onClick={handleLinkClick("/cancellation")}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://facebook.com/auroravoyages"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://instagram.com/auroravoyages"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://twitter.com/auroravoyages"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://youtube.com/auroravoyages"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white mb-2">
                Download Our App
              </h4>
              <div className="flex space-x-4">
                <a href="#" className="block">
                  <img
                    src="/AppStore.svg"
                    alt="Download on App Store"
                    className="h-16"
                  />
                </a>
                <a href="#" className="block">
                  <img
                    src="/PlayStore.svg"
                    alt="Get it on Google Play"
                    className="h-16"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs text-gray-300 mb-4">
              Get the latest news and travel inspiration from Pakistan delivered
              to your inbox.
            </p>

            {formState.succeeded ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-xs w-full max-w-2xl">
                <p className="font-medium text-center">
                  Thanks for joining our newsletter!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleFormSubmit}
                className="w-full max-w-2xl flex flex-col sm:flex-row gap-2"
              >
                <div className="flex-grow">
                  <input
                    type="email"
                    name="email"
                    id="footer-email"
                    autoComplete="email"
                    placeholder="Your email address"
                    className="block w-full py-3 px-4 text-sm placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 border-gray-300"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={formState.errors}
                    className="mt-1 text-red-300 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formState.submitting}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm uppercase tracking-wider font-medium text-primary-700 bg-white hover:bg-gray-100 focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {formState.submitting ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}

            <div className="mt-3 flex items-center">
              <div className="flex-shrink-0">
                <input
                  id="newsletter-footer"
                  name="acceptTerms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  checked={acceptTerms}
                  onChange={handleTermsChange}
                />
              </div>
              <div className="ml-2">
                <p className="text-xs text-gray-300">
                  I accept to receive newsletters and information from Aurora
                  Voyages. See our{" "}
                  <a
                    href="/privacy"
                    onClick={handleLinkClick("/privacy")}
                    className="text-white underline"
                  >
                    privacy policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer with copyright and additional links */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-400 mb-3 md:mb-0">
              &copy; {new Date().getFullYear()} Aurora Voyages. All rights
              reserved.
            </p>
            <div className="flex flex-wrap justify-center space-x-4">
              <a
                href="/terms"
                onClick={handleLinkClick("/terms")}
                className="text-xs text-gray-400 hover:text-white mb-1 md:mb-0"
              >
                Terms of Service
              </a>
              <a
                href="/privacy"
                onClick={handleLinkClick("/privacy")}
                className="text-xs text-gray-400 hover:text-white mb-1 md:mb-0"
              >
                Privacy Policy
              </a>
              <a
                href="/cookies"
                onClick={handleLinkClick("/cookies")}
                className="text-xs text-gray-400 hover:text-white mb-1 md:mb-0"
              >
                Cookie Policy
              </a>
              <a
                href="/sitemap"
                onClick={handleLinkClick("/sitemap")}
                className="text-xs text-gray-400 hover:text-white"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
