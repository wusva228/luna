import React from 'react';
import type { User } from '../types';
import { VerifiedIcon, PremiumIcon } from './icons';

interface UserCardProps {
  user: User;
  isMatch: boolean;
  onReport: (reportedId: number) => void;
}

const DetailItem: React.FC<{ label: string, value?: string | number }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
            <span className="font-semibold">{label}:</span> {value}
        </div>
    );
};

const UserCard: React.FC<UserCardProps> = ({ user, isMatch, onReport }) => {
  const photoUrl = user.photoUrls && user.photoUrls.length > 0 ? user.photoUrls[0] : `https://i.pravatar.cc/400?u=${user.id}`;

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm(`Вы уверены, что хотите пожаловаться на пользователя ${user.name}?`)) {
        onReport(user.id);
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
        </div>
        
        {isMatch ? (
            <p className="text-sm font-semibold text-green-300">@{user.username}</p>
        ) : (
            <p className="text-sm text-gray-400 italic">Сначала совпадение, потом контакты</p>
        )}

        {user.isPremium && <p className="text-sm font-semibold text-yellow-300">Премиум</p>}
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