import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUserProfile } from './UserProfileContext';

export const ProfileRefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { profile, updateProfile } = useUserProfile();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  React.useEffect(() => {
    const refreshProfile = async () => {
      if (!profile?.ID) return;

      try {
        const response = await fetch(`${apiBaseUrl}/api/employees/${profile.ID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch updated profile');
        }
        const updatedProfile = await response.json();
        updateProfile(updatedProfile);
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    };

    refreshProfile();
  }, [location.pathname, profile?.ID]); // Refresh on route change and when profile ID is available

  return <>{children}</>;
};
