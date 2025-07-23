import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ItineraryItem from '../components/itinerary/ItineraryItem';
import DestinationSelector from '../components/itinerary/DestinationSelector';
import ComplianceChecker from '../components/itinerary/ComplianceChecker';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { format } from 'date-fns';

const ItineraryPlanner = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [destinations, setDestinations] = useState([]);
  const [itineraryItems, setItineraryItems] = useState([]);
  const [itineraryName, setItineraryName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [complianceResults, setComplianceResults] = useState(null);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  
  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Fetch destinations on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/destinations');
        setDestinations(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDestinations();
  }, []);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/itinerary-planner' } });
    }
  }, [isAuthenticated, navigate]);
  
  // Handle DnD events
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setItineraryItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  // Add a new itinerary item
  const handleAddItem = (destinationId) => {
    const destination = destinations.find(dest => dest._id === destinationId);
    if (!destination) return;
    
    const newItem = {
      id: Date.now().toString(), // Temporary ID for frontend
      day: itineraryItems.length + 1,
      destination: destination._id,
      destinationData: destination, // Include full destination data for display
      activities: [],
      accommodation: '',
      transportation: '',
      notes: ''
    };
    
    setItineraryItems([...itineraryItems, newItem]);
  };
  
  // Update an itinerary item
  const handleUpdateItem = (id, updatedData) => {
    setItineraryItems(items => 
      items.map(item => 
        item.id === id ? { ...item, ...updatedData } : item
      )
    );
  };
  
  // Remove an itinerary item
  const handleRemoveItem = (id) => {
    setItineraryItems(items => {
      const filteredItems = items.filter(item => item.id !== id);
      // Update day numbers
      return filteredItems.map((item, index) => ({
        ...item,
        day: index + 1
      }));
    });
  };
  
  // Check compliance with travel requirements
  const checkCompliance = async () => {
    if (itineraryItems.length === 0) {
      setError('Please add at least one destination to your itinerary.');
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.post('/itineraries/check-compliance', {
        items: itineraryItems.map(item => ({
          destination: item.destination
        }))
      });
      
      setComplianceResults(response.data);
      setShowComplianceModal(true);
      setLoading(false);
    } catch (err) {
      console.error('Error checking compliance:', err);
      setError('Failed to check travel requirements. Please try again.');
      setLoading(false);
    }
  };
  
  // Save the itinerary
  const saveItinerary = async () => {
    if (!itineraryName) {
      setError('Please enter a name for your itinerary.');
      return;
    }
    
    if (!startDate || !endDate) {
      setError('Please select start and end dates for your itinerary.');
      return;
    }
    
    if (itineraryItems.length === 0) {
      setError('Please add at least one destination to your itinerary.');
      return;
    }
    
    try {
      setSaving(true);
      
      // Format items for API
      const formattedItems = itineraryItems.map(item => ({
        day: item.day,
        destination: item.destination,
        activities: item.activities,
        accommodation: item.accommodation,
        transportation: item.transportation,
        notes: item.notes
      }));
      
      const response = await api.post('/itineraries', {
        name: itineraryName,
        startDate,
        endDate,
        items: formattedItems,
        isPublic
      });
      
      setSaving(false);
      
      // Navigate to the itinerary detail page
      navigate(`/itineraries/${response.data._id}`);
    } catch (err) {
      console.error('Error saving itinerary:', err);
      setError('Failed to save itinerary. Please try again.');
      setSaving(false);
    }
  };
  
  if (loading && destinations.length === 0) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Itinerary Planner</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Itinerary Details Form */}
          <div className="mb-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="itinerary-name" className="block text-sm font-medium text-gray-700">
                Itinerary Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="itinerary-name"
                  value={itineraryName}
                  onChange={(e) => setItineraryName(e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="My Pakistan Adventure"
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <div className="flex items-center">
                <input
                  id="is-public"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is-public" className="ml-2 block text-sm text-gray-700">
                  Make this itinerary public (visible to other users)
                </label>
              </div>
            </div>
          </div>
          
          {/* Destination Selector */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Destinations</h2>
            <DestinationSelector 
              destinations={destinations} 
              onSelectDestination={handleAddItem} 
            />
          </div>
          
          {/* Itinerary Builder */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Itinerary</h2>
            
            {itineraryItems.length === 0 ? (
              <div className="bg-gray-50 p-6 text-center rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">
                  Your itinerary is empty. Add destinations from the selector above.
                </p>
              </div>
            ) : (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext 
                  items={itineraryItems.map(item => item.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {itineraryItems.map((item) => (
                      <ItineraryItem
                        key={item.id}
                        item={item}
                        onUpdate={handleUpdateItem}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={checkCompliance}
              disabled={loading || saving || itineraryItems.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Check Travel Requirements
            </button>
            
            <button
              type="button"
              onClick={saveItinerary}
              disabled={loading || saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Itinerary'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Compliance Checker Modal */}
      {showComplianceModal && complianceResults && (
        <ComplianceChecker
          results={complianceResults}
          onClose={() => setShowComplianceModal(false)}
        />
      )}
    </div>
  );
};

export default ItineraryPlanner;
