import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import {
  UserIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CameraIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const { user, isAuthenticated, loading, updateUserData } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    language: "english",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  // Load user data
  useEffect(() => {
    if (user) {
      console.log("Loading user data in Profile component:", user);
      console.log("User picture URL:", user.picture);

      setFormData({
        name: user.name || "",
        email: user.email || "",
        language: user.language || "english",
      });

      if (user.picture) {
        setImagePreview(user.picture);
        console.log("Set image preview to:", user.picture);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected profile image:", file.name, file.type, file.size);

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setMessage({
          type: "error",
          text: "Please select a valid image file (JPEG, PNG, GIF, or WEBP)",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image file is too large. Maximum size is 5MB.",
        });
        return;
      }

      setProfileImage(file);
      setMessage({ type: "", text: "" });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Image preview created");
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        console.error("Error reading file:", reader.error);
        setMessage({
          type: "error",
          text: "Failed to read image file. Please try another image.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsSubmitting(true);

      // If there's a current image and it's from our uploads directory
      if (user.picture && user.picture.includes("/uploads/")) {
        // Extract filename from the path
        const filename = user.picture.split("/").pop();
        await api.delete(`/uploads/${filename}`);
      }

      // Update user profile to remove picture
      const response = await api.put(`/users/${user.id}`, {
        ...formData,
        picture: null,
      });

      // Clear image preview
      setImagePreview("");
      setProfileImage(null);

      setMessage({
        type: "success",
        text: "Profile picture removed successfully",
      });

      // Update user data in context
      updateUserData(response.data);
    } catch (error) {
      console.error("Error removing profile picture:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to remove profile picture",
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirmDelete(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      let updatedUserData = { ...formData };

      // If there's a new profile image, upload it first
      if (profileImage) {
        console.log("Uploading new profile image:", profileImage.name);
        const formData = new FormData();
        formData.append("file", profileImage);

        try {
          const uploadResponse = await api.post("/uploads/single", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log("Image upload response:", uploadResponse.data);

          // Add the image URL to the user data
          if (uploadResponse.data.file && uploadResponse.data.file.url) {
            updatedUserData.picture = uploadResponse.data.file.url;
            console.log(
              "Setting profile picture URL to:",
              updatedUserData.picture
            );
          } else {
            console.error("Invalid upload response:", uploadResponse.data);
            throw new Error("Invalid upload response from server");
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          setMessage({
            type: "error",
            text: "Failed to upload profile image. Please try again.",
          });
          setIsSubmitting(false);
          return;
        }
      }

      console.log("Updating user profile with data:", updatedUserData);

      // Update user profile
      const response = await api.put(`/users/${user.id}`, updatedUserData);
      console.log("Profile update response:", response.data);

      // If the update was successful and included a picture
      if (response.data && response.data.picture) {
        console.log("Updated profile picture URL:", response.data.picture);
      }

      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });

      // Update user data in context
      updateUserData(response.data);

      // Reset the profile image state since it's been uploaded
      setProfileImage(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log(
                            "Profile image failed to load:",
                            imagePreview
                          );
                          e.target.onerror = null;
                          e.target.src = "/images/default_profile.svg";
                        }}
                      />
                    ) : (
                      <UserIcon className="w-16 h-16 text-gray-400" />
                    )}
                  </div>

                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors"
                  >
                    <CameraIcon className="w-5 h-5" />
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                    />
                  </label>
                </div>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    className="mt-4 text-red-600 flex items-center text-sm hover:text-red-800 transition-colors"
                    disabled={isSubmitting}
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Remove photo
                  </button>
                )}
              </div>

              {/* Profile Form */}
              <div className="flex-1">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Preferred Language
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        disabled={isSubmitting}
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                        <option value="japanese">Japanese</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium">
                  {user.role === "user"
                    ? "Regular User"
                    : user.role === "tourGuide"
                    ? "Tour Guide"
                    : "Administrator"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Authentication Method</p>
                <p className="font-medium capitalize">
                  {user.authProvider || "Email & Password"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Image Deletion */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Remove Profile Picture
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove your profile picture? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                    Removing...
                  </span>
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
