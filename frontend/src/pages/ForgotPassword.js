import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [retryCount, setRetryCount] = useState(0);
  const [retryTimeout, setRetryTimeout] = useState(null);
  const { forgotPassword } = useContext(AuthContext);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryTimeout]);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle retry with exponential backoff
  const handleRetry = () => {
    // Calculate backoff time (2^retryCount seconds, max 30 seconds)
    const backoffTime = Math.min(Math.pow(2, retryCount) * 1000, 30000);

    setMessage({
      type: "info",
      text: `Retrying in ${backoffTime / 1000} seconds...`,
    });

    // Set timeout for retry
    const timeout = setTimeout(() => {
      handleSubmit(null, true);
    }, backoffTime);

    setRetryTimeout(timeout);
  };

  const handleSubmit = async (e, isRetry = false) => {
    // Prevent form submission if this is a normal submit (not a retry)
    if (e && !isRetry) {
      e.preventDefault();
    }

    // Clear any existing retry timeout
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      setRetryTimeout(null);
    }

    // Validate email
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    if (!isValidEmail(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setIsSubmitting(true);
    if (!isRetry) {
      setMessage({ type: "", text: "" });
      // Reset retry count on fresh submission
      setRetryCount(0);
    } else {
      // Increment retry count
      setRetryCount((prev) => prev + 1);
    }

    try {
      const response = await forgotPassword(email);

      if (response.success) {
        // Check if we're in test mode (using Ethereal Email)
        if (response.testMode && response.previewUrl) {
          setMessage({
            type: "success",
            text: "Test email sent. Check the console for the preview URL or click the button below to view it.",
          });

          // Open the preview URL in a new tab
          window.open(response.previewUrl, "_blank");

          console.log("Email preview URL:", response.previewUrl);
        } else {
          setMessage({
            type: "success",
            text: "Password reset link has been sent to your email. Please check your inbox and spam folder.",
          });
        }
        setEmail("");
        // Reset retry count on success
        setRetryCount(0);
      } else {
        setMessage({
          type: "error",
          text:
            response.message || "Failed to send reset link. Please try again.",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      // Determine if we should offer retry
      const canRetry = retryCount < 3; // Limit to 3 retries
      const retryText = canRetry
        ? " Retrying automatically..."
        : " Maximum retry attempts reached.";

      if (error.response && error.response.status === 404) {
        setMessage({
          type: "error",
          text: "No account found with this email address.",
        });
      } else if (error.response?.data?.code === "EMAIL_RATE_LIMIT") {
        setMessage({
          type: "error",
          text: "Too many requests. Please try again in a few minutes.",
        });
      } else if (
        error.response?.data?.code === "EMAIL_NETWORK_ERROR" ||
        error.response?.data?.code === "EMAIL_CONNECTION_REFUSED" ||
        error.response?.data?.code === "EMAIL_TIMEOUT"
      ) {
        setMessage({
          type: "error",
          text:
            (error.response?.data?.message ||
              "Network error. Please check your connection.") +
            (canRetry ? retryText : ""),
        });

        // Auto-retry for network errors
        if (canRetry) {
          handleRetry();
        }
      } else {
        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "An error occurred. Please try again later." +
              (canRetry && error.response?.status >= 500 ? retryText : ""),
        });

        // Auto-retry for server errors (5xx)
        if (canRetry && error.response?.status >= 500) {
          handleRetry();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-elevated overflow-hidden animate-fade-in">
        <div className="pt-10 px-8 pb-8">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold text-neutral-900">
              Forgot Password
            </h2>
            <p className="mt-3 text-neutral-500">
              Enter your email address and we'll send you a link to reset your
              password
            </p>
          </div>

          {message.text && (
            <div
              className={`mt-6 rounded-2xl p-4 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : message.type === "info"
                  ? "bg-blue-50 text-blue-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <div
                    className={`h-10 w-10 rounded-full ${
                      message.type === "success"
                        ? "bg-green-100 text-green-500"
                        : message.type === "info"
                        ? "bg-blue-100 text-blue-500"
                        : "bg-red-100 text-red-500"
                    } flex items-center justify-center`}
                  >
                    {message.type === "success" ? (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : message.type === "info" ? (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium">
                    {message.type === "success"
                      ? "Success"
                      : message.type === "info"
                      ? "Information"
                      : "Error"}
                  </h3>
                  <p className="mt-1 text-sm">{message.text}</p>

                  {/* Add manual retry button for errors */}
                  {message.type === "error" && (
                    <button
                      onClick={() => handleSubmit(null, true)}
                      disabled={isSubmitting || retryCount >= 3}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {isSubmitting ? "Retrying..." : "Retry Now"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150"
                placeholder="your.email@example.com"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
