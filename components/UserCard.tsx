
import React from 'react';
import type { User } from '../types';
import { VerifiedIcon, PremiumIcon } from './icons';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="absolute inset-0 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-transform duration-500 ease-in-out">
      <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col justify-end">
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl font-bold">{user.name}, {user.age}</h2>
          {user.isVerified && <VerifiedIcon />}
          {user.isPremium && <PremiumIcon />}
        </div>
        {user.isPremium && <p className="text-sm font-semibold text-yellow-300">Premium User</p>}
        <p className="mt-2 text-gray-200">{user.bio}</p>
      </div>
    </div>
  );
};

export default UserCard;
