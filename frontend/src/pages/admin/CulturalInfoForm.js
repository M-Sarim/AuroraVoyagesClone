import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { XMarkIcon, CheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const CulturalInfoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    destination: '',
    title: '',
    description: '',
    category: 'customs',
    importance: 'good-to-know',
    seasonalRelevance: [],
    mediaUrls: [],
    sources: []
  });
  
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newSeasonalRelevance, setNewSeasonalRelevance] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newSource, setNewSource] = useState('');

  // Fetch destinations and cultural info if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all destinations
        const destRes = await api.get('/destinations');
        setDestinations(destRes.data);
        
        // If in edit mode, fetch the cultural info
        if (isEditMode) {
          const infoRes = await api.get(`/cultural-info/${id}`);
          const info = infoRes.data;
          
          setFormData({
            destination: info.destination._id,
            title: info.title,
            description: info.description,
            category: info.category,
            importance: info.importance,
            seasonalRelevance: info.seasonalRelevance || [],
            mediaUrls: info.mediaUrls || [],
            sources: info.sources || []
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a new seasonal relevance
  const addSeasonalRelevance = () => {
    if (newSeasonalRelevance.trim() !== '' && !formData.seasonalRelevance.includes(newSeasonalRelevance.trim())) {
      setFormData(prev => ({
        ...prev,
        seasonalRelevance: [...prev.seasonalRelevance, newSeasonalRelevance.trim()]
      }));
      setNewSeasonalRelevance('');
    }
  };

  // Remove a seasonal relevance
  const removeSeasonalRelevance = (index) => {
    setFormData(prev => ({
      ...prev,
      seasonalRelevance: prev.seasonalRelevance.filter((_, i) => i !== index)
    }));
  };

  // Add a new media URL
  const addMediaUrl = () => {
    if (newMediaUrl.trim() !== '' && !formData.mediaUrls.includes(newMediaUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, newMediaUrl.trim()]
      }));
      setNewMediaUrl('');
    }
  };

  // Remove a media URL
  const removeMediaUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index)
    }));
  };

  // Add a new source
  const addSource = () => {
    if (newSource.trim() !== '' && !formData.sources.includes(newSource.trim())) {
      setFormData(prev => ({
        ...prev,
        sources: [...prev.sources, newSource.trim()]
      }));
      setNewSource('');
    }
  };

  // Remove a source
  const removeSource = (index) => {
    setFormData(prev => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditMode) {
        // Update existing cultural info
        await api.put(`/cultural-info/${id}`, formData);
      } else {
        // Create new cultural info
        await api.post('/cultural-info', formData);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/cultural-info');
      }, 1500);
    } catch (err) {
      console.error('Error saving cultural info:', err);
      setError('Failed to save cultural information');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/cultural-info')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Back to Cultural Information
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isEditMode ? 'Edit Cultural Information' : 'Add New Cultural Information'}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {isEditMode 
              ? 'Update the details of this cultural information' 
              : 'Fill in the details to add new cultural information'}
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
                  Cultural information {isEditMode ? 'updated' : 'created'} successfully!
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

                {/* Title */}
                <div className="col-span-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
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

                {/* Category */}
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="customs">Customs</option>
                    <option value="etiquette">Etiquette</option>
                    <option value="religion">Religion</option>
                    <option value="language">Language</option>
                    <option value="traditions">Traditions</option>
                    <option value="food">Food</option>
                    <option value="dress">Dress</option>
                    <option value="taboos">Taboos</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Importance */}
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="importance" className="block text-sm font-medium text-gray-700">
                    Importance *
                  </label>
                  <select
                    id="importance"
                    name="importance"
                    value={formData.importance}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="essential">Essential</option>
                    <option value="recommended">Recommended</option>
                    <option value="good-to-know">Good to Know</option>
                  </select>
                </div>

                {/* Seasonal Relevance */}
                <div className="col-span-6">
                  <label htmlFor="seasonalRelevance" className="block text-sm font-medium text-gray-700">
                    Seasonal Relevance
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="seasonalRelevance"
                      id="seasonalRelevance"
                      value={newSeasonalRelevance}
                      onChange={(e) => setNewSeasonalRelevance(e.target.value)}
                      placeholder="e.g., Summer, Ramadan, All year"
                      className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={addSeasonalRelevance}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.seasonalRelevance.map((season, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {season}
                        <button
                          type="button"
                          onClick={() => removeSeasonalRelevance(index)}
                          className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                        >
                          <span className="sr-only">Remove {season}</span>
                          <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Media URLs */}
                <div className="col-span-6">
                  <label htmlFor="mediaUrls" className="block text-sm font-medium text-gray-700">
                    Media URLs
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="url"
                      name="mediaUrls"
                      id="mediaUrls"
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={addMediaUrl}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {formData.mediaUrls.map((url, index) => (
                      <div key={index} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900 truncate max-w-md">
                          {url}
                        </a>
                        <button
                          type="button"
                          onClick={() => removeMediaUrl(index)}
                          className="ml-2 text-red-600 hover:text-red-900"
                        >
                          <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sources */}
                <div className="col-span-6">
                  <label htmlFor="sources" className="block text-sm font-medium text-gray-700">
                    Sources
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="sources"
                      id="sources"
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value)}
                      placeholder="e.g., Local guides, Cultural research"
                      className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={addSource}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.sources.map((source, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {source}
                        <button
                          type="button"
                          onClick={() => removeSource(index)}
                          className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none focus:bg-gray-500 focus:text-white"
                        >
                          <span className="sr-only">Remove {source}</span>
                          <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                onClick={() => navigate('/admin/cultural-info')}
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

export default CulturalInfoForm;
