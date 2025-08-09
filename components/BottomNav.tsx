
import React from 'react';
import type { AppView } from '../types';
import { MeetIcon, ProfileIcon, AdminIcon } from './icons';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isAdmin: boolean;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-indigo-400' : 'text-gray-400 hover:text-indigo-300'
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView, isAdmin }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 flex justify-around shadow-lg">
      <NavItem
        label="Meet"
        icon={<MeetIcon />}
        isActive={currentView === 'meet'}
        onClick={() => setView('meet')}
      />
      <NavItem
        label="Profile"
        icon={<ProfileIcon />}
        isActive={currentView === 'profile'}
        onClick={() => setView('profile')}
      />
      {isAdmin && (
        <NavItem
          label="Admin"
          icon={<AdminIcon />}
          isActive={currentView === 'admin'}
          onClick={() => setView('admin')}
        />
      )}
    </nav>
  );
};
