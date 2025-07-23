import React, { useState, useRef } from 'react';
import api from '../../utils/api';

const FileUploader = ({ 
  onUploadSuccess, 
  onUploadError, 
  maxFiles = 5, 
  maxSize = 5, // in MB
  acceptedTypes = 'image/*',
  uploadEndpoint = '/uploads',
  multiple = true
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate number of files
    if (selectedFiles.length > maxFiles) {
      setErrors([`You can only upload a maximum of ${maxFiles} files at once`]);
      return;
    }
    
    // Validate file sizes
    const maxSizeBytes = maxSize * 1024 * 1024; // Convert MB to bytes
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSizeBytes);
    
    if (oversizedFiles.length > 0) {
      setErrors([`Some files exceed the maximum size of ${maxSize}MB`]);
      return;
    }
    
    // Clear previous errors
    setErrors([]);
    
    // Add files to state
    setFiles(selectedFiles);
  };
  
  const handleUpload = async () => {
    if (files.length === 0) {
      setErrors(['Please select files to upload']);
      return;
    }
    
    setUploading(true);
    setErrors([]);
    
    // Create FormData
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    try {
      const response = await api.post(uploadEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress({ percent: percentCompleted });
        }
      });
      
      // Reset state
      setFiles([]);
      setUploadProgress({});
      
      // Call success callback
      onUploadSuccess && onUploadSuccess(response.data);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors([error.response?.data?.message || 'Failed to upload files']);
      onUploadError && onUploadError(error);
    } finally {
      setUploading(false);
    }
  };
  
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-4">
      {/* File Input */}
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="pt-1 text-sm text-gray-500">
              {multiple ? (
                <span>Drag & drop files or <span className="text-primary-600">browse</span></span>
              ) : (
                <span>Drag & drop a file or <span className="text-primary-600">browse</span></span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {multiple ? (
                <span>Upload up to {maxFiles} files (max {maxSize}MB each)</span>
              ) : (
                <span>Max file size: {maxSize}MB</span>
              )}
            </p>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            onChange={handleFileChange} 
            multiple={multiple}
            accept={acceptedTypes}
          />
        </label>
      </div>
      
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <ul className="list-disc list-inside text-sm text-red-700">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected Files */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          <ul className="mt-2 divide-y divide-gray-200">
            {files.map((file, index) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <div className="flex items-center">
                  {file.type.startsWith('image/') ? (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={file.name} 
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <svg className="h-10 w-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 truncate" style={{ maxWidth: '200px' }}>
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-2 text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Upload Progress */}
      {uploading && uploadProgress.percent > 0 && (
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
                  Uploading
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-primary-600">
                  {uploadProgress.percent}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
              <div
                style={{ width: `${uploadProgress.percent}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-300"
              ></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
