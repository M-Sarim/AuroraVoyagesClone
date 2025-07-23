import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isTourGuide: false,
    phone: '',
    languages: '',
    specialties: '',
    experience: '',
    bio: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [showTourGuideFields, setShowTourGuideFields] = useState(false);

  const { register, googleLogin, isAuthenticated, error, clearError } = useContext(AuthContext);

  // Fetch companies for tour guide registration
  useEffect(() => {
    if (showTourGuideFields) {
      const fetchCompanies = async () => {
        try {
          const res = await api.get('/companies');
          setCompanies(res.data);
        } catch (err) {
          console.error('Error fetching companies:', err);
        }
      };
      fetchCompanies();
    }
  }, [showTourGuideFields]);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    // Clear any previous errors
    clearError();
  }, [isAuthenticated, navigate, clearError]);

  const {
    name,
    email,
    password,
    confirmPassword,
    isTourGuide,
    phone,
    languages,
    specialties,
    experience,
    bio,
    company
  } = formData;

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    // If toggling the tour guide checkbox, update the showTourGuideFields state
    if (e.target.name === 'isTourGuide') {
      setShowTourGuideFields(value);
    }

    setFormData({ ...formData, [e.target.name]: value });

    // Clear field-specific error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!name) {
      errors.name = 'Name is required';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Validate tour guide fields if the user is signing up as a tour guide
    if (isTourGuide) {
      if (!phone) {
        errors.phone = 'Phone number is required';
      }

      if (!languages) {
        errors.languages = 'At least one language is required';
      }

      if (!specialties) {
        errors.specialties = 'At least one specialty is required';
      }

      if (!experience) {
        errors.experience = 'Years of experience is required';
      } else if (isNaN(experience) || parseInt(experience) < 0) {
        errors.experience = 'Experience must be a positive number';
      }

      if (!bio) {
        errors.bio = 'Bio is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...registerData } = formData;

        // If registering as a tour guide, format the data properly
        if (isTourGuide) {
          // Format languages and specialties as arrays
          registerData.languages = languages.split(',').map(lang => lang.trim());
          registerData.specialties = specialties.split(',').map(spec => spec.trim());

          // Convert experience to number
          registerData.experience = parseInt(experience);
        }

        await register(registerData);
        // Redirect will happen automatically due to useEffect
      } catch (err) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-6 px-6">
          <h2 className="text-center text-3xl font-bold text-white">
            Join Aurora Voyages
          </h2>
          <p className="mt-2 text-center text-sm text-white/80">
            Create your account to start your journey
          </p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={onChange}
                  className={`appearance-none block w-full px-4 py-3 border ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150`}
                  placeholder="John Doe"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={onChange}
                  className={`appearance-none block w-full px-4 py-3 border ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150`}
                  placeholder="you@example.com"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={onChange}
                  className={`appearance-none block w-full px-4 py-3 border ${
                    formErrors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150`}
                  placeholder="••••••••"
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={onChange}
                  className={`appearance-none block w-full px-4 py-3 border ${
                    formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150`}
                  placeholder="••••••••"
                />
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>

              {/* Tour Guide Option */}
              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    id="isTourGuide"
                    name="isTourGuide"
                    type="checkbox"
                    checked={isTourGuide}
                    onChange={onChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isTourGuide" className="ml-2 block text-sm text-gray-700">
                    Sign up as a Tour Guide
                  </label>
                </div>
              </div>

              {/* Tour Guide Fields (conditionally rendered) */}
              {showTourGuideFields && (
                <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900">Tour Guide Information</h3>
                  <p className="text-sm text-gray-500">Please provide your professional details.</p>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={onChange}
                      className={`appearance-none block w-full px-4 py-3 border ${
                        formErrors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-1">
                      Languages (comma separated)
                    </label>
                    <input
                      id="languages"
                      name="languages"
                      type="text"
                      value={languages}
                      onChange={onChange}
                      className={`appearance-none block w-full px-4 py-3 border ${
                        formErrors.languages ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150`}
                      placeholder="English, Urdu, Punjabi"
                    />
                    {formErrors.languages && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.languages}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialties (comma separated)
                    </label>
                    <input
                      id="specialties"
                      name="specialties"
                      type="text"
                      value={specialties}
                      onChange={onChange}
                      className={`appearance-none block w-full px-4 py-3 border ${
                        formErrors.specialties ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150`}
                      placeholder="Mountain Trekking, Cultural Tours, Photography"
                    />
                    {formErrors.specialties && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.specialties}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      id="experience"
                      name="experience"
                      type="number"
                      min="0"
                      value={experience}
                      onChange={onChange}
                      className={`appearance-none block w-full px-4 py-3 border ${
                        formErrors.experience ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150`}
                      placeholder="5"
                    />
                    {formErrors.experience && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.experience}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows="3"
                      value={bio}
                      onChange={onChange}
                      className={`appearance-none block w-full px-4 py-3 border ${
                        formErrors.bio ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150`}
                      placeholder="Tell us about your experience as a tour guide..."
                    ></textarea>
                    {formErrors.bio && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.bio}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company (Optional)
                    </label>
                    <select
                      id="company"
                      name="company"
                      value={company || ''}
                      onChange={onChange}
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150"
                    >
                      <option value="">Select a company (optional)</option>
                      {companies.map((comp) => (
                        <option key={comp._id} value={comp._id}>
                          {comp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition duration-150 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    googleLogin(credentialResponse);
                  }}
                  onError={() => {
                    console.log('Google Sign Up Failed');
                  }}
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  text="signup_with"
                  size="large"
                />
              </div>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition duration-150">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
