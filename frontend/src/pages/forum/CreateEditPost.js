import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import FileUploader from '../../components/uploads/FileUploader';

const CreateEditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const isEditing = Boolean(postId);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    region: '',
    tags: '',
    images: []
  });
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch regions (destinations)
        const regionsRes = await api.get('/destinations');
        setRegions(regionsRes.data);
        
        // If editing, fetch post details
        if (isEditing) {
          const postRes = await api.get(`/forum/posts/${postId}`);
          const post = postRes.data;
          
          // Check if user is author or admin
          if (post.author._id !== user.id && user.role !== 'admin') {
            setError('You are not authorized to edit this post');
            setLoading(false);
            return;
          }
          
          setFormData({
            title: post.title,
            content: post.content,
            region: post.region._id,
            tags: post.tags.join(', '),
            images: post.images || []
          });
        } else {
          // If creating a new post, check for region in query params
          const params = new URLSearchParams(location.search);
          const regionId = params.get('region');
          if (regionId) {
            setFormData(prev => ({ ...prev, region: regionId }));
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, isEditing, postId, user, navigate, location]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    } else if (formData.content.length < 20) {
      errors.content = 'Content must be at least 20 characters';
    }
    
    if (!formData.region) {
      errors.region = 'Please select a region';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleUploadSuccess = (data) => {
    const uploadedFiles = data.files || [data.file];
    const fileUrls = uploadedFiles.map(file => file.url);
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...fileUrls]
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Process tags
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      const postData = {
        title: formData.title,
        content: formData.content,
        region: formData.region,
        tags: tagsArray,
        images: formData.images
      };
      
      if (isEditing) {
        await api.put(`/forum/posts/${postId}`, postData);
        navigate(`/forum/posts/${postId}`);
      } else {
        const res = await api.post('/forum/posts', postData);
        navigate(`/forum/posts/${res.data._id}`);
      }
    } catch (err) {
      console.error('Error submitting post:', err);
      setError('Failed to save post. Please try again later.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        {isEditing ? 'Edit Post' : 'Create New Post'}
      </h1>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${formErrors.title ? 'border-red-500' : ''}`}
              placeholder="Enter a descriptive title"
            />
            {formErrors.title && (
              <p className="form-error">{formErrors.title}</p>
            )}
          </div>

          {/* Region */}
          <div className="mb-6">
            <label htmlFor="region" className="form-label">Region</label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className={`form-input ${formErrors.region ? 'border-red-500' : ''}`}
            >
              <option value="">Select a region</option>
              {regions.map((region) => (
                <option key={region._id} value={region._id}>
                  {region.name}, {region.country}
                </option>
              ))}
            </select>
            {formErrors.region && (
              <p className="form-error">{formErrors.region}</p>
            )}
          </div>

          {/* Content */}
          <div className="mb-6">
            <label htmlFor="content" className="form-label">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="8"
              className={`form-input ${formErrors.content ? 'border-red-500' : ''}`}
              placeholder="Share your experience, ask questions, or start a discussion..."
            ></textarea>
            {formErrors.content && (
              <p className="form-error">{formErrors.content}</p>
            )}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. hiking, adventure, tips"
            />
            <p className="text-sm text-neutral-500 mt-1">
              Optional: Add tags to help others find your post
            </p>
          </div>

          {/* Images */}
          <div className="mb-6">
            <label className="form-label">Images</label>
            
            {/* Display existing images */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`Upload ${index + 1}`} 
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* File uploader */}
            <FileUploader
              onUploadSuccess={handleUploadSuccess}
              onUploadError={(err) => setError('Failed to upload images. Please try again.')}
              maxFiles={5}
              maxSize={5}
              acceptedTypes="image/*"
              uploadEndpoint="/uploads/multiple"
              multiple={true}
            />
            <p className="text-sm text-neutral-500 mt-1">
              Optional: Upload images to enhance your post (max 5 images, 5MB each)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditPost;
