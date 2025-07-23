import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import api from '../../utils/api';

const TourGuideRegister = () => {
  const [formData, setFormData] = useState({
    phone: '',
    languages: '',
    specialties: '',
    experience: '',
    bio: '',
    company: '',
    image: '',
  });
  const [companies, setCompanies] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user, registerAsTourGuide, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any previous errors
    clearError();

    // If user is already a tour guide, redirect to tour guide dashboard
    if (user?.role === 'tourGuide') {
      navigate('/tour-guide/dashboard');
    }

    // If user has a pending tour guide application
    if (user?.role === 'pendingTourGuide') {
      navigate('/dashboard');
    }

    // Fetch companies for dropdown
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies');
        setCompanies(res.data);
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
      setIsLoading(false);
    };

    fetchCompanies();
  }, [user, navigate, clearError]);

  const { phone, languages, specialties, experience, bio, company, image } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field-specific error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};

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
      errors.experience = 'Experience is required';
    }

    if (!bio) {
      errors.bio = 'Bio is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Format languages and specialties as arrays
        const formattedData = {
          ...formData,
          languages: languages.split(',').map(lang => lang.trim()),
          specialties: specialties.split(',').map(spec => spec.trim()),
        };

        const result = await registerAsTourGuide(formattedData);
        alert(result.message || "Your application has been submitted. An admin will review it shortly.");
        navigate('/dashboard');
      } catch (err) {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Become a Tour Guide
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Share your expertise and earn by creating and leading tour packages.
          </p>
        </div>

        {error && (
          <div className="mt-8 bg-red-50 border-l-4 border-red-400 p-4">
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

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={phone}
                    onChange={onChange}
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.phone ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
                    Languages (comma separated)
                  </label>
                  <input
                    type="text"
                    name="languages"
                    id="languages"
                    value={languages}
                    onChange={onChange}
                    placeholder="English, Urdu, Punjabi"
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.languages ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formErrors.languages && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.languages}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label htmlFor="specialties" className="block text-sm font-medium text-gray-700">
                    Specialties (comma separated)
                  </label>
                  <input
                    type="text"
                    name="specialties"
                    id="specialties"
                    value={specialties}
                    onChange={onChange}
                    placeholder="Hiking, Cultural Tours, Food Tours"
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.specialties ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formErrors.specialties && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.specialties}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    id="experience"
                    min="0"
                    value={experience}
                    onChange={onChange}
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.experience ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formErrors.experience && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.experience}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company (Optional)
                  </label>
                  <select
                    id="company"
                    name="company"
                    value={company}
                    onChange={onChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">-- Select a company --</option>
                    {companies.map((comp) => (
                      <option key={comp._id} value={comp._id}>
                        {comp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Profile Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    name="image"
                    id="image"
                    value={image}
                    onChange={onChange}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={bio}
                    onChange={onChange}
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.bio ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                    placeholder="Tell us about your experience, expertise, and why you'd make a great tour guide."
                  />
                  {formErrors.bio && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.bio}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Register as Tour Guide'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourGuideRegister;
