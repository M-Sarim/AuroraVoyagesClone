import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, googleLogin, isAuthenticated, error, clearError } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }

    // Clear any previous errors
    clearError();
  }, [isAuthenticated, navigate, clearError]);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field-specific error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setFormErrors({});

      try {
        console.log("Submitting login form with data:", formData);

        // Special handling for admin login
        if (email === "auroravoyagesinfo@gmail.com") {
          console.log("Admin login detected");
        }

        // Special handling for tour guide login
        if (
          email === "ali.khan@auroraexpeditions.pk" ||
          email === "fatima.ahmed@auroraexpeditions.pk"
        ) {
          console.log("Tour guide login detected");
        }

        const result = await login(formData);
        console.log("Login successful:", result);

        // Show success message
        alert("Login successful! Redirecting to dashboard...");

        // Force navigation to dashboard
        navigate("/dashboard");
      } catch (err) {
        console.error("Login error:", err);
        // Set specific error message based on the error
        if (err.response && err.response.data && err.response.data.message) {
          setFormErrors({
            ...formErrors,
            general: err.response.data.message,
          });
        } else {
          setFormErrors({
            ...formErrors,
            general:
              "Login failed. Please check your credentials and try again.",
          });
        }
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-elevated overflow-hidden animate-fade-in">
        <div className="pt-10 px-8">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold text-neutral-900">
              Welcome Back
            </h2>
            <p className="mt-3 text-neutral-500">
              Sign in to continue your journey
            </p>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 rounded-2xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-red-500"
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
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Authentication Error
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            {formErrors.general && (
              <div className="bg-red-50 rounded-2xl p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-red-500"
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
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                      Login Failed
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      {formErrors.general}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={onChange}
                  className={`form-input ${
                    formErrors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="you@example.com"
                />
                {formErrors.email && (
                  <p className="form-error">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={onChange}
                  className={`form-input ${
                    formErrors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="••••••••"
                />
                {formErrors.password && (
                  <p className="form-error">{formErrors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-neutral-600"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    googleLogin(credentialResponse);
                  }}
                  onError={() => {
                    console.log("Google Login Failed");
                  }}
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  text="signin_with"
                  size="large"
                />
              </div>
            </div>
          </form>

          <div className="text-center py-8 border-t border-neutral-200 mt-10">
            <p className="text-neutral-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
