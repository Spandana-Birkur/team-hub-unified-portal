import React, { createContext, useContext, useState, useEffect } from 'react';
import { employees } from '../data/employees';
import api from '@/utils/api';

interface ProfileApiResponse {
  Salary: number;
  // Add other properties if they are consistently returned by the /api/profile/<id> endpoint
}

export interface UserProfile {
  ID: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  bio: string;
  gender: string; // 'male', 'female', 'non-binary', etc.
  salary: number;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (fields: Partial<UserProfile>) => void;
  loading: boolean;
}

const currentUser = employees.find(e => e.id === 1);

const defaultProfile: UserProfile = {
  ID: currentUser?.id || 1,
  firstName: currentUser?.name.split(' ')[0] || 'John',
  lastName: currentUser?.name.split(' ')[1] || 'Doe',
  email: currentUser?.email || 'john.doe@company.com',
  phone: currentUser?.phone || '+1 (555) 123-4567',
  department: currentUser?.department || 'IT',
  role: currentUser?.role || 'Employee',
  bio: 'Experienced software engineer with expertise in React and TypeScript.',
  gender: 'male',
  salary: 54000,
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) throw new Error('useUserProfile must be used within a UserProfileProvider');
  return context;
};

export const UserProfileProvider: React.FC<{ children: React.ReactNode, initialProfile?: UserProfile }> = ({ children, initialProfile }) => {
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      let currentProfileData: UserProfile | null = profile;

      if (!currentProfileData) {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          currentProfileData = JSON.parse(savedProfile);
        } else {
          currentProfileData = defaultProfile;
        }
        setProfile(currentProfileData); // Set initial profile state
      }

      let finalProfileToSave: UserProfile;

      if (currentProfileData && currentProfileData.ID) {
        try {
          const response = await api.get<ProfileApiResponse>(`/profile/${currentProfileData.ID}`);
          // Ensure salary is always a number, even if response.data.Salary is null/undefined
          const apiSalary = response.data.Salary !== undefined && response.data.Salary !== null ? response.data.Salary : defaultProfile.salary;

          finalProfileToSave = {
            ...currentProfileData,
            salary: apiSalary,
          };
          setProfile(finalProfileToSave);
        } catch (error) {
          console.error(`Failed to fetch profile for ID ${currentProfileData.ID}, using stored profile or default`, error);
          const savedProfile = localStorage.getItem('userProfile');
          let fallbackProfile: UserProfile;
          if (savedProfile) {
            fallbackProfile = JSON.parse(savedProfile);
          } else {
            fallbackProfile = defaultProfile;
          }
          // Ensure salary is present from defaultProfile if not in savedProfile or is null/undefined
          finalProfileToSave = {
            ...fallbackProfile,
            salary: (fallbackProfile && typeof fallbackProfile.salary === 'number') ? fallbackProfile.salary : defaultProfile.salary
          };
          setProfile(finalProfileToSave);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn('No user ID available to fetch profile, using default profile.');
        finalProfileToSave = defaultProfile;
        setProfile(finalProfileToSave);
        setLoading(false);
      }

      // Save the final determined profile to local storage
      if (finalProfileToSave) {
        localStorage.setItem('userProfile', JSON.stringify(finalProfileToSave));
      }
    };

    fetchProfile();
  }, [profile?.ID]); // Re-run effect if profile ID changes

  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile(prev => (prev ? { ...prev, ...fields } : null));
  };

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, updateProfile, loading }}>
      {children}
    </UserProfileContext.Provider>
  );
};
