
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
    <header className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Access Logo" 
              className="h-12 w-auto object-contain" 
              style={{maxHeight: 48}} 
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
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
            <div className="text-xs">
              <p className="font-medium text-gray-900 leading-tight">{userInfo.name}</p>
              <p className="text-gray-500 leading-tight">{userInfo.position}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CompanyHeader;
