import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const SubmitPackage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    destinations: [],
    duration: '',
    price: '',
    activities: '',
    includedTransport: '',
    includedHotels: '',
    includedMeals: '',
    schedule: [],
    images: '',
  });

  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/destinations');
        setAvailableDestinations(res.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load destinations');
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const {
    name,
    description,
    destinations,
    duration,
    price,
    activities,
    includedTransport,
    includedHotels,
    includedMeals,
    schedule,
    images
  } = formData;

  const onChange = (e) => {
    if (e.target.name === 'destinations') {
      // Handle multiple select for destinations
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({ ...formData, destinations: selectedOptions });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    // Clear field-specific error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const addScheduleDay = () => {
    setFormData({
      ...formData,
      schedule: [
        ...schedule,
        { day: schedule.length + 1, activities: '', meals: '', accommodation: '' }
      ]
    });
  };

  const updateScheduleDay = (index, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const removeScheduleDay = (index) => {
    const updatedSchedule = [...schedule];
    updatedSchedule.splice(index, 1);
    // Renumber days
    const renumberedSchedule = updatedSchedule.map((day, idx) => ({
      ...day,
      day: idx + 1
    }));
    setFormData({ ...formData, schedule: renumberedSchedule });
  };

  const validateForm = () => {
    const errors = {};

    if (!name) errors.name = 'Package name is required';
    if (!description) errors.description = 'Description is required';
    if (destinations.length === 0) errors.destinations = 'At least one destination is required';
    if (!duration) errors.duration = 'Duration is required';
    if (!price) errors.price = 'Price is required';
    if (!activities) errors.activities = 'Activities are required';
    if (!includedTransport) errors.includedTransport = 'Transport information is required';
    if (!includedHotels) errors.includedHotels = 'Hotel information is required';
    if (!includedMeals) errors.includedMeals = 'Meal information is required';
    if (schedule.length === 0) errors.schedule = 'At least one day in the schedule is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Format the data
        const packageData = {
          ...formData,
          // Convert comma-separated images to array
          images: images.split(',').map(img => img.trim()).filter(img => img),
          // Format activities as array
          activities: activities.split(',').map(activity => activity.trim()),
        };

        await api.post('/vacations/submit', packageData);
        setSuccess(true);

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/tour-guide/my-submissions');
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to submit package');
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
            Submit a New Vacation Package
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Create a new tour package to share with travelers. Your submission will be reviewed by an admin before being published.
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

        {success && (
          <div className="mt-8 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">Package submitted successfully! Redirecting...</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-8" onSubmit={onSubmit}>
          <div className="shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Package Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={onChange}
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={description}
                    onChange={onChange}
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.description ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label htmlFor="destinations" className="block text-sm font-medium text-gray-700">
                    Destinations
                  </label>
                  <select
                    id="destinations"
                    name="destinations"
                    multiple
                    value={destinations}
                    onChange={onChange}
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.destinations ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  >
                    {availableDestinations.map((destination) => (
                      <option key={destination._id} value={destination._id}>
                        {destination.name}, {destination.country}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple destinations</p>
                  {formErrors.destinations && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.destinations}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    id="duration"
                    min="1"
                    value={duration}
                    onChange={onChange}
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.duration ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formErrors.duration && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={onChange}
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.price ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label htmlFor="activities" className="block text-sm font-medium text-gray-700">
                    Activities (comma separated)
                  </label>
                  <input
                    type="text"
                    name="activities"
                    id="activities"
                    value={activities}
                    onChange={onChange}
                    placeholder="Hiking, Sightseeing, Cultural Tours"
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.activities ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formErrors.activities && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.activities}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label htmlFor="includedTransport" className="block text-sm font-medium text-gray-700">
                    Included Transport
                  </label>
                  <input
                    type="text"
                    name="includedTransport"
                    id="includedTransport"
                    value={includedTransport}
                    onChange={onChange}
                    placeholder="Airport transfers, Private van, etc."
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.includedTransport ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formErrors.includedTransport && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.includedTransport}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label htmlFor="includedHotels" className="block text-sm font-medium text-gray-700">
                    Included Hotels
                  </label>
                  <input
                    type="text"
                    name="includedHotels"
                    id="includedHotels"
                    value={includedHotels}
                    onChange={onChange}
                    placeholder="3-star hotels, Mountain lodges, etc."
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.includedHotels ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formErrors.includedHotels && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.includedHotels}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label htmlFor="includedMeals" className="block text-sm font-medium text-gray-700">
                    Included Meals
                  </label>
                  <input
                    type="text"
                    name="includedMeals"
                    id="includedMeals"
                    value={includedMeals}
                    onChange={onChange}
                    placeholder="Breakfast daily, 3 lunches, 2 dinners"
                    className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm ${
                      formErrors.includedMeals ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formErrors.includedMeals && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.includedMeals}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                    Images (comma separated URLs)
                  </label>
                  <input
                    type="text"
                    name="images"
                    id="images"
                    value={images}
                    onChange={onChange}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Daily Schedule</h3>
                <button
                  type="button"
                  onClick={addScheduleDay}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Day
                </button>
              </div>

              {formErrors.schedule && (
                <p className="mt-1 text-sm text-red-600">{formErrors.schedule}</p>
              )}

              {schedule.length === 0 ? (
                <div className="mt-4 text-center py-8 border-2 border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500">No days added yet. Click "Add Day" to start building your schedule.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-6">
                  {schedule.map((day, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">Day {day.day}</h4>
                        <button
                          type="button"
                          onClick={() => removeScheduleDay(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor={`day-${index}-activities`} className="block text-sm font-medium text-gray-700">
                            Activities
                          </label>
                          <textarea
                            id={`day-${index}-activities`}
                            value={day.activities}
                            onChange={(e) => updateScheduleDay(index, 'activities', e.target.value)}
                            rows={2}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor={`day-${index}-meals`} className="block text-sm font-medium text-gray-700">
                            Meals
                          </label>
                          <input
                            type="text"
                            id={`day-${index}-meals`}
                            value={day.meals}
                            onChange={(e) => updateScheduleDay(index, 'meals', e.target.value)}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor={`day-${index}-accommodation`} className="block text-sm font-medium text-gray-700">
                            Accommodation
                          </label>
                          <input
                            type="text"
                            id={`day-${index}-accommodation`}
                            value={day.accommodation}
                            onChange={(e) => updateScheduleDay(index, 'accommodation', e.target.value)}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Package for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitPackage;
