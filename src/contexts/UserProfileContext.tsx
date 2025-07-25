import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
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
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  department: 'IT',
  role: 'Software Engineer',
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

  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...fields }));
  };

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}; 