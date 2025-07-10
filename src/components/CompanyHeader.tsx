
import React from 'react';
import { User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserProfile } from '@/contexts/UserProfileContext';
import GlobalSearch from './GlobalSearch';
import NotificationDropdown from './NotificationDropdown';

const CompanyHeader = () => {
  const { profile } = useUserProfile();
  const userInfo = {
    name: profile.firstName + ' ' + profile.lastName,
    position: profile.position,
    initials: (profile.firstName[0] || '') + (profile.lastName[0] || ''),
  };
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Company Portal</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <GlobalSearch />
          <NotificationDropdown />
          <div className="flex items-center space-x-2">
            <NavLink to="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </NavLink>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>{userInfo.initials}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{userInfo.name}</p>
              <p className="text-gray-500">{userInfo.position}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CompanyHeader;
