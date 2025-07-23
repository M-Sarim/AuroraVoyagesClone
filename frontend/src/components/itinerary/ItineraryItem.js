import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ItineraryItem = ({ item, onUpdate, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activities, setActivities] = useState(item.activities || []);
  const [newActivity, setNewActivity] = useState('');
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const handleAddActivity = () => {
    if (newActivity.trim()) {
      const updatedActivities = [...activities, newActivity.trim()];
      setActivities(updatedActivities);
      onUpdate(item.id, { activities: updatedActivities });
      setNewActivity('');
    }
  };
  
  const handleRemoveActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
    onUpdate(item.id, { activities: updatedActivities });
  };
  
  const handleInputChange = (field, value) => {
    onUpdate(item.id, { [field]: value });
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 cursor-move bg-gray-50" {...attributes} {...listeners}>
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700 font-semibold">Day {item.day}</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{item.destinationData.name}</h3>
            <p className="text-sm text-gray-500">{item.destinationData.country}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {isExpanded ? (
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              )}
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Accommodation */}
            <div className="sm:col-span-3">
              <label htmlFor={`accommodation-${item.id}`} className="block text-sm font-medium text-gray-700">
                Accommodation
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id={`accommodation-${item.id}`}
                  value={item.accommodation || ''}
                  onChange={(e) => handleInputChange('accommodation', e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Hotel, guesthouse, etc."
                />
              </div>
            </div>
            
            {/* Transportation */}
            <div className="sm:col-span-3">
              <label htmlFor={`transportation-${item.id}`} className="block text-sm font-medium text-gray-700">
                Transportation
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id={`transportation-${item.id}`}
                  value={item.transportation || ''}
                  onChange={(e) => handleInputChange('transportation', e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Flight, bus, car, etc."
                />
              </div>
            </div>
            
            {/* Activities */}
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Activities
              </label>
              
              <div className="mt-1 flex">
                <input
                  type="text"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                  placeholder="Add an activity"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
                />
                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add
                </button>
              </div>
              
              {activities.length > 0 && (
                <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                  {activities.map((activity, index) => (
                    <li key={index} className="flex items-center justify-between py-2 px-4">
                      <span className="text-sm text-gray-700">{activity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveActivity(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Notes */}
            <div className="sm:col-span-6">
              <label htmlFor={`notes-${item.id}`} className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <div className="mt-1">
                <textarea
                  id={`notes-${item.id}`}
                  rows={3}
                  value={item.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Additional notes for this day"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryItem;
