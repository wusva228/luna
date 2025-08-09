import React from 'react';
import type { AppView } from '../types';
import { MeetIcon, ProfileIcon, AdminIcon } from './icons';

const MapIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.25c-.317-.159-.69-.159-1.006 0L4.628 5.184c-.748.374-.748 1.437 0 1.811L8.5 9.006c.317.159.69.159 1.006 0l3.869-1.934c.317-.159.69.159 1.006 0l4.875 2.437c.381.19.622-.58.622 1.006V18a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V6.75c0-.836.88-1.38 1.628-1.006l3.869 1.934c.317.159.69.159 1.006 0l3.869-1.934c.317-.159.69-.159 1.006 0l.001.001z" />
    </svg>
);


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
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 flex justify-around shadow-lg z-10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <NavItem
        label="Лента"
        icon={<MeetIcon />}
        isActive={currentView === 'meet'}
        onClick={() => setView('meet')}
      />
       <NavItem
        label="Карта"
        icon={<MapIcon />}
        isActive={currentView === 'map'}
        onClick={() => setView('map')}
      />
      <NavItem
        label="Профиль"
        icon={<ProfileIcon />}
        isActive={currentView === 'profile'}
        onClick={() => setView('profile')}
      />
      {isAdmin && (
        <NavItem
          label="Админ"
          icon={<AdminIcon />}
          isActive={currentView === 'admin'}
          onClick={() => setView('admin')}
        />
      )}
    </nav>
  );
};