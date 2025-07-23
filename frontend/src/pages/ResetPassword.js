import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyResetToken, resetPassword } = useContext(AuthContext);

  useEffect(() => {
    // Extract token and email from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");
    const emailParam = queryParams.get("email");

    if (!tokenParam || !emailParam) {
      setMessage({
        type: "error",
        text: "Invalid reset link. Please request a new password reset link.",
      });
      setIsVerifying(false);
      return;
    }

    setToken(tokenParam);
    setEmail(emailParam);

    // Verify the token
    const verifyToken = async () => {
      try {
        const response = await verifyResetToken(tokenParam, emailParam);

        if (response.success) {
          setIsVerifying(false);
        } else {
          setMessage({
            type: "error",
            text:
              response.message ||
              "Invalid or expired reset link. Please request a new one.",
          });
          setIsVerifying(false);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Invalid or expired reset link. Please request a new one.",
        });
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [location.search, verifyResetToken]);

  const { password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!password) {
      setMessage({ type: "error", text: "Password is required" });
      return false;
    }

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return false;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await resetPassword(token, email, password);

      if (response.success) {
        setMessage({
          type: "success",
          text: "Your password has been reset successfully. You can now log in with your new password.",
        });

        // Clear form
        setFormData({
          password: "",
          confirmPassword: "",
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text:
            response.message || "Failed to reset password. Please try again.",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-elevated overflow-hidden animate-fade-in p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-primary-200 h-16 w-16 flex items-center justify-center mb-4">
              <svg
                className="h-8 w-8 text-primary-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-heading font-semibold text-neutral-900 mb-2">
              Verifying Reset Link
            </h2>
            <p className="text-neutral-500">
              Please wait while we verify your password reset link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "error" && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-elevated overflow-hidden animate-fade-in p-8">
          <div className="text-center">
            <div className="rounded-full bg-red-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-8 w-8 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-heading font-semibold text-neutral-900 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-neutral-500 mb-6">{message.text}</p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-elevated overflow-hidden animate-fade-in">
        <div className="pt-10 px-8 pb-8">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold text-neutral-900">
              Reset Your Password
            </h2>
            <p className="mt-3 text-neutral-500">
              Please enter your new password below
            </p>
          </div>

          {message.text && (
            <div
              className={`mt-6 rounded-2xl p-4 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <div
                    className={`h-10 w-10 rounded-full ${
                      message.type === "success"
                        ? "bg-green-100 text-green-500"
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
                    {message.type === "success" ? "Success" : "Error"}
                  </h3>
                  <p className="mt-1 text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={onChange}
                className="appearance-none block w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={onChange}
                className="appearance-none block w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150"
                placeholder="••••••••"
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
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
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

export default ResetPassword;
