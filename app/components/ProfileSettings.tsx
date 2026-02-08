'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/use-auth';
import UserAvatar from './UserAvatar';
import { Upload, Save, X, Loader2 } from 'lucide-react';

interface ProfileSettingsProps {
  onUpdate?: () => void;
}

export default function ProfileSettings({ onUpdate }: ProfileSettingsProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    image: null as string | null,
  });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile({
          name: data.user.name || '',
          email: data.user.email || '',
          image: data.user.image,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile((prev) => ({ ...prev, image: data.imageUrl }));
        showToast('success', 'Profile picture updated successfully');
        if (onUpdate) onUpdate();
      } else {
        const err = await response.json().catch(() => ({}));
        showToast('error', err.error || 'Failed to upload image');
      }
    } catch (error) {
      showToast('error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      showToast('error', 'Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
        }),
      });

      if (response.ok) {
        showToast('success', 'Profile updated successfully');
        if (onUpdate) onUpdate();
      } else {
        const err = await response.json().catch(() => ({}));
        showToast('error', err.error || 'Failed to update profile');
      }
    } catch (error) {
      showToast('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-white font-bold mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <UserAvatar name={profile.name} image={profile.image} size="lg" />
          <div className="flex-1">
            <label className="block mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
                id="avatar-upload"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload Photo
                    </>
                  )}
                </button>
              </div>
            </label>
            <p className="text-gray-400 text-sm mt-2">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-white font-bold mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-afro-primary"
              placeholder="your@email.com"
            />
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-afro-primary hover:bg-white text-black font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white font-semibold`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
