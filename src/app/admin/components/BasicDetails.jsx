'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/uploadImage';
import { useUser } from '@/app/Provider';

const BasicDetail = ({ userInfo }) => {
  const { userData, setUserData } = useUser();

  const [details, setDetails] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    linkedIn: '',
    phoneNumber: '',
    designation1: '',
    designation2: '',
    designation3: '',
    bannerImages: [] // Banner images array
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo) {
      setDetails({
        name: userInfo.name || '',
        email: userInfo.email || '',
        bio: userInfo.bio || '',
        location: userInfo.location || '',
        linkedIn: userInfo.linkedIn || '',
        phoneNumber: userInfo.phoneNumber || '',
        designation1: userInfo.designation1 || '',
        designation2: userInfo.designation2 || '',
        designation3: userInfo.designation3 || '',
        bannerImages: userInfo.bannerImages || [] // Initialize with current banner images
      });
    }
  }, [userInfo]);

  const updateUserField = async (fieldName, value) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field: fieldName,
          value: value
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user information');
      }

      toast.success('Changes saved successfully!');

      // Use the updated user returned from the API
      setUserData((prev) => ({
        ...prev,
        user: data.user
      }));

      return data.user;
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error(error.message || 'Failed to save changes');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const onInputChange = (event, fieldName) => {
    const { value } = event.target;
    setDetails((prev) => ({ ...prev, [fieldName]: value }));
    
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        await updateUserField(fieldName, value);
      } catch (error) {
        // Error already handled in updateUserField
      }
    }, 2000);
  };

  const handleBannerImageUpload = async (event) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    try {
      const uploadedImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadImage(file, {
          bucketName: 'banner-images',
          folderPath: 'banners'
        });

        if (result.success) {
          uploadedImages.push(result.url);
        } else {
          throw new Error(result.error);
        }
      }

      const updated = { ...details, bannerImages: [...details.bannerImages, ...uploadedImages] };
      setDetails(updated);
      await updateUserField('bannerImages', updated.bannerImages);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteBannerImage = async (imageUrl) => {
    setIsUploading(true);
    try {
      const res = await fetch('/api/cloudFlare/deleteImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete image');
      }

      const updated = { ...details, bannerImages: details.bannerImages.filter((url) => url !== imageUrl) };
      setDetails(updated);
      await updateUserField('bannerImages', updated.bannerImages);
      toast.success('Banner image deleted');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(error.message || 'Failed to delete image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card w-full max-w-3xl mx-auto bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-base mb-4 text-base-content/80">Personal Information</h2>

        <form className="space-y-2">

          {/* Banner Images Section */}
          <div>
            <label className="label">Banner Images</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleBannerImageUpload}
              className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
              multiple
              disabled={isUploading}
            />
            <div className="flex gap-2 mt-2">
              {details.bannerImages.map((image, index) => (
                <div key={index} className="w-32 h-32 rounded-md overflow-hidden relative">
                  <img
                    src={image}
                    alt={`Banner Image ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteBannerImage(image)}
                    className="absolute top-1 right-1 text-xs bg-red-500 text-white rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Text Input Fields */}
          <div className="flex items-center gap-6">
            <div>
              <label className="label flex-1">
                <span className="label-text text-xs text-base-content/70">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
                value={details.name}
                onChange={(e) => onInputChange(e, 'name')}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text text-xs text-base-content/70">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
                value={details.email}
                onChange={(e) => onInputChange(e, 'email')}
              />
            </div>

            {/* Bio, Location, LinkedIn */}
            <div>
              <label className="label">Bio</label>
              <textarea
                placeholder="Tell us about yourself"
                className="textarea textarea-bordered w-full text-sm h-24 bg-base-100 text-base-content/80"
                value={details.bio}
                onChange={(e) => onInputChange(e, 'bio')}
              />
            </div>

            <div>
              <label className="label">Location</label>
              <input
                type="text"
                placeholder="Enter your location"
                className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
                value={details.location}
                onChange={(e) => onInputChange(e, 'location')}
              />
            </div>

            <div>
              <label className="label">LinkedIn Profile</label>
              <input
                type="url"
                placeholder="Enter your LinkedIn URL"
                className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
                value={details.linkedIn}
                onChange={(e) => onInputChange(e, 'linkedIn')}
              />
            </div>

            {/* New fields */}
            <div>
              <label className="label">Phone Number</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
                value={details.phoneNumber}
                onChange={(e) => onInputChange(e, 'phoneNumber')}
              />
            </div>

            <div>
              <label className="label">Designation 1</label>
              <input
                type="text"
                placeholder="Enter your first designation"
                className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
                value={details.designation1}
                onChange={(e) => onInputChange(e, 'designation1')}
              />
            </div>

            <div>
              <label className="label">Designation 2</label>
              <input
                type="text"
                placeholder="Enter your second designation"
                className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
                value={details.designation2}
                onChange={(e) => onInputChange(e, 'designation2')}
              />
            </div>

            <div>
              <label className="label">Designation 3</label>
              <input
                type="text"
                placeholder="Enter your third designation"
                className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
                value={details.designation3}
                onChange={(e) => onInputChange(e, 'designation3')}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicDetail;
