
import React from 'react';
import type { User } from '../types';
import { VerifiedIcon, PremiumIcon } from './icons';

interface ViewProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  isMatch: boolean;
  distance: number | null;
}

const AgeVerifiedIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 text-green-400 ${className}`}>
        <title>Возраст подтвержден</title>
        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 00-2.824-2.824l-3.323-.83v-3.324a3 3 0 00-5.648 0v3.323l-3.324.831a3 3 0 00-2.824 2.824l.83 3.324a3 3 0 002.824 2.824l3.323.83v3.324a3 3 0 005.648 0v-3.323l3.324-.83a3 3 0 002.824-2.824l-.83-3.324zM10 15a5 5 0 100-10 5 5 0 000 10z" clipRule="evenodd" />
        <path d="M11.39 8.243a.75.75 0 00-1.086-1.05l-2.5 2.75a.75.75 0 001.086 1.05l2.5-2.75z" />
        <path d="M9.755 12.33a.75.75 0 01.32-1.023l3.5-2a.75.75 0 11.65 1.154l-3.5 2a.75.75 0 01-.97-.131z" />
    </svg>
);


export const ViewProfileModal: React.FC<ViewProfileModalProps> = ({ user, isOpen, onClose, isMatch, distance }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const photoUrl = user.photoUrls && user.photoUrls.length > 0 ? user.photoUrls[0] : `https://i.pravatar.cc/400?u=${user.id}`;
  
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
        <div className="bg-gray-800 rounded-2xl shadow-lg w-full max-w-sm p-4 relative border border-gray-700 animate-slide-in-up">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl leading-none z-10">&times;</button>
            <div className="relative w-full h-80 rounded-lg overflow-hidden">
                <img src={photoUrl} alt={user.name} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
            <div className="p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold">{user.name}, {user.age} {user.gender === 'male' ? '♂️' : '♀️'}</h2>
                  {user.isVerified && <VerifiedIcon />}
                  {user.isPremium && <PremiumIcon />}
                  {user.isAgeVerified && <AgeVerifiedIcon />}
                </div>

                {isMatch ? (
                    <p className="text-sm font-semibold text-green-300">@{user.username}</p>
                ) : (
                    <p className="text-sm text-gray-400 italic">Сначала совпадение, потом контакты</p>
                )}

                 {distance !== null && (
                    <p className="text-sm text-gray-300">📍 {distance} км от вас</p>
                )}

                <p className="text-gray-300 text-sm pt-2">{user.bio}</p>
                
                 <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs pt-2">
                  <p><span className="font-semibold text-gray-400">Рост:</span> {user.height || 'не указан'}</p>
                  <p><span className="font-semibold text-gray-400">Вес:</span> {user.weight || 'не указан'}</p>
                  <p><span className="font-semibold text-gray-400">Знак зодиака:</span> {user.zodiacSign || 'не указан'}</p>
                  <p><span className="font-semibold text-gray-400">Цвет глаз:</span> {user.eyeColor || 'не указан'}</p>
                 </div>

            </div>
        </div>
    </div>
  );
};
