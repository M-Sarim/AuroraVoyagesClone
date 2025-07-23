import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Tab } from '@headlessui/react';
import {
  GlobeAsiaAustraliaIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import CultureInfoCard from '../components/culture/CultureInfoCard';
import RegulationCard from '../components/regulations/RegulationCard';

function RegulationsCultureHub() {
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [travelRequirements, setTravelRequirements] = useState([]);
  const [culturalInfo, setCulturalInfo] = useState([]);
  const { destinationId } = useParams();

  // Filtering and search state
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cultureFilters, setCultureFilters] = useState({
    category: '',
    importance: ''
  });
  const [requirementFilters, setRequirementFilters] = useState({
    type: '',
    isRequired: ''
  });

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/destinations');
        setDestinations(res.data);

        // If destinationId is provided in URL, set it as selected
        if (destinationId) {
          const destination = res.data.find(d => d._id === destinationId);
          if (destination) {
            setSelectedDestination(destination);
          }
        } else if (res.data.length > 0) {
          // Otherwise select the first destination
          setSelectedDestination(res.data[0]);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, [destinationId]);

  // Fetch travel requirements and cultural info when destination changes
  useEffect(() => {
    const fetchRequirementsAndCulture = async () => {
      if (!selectedDestination) return;

      setLoading(true);
      try {
        // Fetch travel requirements
        const reqRes = await api.get(`/travel-requirements?destination=${selectedDestination._id}`);
        setTravelRequirements(reqRes.data);

        // Fetch cultural info
        const cultureRes = await api.get(`/cultural-info/destination/${selectedDestination._id}`);
        setCulturalInfo(cultureRes.data);
      } catch (error) {
        console.error('Error fetching requirements and cultural info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirementsAndCulture();
  }, [selectedDestination]);

  // Handle destination change
  const handleDestinationChange = (e) => {
    const destId = e.target.value;
    const destination = destinations.find(d => d._id === destId);
    setSelectedDestination(destination);
  };

  // Handle search and filter changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCultureFilterChange = (e) => {
    const { name, value } = e.target;
    setCultureFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementFilterChange = (e) => {
    const { name, value } = e.target;
    setRequirementFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCultureFilters({
      category: '',
      importance: ''
    });
    setRequirementFilters({
      type: '',
      isRequired: ''
    });
  };

  // Filter cultural info based on search and filters
  const filteredCulturalInfo = culturalInfo.filter(info => {
    const matchesSearch = searchQuery === '' ||
      info.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = cultureFilters.category === '' ||
      info.category === cultureFilters.category;

    const matchesImportance = cultureFilters.importance === '' ||
      info.importance === cultureFilters.importance;

    return matchesSearch && matchesCategory && matchesImportance;
  });

  // Filter travel requirements based on search and filters
  const filteredRequirements = travelRequirements.filter(req => {
    const matchesSearch = searchQuery === '' ||
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = requirementFilters.type === '' ||
      req.type === requirementFilters.type;

    const matchesRequired = requirementFilters.isRequired === '' ||
      (requirementFilters.isRequired === 'true' && req.isRequired) ||
      (requirementFilters.isRequired === 'false' && !req.isRequired);

    return matchesSearch && matchesType && matchesRequired;
  });

  // Group cultural info by category
  const groupedCulturalInfo = filteredCulturalInfo.reduce((acc, info) => {
    const category = info.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(info);
    return acc;
  }, {});

  // Group requirements by type
  const groupedRequirements = filteredRequirements.reduce((acc, req) => {
    const type = req.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(req);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Regulations & Culture Hub</h1>
            <p className="mt-2 text-gray-600">
              Essential information for a respectful and hassle-free journey
            </p>
          </div>

          {/* Destination selector */}
          <div className="mt-4 md:mt-0">
            <select
              className="form-input bg-white"
              value={selectedDestination?._id || ''}
              onChange={handleDestinationChange}
            >
              {destinations.map(destination => (
                <option key={destination._id} value={destination._id}>
                  {destination.name}, {destination.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search and filter bar */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search regulations and cultural information..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary-600 hover:text-primary-800"
                >
                  Clear all filters
                </button>
              </div>

              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-4">
                  <Tab
                    className={({ selected }) =>
                      `w-full rounded-lg py-2 text-sm font-medium leading-5 transition-colors duration-200
                      ${
                        selected
                          ? 'bg-white text-primary-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-700'
                      }`
                    }
                  >
                    Cultural Information Filters
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      `w-full rounded-lg py-2 text-sm font-medium leading-5 transition-colors duration-200
                      ${
                        selected
                          ? 'bg-white text-primary-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-700'
                      }`
                    }
                  >
                    Travel Requirements Filters
                  </Tab>
                </Tab.List>

                <Tab.Panels>
                  {/* Cultural Information Filters */}
                  <Tab.Panel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={cultureFilters.category}
                          onChange={handleCultureFilterChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                          <option value="">All Categories</option>
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
                      <div>
                        <label htmlFor="importance" className="block text-sm font-medium text-gray-700">
                          Importance
                        </label>
                        <select
                          id="importance"
                          name="importance"
                          value={cultureFilters.importance}
                          onChange={handleCultureFilterChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                          <option value="">All Importance Levels</option>
                          <option value="essential">Essential</option>
                          <option value="recommended">Recommended</option>
                          <option value="good-to-know">Good to Know</option>
                        </select>
                      </div>
                    </div>
                  </Tab.Panel>

                  {/* Travel Requirements Filters */}
                  <Tab.Panel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                          Type
                        </label>
                        <select
                          id="type"
                          name="type"
                          value={requirementFilters.type}
                          onChange={handleRequirementFilterChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                          <option value="">All Types</option>
                          <option value="visa">Visa</option>
                          <option value="permit">Permit</option>
                          <option value="vaccination">Vaccination</option>
                          <option value="document">Document</option>
                          <option value="equipment">Equipment</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="isRequired" className="block text-sm font-medium text-gray-700">
                          Required Status
                        </label>
                        <select
                          id="isRequired"
                          name="isRequired"
                          value={requirementFilters.isRequired}
                          onChange={handleRequirementFilterChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                          <option value="">All</option>
                          <option value="true">Required</option>
                          <option value="false">Optional</option>
                        </select>
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 shadow-sm mb-6">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-3 px-4 text-sm font-medium leading-5 transition-colors duration-200
                  ${
                    selected
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:bg-neutral-100 hover:text-gray-700'
                  }`
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <DocumentTextIcon className="h-5 w-5" />
                  <span>Travel Requirements</span>
                </div>
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-3 px-4 text-sm font-medium leading-5 transition-colors duration-200
                  ${
                    selected
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:bg-neutral-100 hover:text-gray-700'
                  }`
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <GlobeAsiaAustraliaIcon className="h-5 w-5" />
                  <span>Cultural Information</span>
                </div>
              </Tab>
            </Tab.List>

            <Tab.Panels>
              {/* Travel Requirements Panel */}
              <Tab.Panel>
                {filteredRequirements.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-card p-8 text-center">
                    <InformationCircleIcon className="h-12 w-12 mx-auto text-neutral-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No travel requirements found</h3>
                    <p className="mt-2 text-gray-600">
                      {searchQuery || requirementFilters.type || requirementFilters.isRequired
                        ? 'No results match your search criteria. Try adjusting your filters.'
                        : 'There are no specific travel requirements listed for this destination yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Required Documents Section */}
                    {groupedRequirements.visa && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <DocumentTextIcon className="h-6 w-6 mr-2 text-primary-600" />
                          Visa Requirements
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groupedRequirements.visa.map(requirement => (
                            <RegulationCard key={requirement._id} requirement={requirement} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Permits Section */}
                    {groupedRequirements.permit && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <DocumentTextIcon className="h-6 w-6 mr-2 text-primary-600" />
                          Permits & Passes
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groupedRequirements.permit.map(requirement => (
                            <RegulationCard key={requirement._id} requirement={requirement} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Vaccinations Section */}
                    {groupedRequirements.vaccination && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-amber-500" />
                          Health & Vaccinations
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groupedRequirements.vaccination.map(requirement => (
                            <RegulationCard key={requirement._id} requirement={requirement} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Other Requirements */}
                    {groupedRequirements.other && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <InformationCircleIcon className="h-6 w-6 mr-2 text-blue-500" />
                          Other Requirements
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groupedRequirements.other.map(requirement => (
                            <RegulationCard key={requirement._id} requirement={requirement} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Tab.Panel>

              {/* Cultural Information Panel */}
              <Tab.Panel>
                {filteredCulturalInfo.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-card p-8 text-center">
                    <GlobeAsiaAustraliaIcon className="h-12 w-12 mx-auto text-neutral-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No cultural information found</h3>
                    <p className="mt-2 text-gray-600">
                      {searchQuery || cultureFilters.category || cultureFilters.importance
                        ? 'No results match your search criteria. Try adjusting your filters.'
                        : 'There is no cultural information listed for this destination yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Customs & Etiquette */}
                    {groupedCulturalInfo.customs && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Customs & Etiquette</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {groupedCulturalInfo.customs.map(info => (
                            <CultureInfoCard key={info._id} info={info} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Religion */}
                    {groupedCulturalInfo.religion && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Religion & Beliefs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {groupedCulturalInfo.religion.map(info => (
                            <CultureInfoCard key={info._id} info={info} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Language */}
                    {groupedCulturalInfo.language && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Language & Communication</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {groupedCulturalInfo.language.map(info => (
                            <CultureInfoCard key={info._id} info={info} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Food */}
                    {groupedCulturalInfo.food && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Food & Dining</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {groupedCulturalInfo.food.map(info => (
                            <CultureInfoCard key={info._id} info={info} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dress */}
                    {groupedCulturalInfo.dress && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Dress Code</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {groupedCulturalInfo.dress.map(info => (
                            <CultureInfoCard key={info._id} info={info} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Traditions */}
                    {groupedCulturalInfo.traditions && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Traditions & Festivals</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {groupedCulturalInfo.traditions.map(info => (
                            <CultureInfoCard key={info._id} info={info} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Taboos */}
                    {groupedCulturalInfo.taboos && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Cultural Taboos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {groupedCulturalInfo.taboos.map(info => (
                            <CultureInfoCard key={info._id} info={info} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Other */}
                    {groupedCulturalInfo.other && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Other Cultural Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {groupedCulturalInfo.other.map(info => (
                            <CultureInfoCard key={info._id} info={info} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        )}
      </div>
    </div>
  );
}

export default RegulationsCultureHub;
