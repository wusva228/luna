
import React from 'react';
import type { User } from '../types';
import { VerifiedIcon, PremiumIcon } from './icons';

interface UserCardProps {
  user: User;
  isMatch: boolean;
  distance: number | null;
  onReport: (reportedId: number) => void;
}

const AgeVerifiedIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 text-green-400 ${className}`}>
        <title>Возраст подтвержден</title>
        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 00-2.824-2.824l-3.323-.83v-3.324a3 3 0 00-5.648 0v3.323l-3.324.831a3 3 0 00-2.824 2.824l.83 3.324a3 3 0 002.824 2.824l3.323.83v3.324a3 3 0 005.648 0v-3.323l3.324-.83a3 3 0 002.824-2.824l-.83-3.324zM10 15a5 5 0 100-10 5 5 0 000 10z" clipRule="evenodd" />
        <path d="M11.39 8.243a.75.75 0 00-1.086-1.05l-2.5 2.75a.75.75 0 001.086 1.05l2.5-2.75z" />
        <path d="M9.755 12.33a.75.75 0 01.32-1.023l3.5-2a.75.75 0 11.65 1.154l-3.5 2a.75.75 0 01-.97-.131z" />
    </svg>
);


const DetailItem: React.FC<{ label: string, value?: string | number, icon?: React.ReactNode }> = ({ label, value, icon }) => {
    if (!value && !icon) return null;
    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs flex items-center gap-1">
            {icon}
            <span className="font-semibold">{label}:</span> {value}
        </div>
    );
};

const UserCard: React.FC<UserCardProps> = ({ user, isMatch, distance, onReport }) => {
  const photoUrl = user.photoUrls && user.photoUrls.length > 0 ? user.photoUrls[0] : `https://i.pravatar.cc/400?u=${user.id}`;

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const reason = prompt(`Пожалуйста, укажите причину жалобы на пользователя ${user.name}:`);
    if(reason) {
        onReport(user.id);
    } else if (reason === '') {
        alert('Причина жалобы не может быть пустой.');
    }
  };

  return (
    <div className="absolute inset-0 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-transform duration-500 ease-in-out">
      <img src={photoUrl} alt={user.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      
      <button 
        onClick={handleReportClick}
        className="absolute top-4 right-4 bg-black/30 rounded-full p-2 text-white hover:bg-red-500 transition-colors"
        title="Пожаловаться на профиль"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h8a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm3.707 2.293a1 1 0 00-1.414 1.414L8.586 12l-2.293 2.293a1 1 0 001.414 1.414L10 13.414l2.293 2.293a1 1 0 001.414-1.414L11.414 12l2.293-2.293a1 1 0 00-1.414-1.414L10 10.586 7.707 8.293z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white flex flex-col justify-end">
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl font-bold">{user.name}, {user.age} {user.gender === 'male' ? '♂️' : '♀️'}</h2>
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
            <p className="text-sm text-gray-300 mt-1">📍 {distance} км от вас</p>
        )}
        
        <p className="mt-2 text-gray-200">{user.bio}</p>
        
        <div className="mt-3 flex flex-wrap gap-2">
            <DetailItem label="Рост" value={user.height ? `${user.height} см` : undefined} />
            <DetailItem label="Вес" value={user.weight ? `${user.weight} кг` : undefined} />
            <DetailItem label="Знак зодиака" value={user.zodiacSign} />
            <DetailItem label="Цвет глаз" value={user.eyeColor} />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
