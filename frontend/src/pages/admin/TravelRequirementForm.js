import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { XMarkIcon, CheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const TravelRequirementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    destination: '',
    name: '',
    description: '',
    type: 'visa',
    isRequired: true,
    applicationProcess: '',
    applicationUrl: '',
    cost: {
      amount: 0,
      currency: 'PKR'
    },
    processingTime: '',
    validityPeriod: '',
    seasonalRestrictions: [],
    notes: ''
  });
  
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newSeasonalRestriction, setNewSeasonalRestriction] = useState('');

  // Fetch destinations and travel requirement if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all destinations
        const destRes = await api.get('/destinations');
        setDestinations(destRes.data);
        
        // If in edit mode, fetch the travel requirement
        if (isEditMode) {
          const reqRes = await api.get(`/travel-requirements/${id}`);
          const req = reqRes.data;
          
          setFormData({
            destination: req.destination._id,
            name: req.name,
            description: req.description,
            type: req.type,
            isRequired: req.isRequired,
            applicationProcess: req.applicationProcess || '',
            applicationUrl: req.applicationUrl || '',
            cost: req.cost || {
              amount: 0,
              currency: 'PKR'
            },
            processingTime: req.processingTime || '',
            validityPeriod: req.validityPeriod || '',
            seasonalRestrictions: req.seasonalRestrictions || [],
            notes: req.notes || ''
          });
        } else if (destRes.data.length > 0) {
          // Set default destination if not in edit mode
          setFormData(prev => ({
            ...prev,
            destination: destRes.data[0]._id
          }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'cost.amount') {
      setFormData(prev => ({
        ...prev,
        cost: {
          ...prev.cost,
          amount: parseFloat(value) || 0
        }
      }));
    } else if (name === 'cost.currency') {
      setFormData(prev => ({
        ...prev,
        cost: {
          ...prev.cost,
          currency: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Add a new seasonal restriction
  const addSeasonalRestriction = () => {
    if (newSeasonalRestriction.trim() !== '' && !formData.seasonalRestrictions.includes(newSeasonalRestriction.trim())) {
      setFormData(prev => ({
        ...prev,
        seasonalRestrictions: [...prev.seasonalRestrictions, newSeasonalRestriction.trim()]
      }));
      setNewSeasonalRestriction('');
    }
  };

  // Remove a seasonal restriction
  const removeSeasonalRestriction = (index) => {
    setFormData(prev => ({
      ...prev,
      seasonalRestrictions: prev.seasonalRestrictions.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditMode) {
        // Update existing travel requirement
        await api.put(`/travel-requirements/${id}`, formData);
      } else {
        // Create new travel requirement
        await api.post('/travel-requirements', formData);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/travel-requirements');
      }, 1500);
    } catch (err) {
      console.error('Error saving travel requirement:', err);
      setError('Failed to save travel requirement');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/travel-requirements')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Back to Travel Requirements
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isEditMode ? 'Edit Travel Requirement' : 'Add New Travel Requirement'}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {isEditMode 
              ? 'Update the details of this travel requirement' 
              : 'Fill in the details to add a new travel requirement'}
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Travel requirement {isEditMode ? 'updated' : 'created'} successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                {/* Destination */}
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                    Destination *
                  </label>
                  <select
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Select a destination</option>
                    {destinations.map(dest => (
                      <option key={dest._id} value={dest._id}>
                        {dest.name}, {dest.country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Tourist Visa, Trekking Permit"
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Type */}
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="visa">Visa</option>
                    <option value="permit">Permit</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="document">Document</option>
                    <option value="equipment">Equipment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Is Required */}
                <div className="col-span-6 sm:col-span-3">
                  <div className="flex items-center h-full mt-6">
                    <input
                      id="isRequired"
                      name="isRequired"
                      type="checkbox"
                      checked={formData.isRequired}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isRequired" className="ml-2 block text-sm text-gray-900">
                      This requirement is mandatory
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Application Process */}
                <div className="col-span-6">
                  <label htmlFor="applicationProcess" className="block text-sm font-medium text-gray-700">
                    Application Process
                  </label>
                  <textarea
                    id="applicationProcess"
                    name="applicationProcess"
                    rows={3}
                    value={formData.applicationProcess}
                    onChange={handleChange}
                    placeholder="Step-by-step instructions for applying"
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Application URL */}
                <div className="col-span-6">
                  <label htmlFor="applicationUrl" className="block text-sm font-medium text-gray-700">
                    Application URL
                  </label>
                  <input
                    type="url"
                    name="applicationUrl"
                    id="applicationUrl"
                    value={formData.applicationUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/apply"
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Cost */}
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="cost.amount" className="block text-sm font-medium text-gray-700">
                    Cost Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="cost.amount"
                      id="cost.amount"
                      value={formData.cost.amount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <select
                        id="cost.currency"
                        name="cost.currency"
                        value={formData.cost.currency}
                        onChange={handleChange}
                        className="focus:ring-primary-500 focus:border-primary-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                      >
                        <option value="PKR">PKR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Enter 0 if free</p>
                </div>

                {/* Processing Time */}
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="processingTime" className="block text-sm font-medium text-gray-700">
                    Processing Time
                  </label>
                  <input
                    type="text"
                    name="processingTime"
                    id="processingTime"
                    value={formData.processingTime}
                    onChange={handleChange}
                    placeholder="e.g., 2-3 weeks, 24 hours"
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Validity Period */}
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="validityPeriod" className="block text-sm font-medium text-gray-700">
                    Validity Period
                  </label>
                  <input
                    type="text"
                    name="validityPeriod"
                    id="validityPeriod"
                    value={formData.validityPeriod}
                    onChange={handleChange}
                    placeholder="e.g., 3 months, 1 year"
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Seasonal Restrictions */}
                <div className="col-span-6">
                  <label htmlFor="seasonalRestrictions" className="block text-sm font-medium text-gray-700">
                    Seasonal Restrictions
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="seasonalRestrictions"
                      id="seasonalRestrictions"
                      value={newSeasonalRestriction}
                      onChange={(e) => setNewSeasonalRestriction(e.target.value)}
                      placeholder="e.g., Winter months, Monsoon season"
                      className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={addSeasonalRestriction}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.seasonalRestrictions.map((restriction, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {restriction}
                        <button
                          type="button"
                          onClick={() => removeSeasonalRestriction(index)}
                          className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                        >
                          <span className="sr-only">Remove {restriction}</span>
                          <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="col-span-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional information travelers should know"
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                onClick={() => navigate('/admin/travel-requirements')}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TravelRequirementForm;
