import React, { useState, useMemo, useEffect } from 'react';
import type { User, Rating } from '../types';
import UserCard from './UserCard';

interface MeetPageProps {
  currentUser: User;
  users: User[];
  addRating: (rating: Rating) => void;
  ratings: Rating[];
}

type AnimationState = 'idle' | 'left' | 'right';

export const MeetPage: React.FC<MeetPageProps> = ({ currentUser, users, addRating, ratings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState<AnimationState>('idle');
  const [cardKey, setCardKey] = useState(0);

  const usersToRate = useMemo(() => {
    const ratedUserIds = new Set(ratings.filter(r => r.raterId === currentUser.id).map(r => r.ratedId));
    return users.filter(u => u.id !== currentUser.id && !u.isBlocked && !ratedUserIds.has(u.id));
  }, [users, currentUser.id, ratings]);

  useEffect(() => {
     setCurrentIndex(0);
     setCardKey(Date.now());
  }, [usersToRate]);


  const handleRating = (score: number, isSuperLike: boolean = false) => {
    if (currentIndex >= usersToRate.length) return;

    const ratedUser = usersToRate[currentIndex];
    const direction = score >= 6 ? 'right' : 'left';
    setAnimation(direction);

    setTimeout(() => {
      addRating({
        raterId: currentUser.id,
        ratedId: ratedUser.id,
        score,
        isSuperLike,
        timestamp: Date.now(),
      });
      setCurrentIndex(prev => prev + 1);
      setAnimation('idle');
      setCardKey(Date.now());
    }, 500);
  };

  if (!currentUser.username || currentUser.username.startsWith('user')) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Установите ваш username!</h2>
        <p className="max-w-md text-gray-200">
          Чтобы оценивать других и пользоваться приложением, пожалуйста, установите публичный username в настройках Telegram.
        </p>
        <p className="mt-2 text-gray-400 text-sm">(В Telegram: Настройки &gt; Изменить профиль &gt; Имя пользователя)</p>
      </div>
    );
  }

  const currentProfile = usersToRate[currentIndex];

  const getAnimationClass = () => {
    if (animation === 'left') return 'slide-out-left';
    if (animation === 'right') return 'slide-out-right';
    return 'slide-in-up';
  };

  return (
    <div className="flex flex-col h-full pt-4 pb-24">
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-sm h-[70vh] relative">
          {currentProfile ? (
            <div key={cardKey} className={getAnimationClass()}>
              <UserCard user={currentProfile} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-gray-400">
                <p className="text-xl">На сегодня это все!</p>
                <p>Загляните позже, чтобы увидеть новых людей.</p>
            </div>
          )}
        </div>
      </div>
      {currentProfile && (
        <div className="px-4 mt-4">
            <div className="flex justify-around items-center bg-gray-800/50 p-3 rounded-full">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(score => (
                    <button 
                        key={score} 
                        onClick={() => handleRating(score)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-700 hover:bg-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        {score}
                    </button>
                ))}
                 <button 
                    onClick={() => handleRating(11, true)}
                    disabled={!currentUser.isPremium}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-500 text-white font-bold disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-400 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    title={currentUser.isPremium ? "Суперлайк!" : "Доступно для Премиум пользователей"}
                >
                   ✨
                </button>
            </div>
            { !currentUser.isPremium && <p className="text-center text-xs text-gray-400 mt-2">Купите Премиум, чтобы отправлять Суперлайки!</p>}
        </div>
      )}
    </div>
  );
};
