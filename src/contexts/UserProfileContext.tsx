import React, { createContext, useContext, useState, useEffect } from 'react';
import { employees } from '../data/employees';
import api from '@/utils/api';

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
      try {
        const response = await api.get('/profile');
        setProfile(response.data);
        localStorage.setItem('userProfile', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to fetch profile, using stored profile or default', error);
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          setProfile(defaultProfile);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile(prev => (prev ? { ...prev, ...fields } : null));
  };

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, updateProfile, loading }}>
      {children}
    </UserProfileContext.Provider>
  );
};
