import React from 'react';
import type { User } from '../types';
import { PremiumIcon } from './icons';

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  getLikers: (userId: number) => User[];
  onUpgrade: () => void;
  onViewProfile: (user: User) => void;
}

const LikerCard: React.FC<{ user: User, isBlurred: boolean, onClick: () => void }> = ({ user, isBlurred, onClick }) => {
    const photoUrl = user.photoUrls && user.photoUrls.length > 0 ? user.photoUrls[0] : `https://i.pravatar.cc/150?u=${user.id}`;
    return (
        <button onClick={onClick} className="relative rounded-lg overflow-hidden bg-gray-800 w-full block text-left group">
            <img 
                src={photoUrl} 
                alt={user.name} 
                className={`w-full h-32 object-cover transition-all duration-300 ${isBlurred ? 'blur-md' : ''}`} 
            />
            {!isBlurred && (
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2 transition-opacity opacity-100 group-hover:opacity-100">
                    <p className="text-white font-bold text-sm truncate">{user.name}, {user.age}</p>
                 </div>
            )}
            {isBlurred && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <PremiumIcon className="w-8 h-8 text-yellow-400" />
                 </div>
            )}
        </button>
    );
};

export const LikesModal: React.FC<LikesModalProps> = ({ isOpen, onClose, currentUser, getLikers, onUpgrade, onViewProfile }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const likers = getLikers(currentUser.id);

  const handleCardClick = (user: User, index: number) => {
    if(!currentUser.isPremium && index > 0) {
        onUpgrade();
    } else {
        onViewProfile(user);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative border border-gray-700 animate-slide-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        <div className="flex items-center gap-2">
            <PremiumIcon className="text-yellow-400" />
            <h2 className="text-2xl font-bold">Ваши поклонники</h2>
        </div>
        
        {likers.length === 0 ? (
            <p className="text-gray-400 mt-4 text-center">Пока никто не выразил вам симпатию. Не переживайте, они скоро появятся!</p>
        ) : (
            <>
                <p className="text-gray-400 mt-2 mb-4">Эти люди оценили вас высоко. Нажмите, чтобы посмотреть профиль.</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                    {likers.map((liker, index) => (
                        <LikerCard 
                            key={liker.id} 
                            user={liker} 
                            isBlurred={!currentUser.isPremium && index > 0} 
                            onClick={() => handleCardClick(liker, index)}
                        />
                    ))}
                </div>

                {!currentUser.isPremium && likers.length > 1 && (
                    <div className="mt-6 text-center bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="font-bold text-lg text-yellow-300">Хотите увидеть всех?</h3>
                        <p className="text-gray-300 my-2">Получите Премиум-статус, чтобы увидеть все анкеты без размытия и получить другие преимущества.</p>
                        <button 
                            onClick={onUpgrade}
                            className="w-full px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors">
                            Узнать больше о Премиум
                        </button>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};