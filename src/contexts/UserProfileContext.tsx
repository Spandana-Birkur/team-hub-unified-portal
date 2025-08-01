import React, { createContext, useContext, useState } from 'react';

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
}

interface UserProfileContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (fields: Partial<UserProfile>) => void;
}

const defaultProfile: UserProfile = {
  ID: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  department: 'IT',
  role: 'Employee',
  bio: 'Experienced software engineer with expertise in React and TypeScript.',
  gender: 'male',
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) throw new Error('useUserProfile must be used within a UserProfileProvider');
  return context;
};

export const UserProfileProvider: React.FC<{ children: React.ReactNode, initialProfile?: UserProfile }> = ({ children, initialProfile }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || defaultProfile);

  // Load profile from localStorage on mount
  React.useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }
  }, []);

  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...fields }));
  };

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}; 