import React, { useState } from 'react';
import type { User, PremiumRequest, Ticket } from '../types';
import { VerifiedIcon, PremiumIcon, TicketIcon } from './icons';
import { generateBio } from '../services/geminiService';

interface ProfilePageProps {
  user: User;
  tickets: Ticket[];
  updateUser: (user: Partial<User>) => void;
  onContactAdmin: () => void;
  requestPremium: (userId: number, userName: string, userTg: string) => void;
  premiumRequest: PremiumRequest | undefined;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, tickets, updateUser, onContactAdmin, requestPremium, premiumRequest }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({
    name: user.name,
    bio: user.bio,
    photoUrls: user.photoUrls,
    height: user.height,
    weight: user.weight,
    zodiacSign: user.zodiacSign,
    eyeColor: user.eyeColor,
    preferences: user.preferences,
    badHabits: user.badHabits,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const urls = e.target.value.split('\n').map(url => url.trim()).filter(Boolean);
    setEditForm(prev => ({ ...prev, photoUrls: urls }));
  };
  
  const handleSave = () => {
    updateUser({ id: user.id, ...editForm });
    setIsEditing(false);
  };
  
  const handleGenerateBio = async () => {
      setIsGeneratingBio(true);
      const newBio = await generateBio(user.name);
      setEditForm(prev => ({...prev, bio: newBio}));
      setIsGeneratingBio(false);
  };

  const handleUpgrade = () => {
    requestPremium(user.id, user.name, user.username);
    alert('Ваш запрос на получение премиум-статуса отправлен администратору.');
  };
  
  const handleCancelEdit = () => {
      setIsEditing(false);
      // Reset form to original user data
      setEditForm({
        name: user.name,
        bio: user.bio,
        photoUrls: user.photoUrls,
        height: user.height,
        weight: user.weight,
        zodiacSign: user.zodiacSign,
        eyeColor: user.eyeColor,
        preferences: user.preferences,
        badHabits: user.badHabits,
      });
  }
  
  const mainPhoto = (isEditing ? editForm.photoUrls : user.photoUrls)?.[0] || `https://i.pravatar.cc/400?u=${user.id}`;
  const userTickets = tickets.filter(t => t.userId === user.id);
  const genderDisplay = user.gender === 'male' ? 'Мужской' : 'Женский';

  return (
    <div className="p-4 sm:p-6 pb-24 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <img src={mainPhoto} alt={user.name} className="w-full h-80 object-cover rounded-2xl shadow-lg" />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-gray-900 overflow-hidden">
             <img src={mainPhoto} alt={user.name} className="w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="mt-12 text-center">
            <div className="flex items-center justify-center space-x-2">
                <h1 className="text-3xl font-bold">{isEditing ? editForm.name : user.name}, {user.age}</h1>
                {user.isVerified && <VerifiedIcon />}
                {user.isPremium && <PremiumIcon />}
            </div>
             <p className="text-gray-400 mt-1">@{user.username}</p>
             <p className="text-gray-300 mt-1">{genderDisplay}</p>
             {user.isPremium && <p className="text-sm font-semibold text-yellow-300 mt-1">Премиум</p>}
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-3">Обо мне</h2>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Отображаемое имя</label>
                    <input type="text" name="name" value={editForm.name} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white mt-1"/>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Цвет глаз</label>
                    <input type="text" name="eyeColor" value={editForm.eyeColor || ''} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white mt-1"/>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Рост (см)</label>
                    <input type="number" name="height" value={editForm.height || ''} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white mt-1"/>
                  </div>
                   <div>
                    <label className="text-sm font-medium text-gray-400">Вес (кг)</label>
                    <input type="number" name="weight" value={editForm.weight || ''} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white mt-1"/>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Знак зодиака</label>
                    <input type="text" name="zodiacSign" value={editForm.zodiacSign || ''} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white mt-1"/>
                  </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Биография</label>
                <textarea name="bio" value={editForm.bio} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white resize-none mt-1" rows={4}></textarea>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Предпочтения (например, "книги, кино, спорт")</label>
                <input type="text" name="preferences" value={editForm.preferences || ''} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white mt-1"/>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Вредные привычки</label>
                <input type="text" name="badHabits" value={editForm.badHabits || ''} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white mt-1"/>
              </div>
              <div>
                 <label className="text-sm font-medium text-gray-400">Ссылки на фото (каждая с новой строки)</label>
                 <textarea value={editForm.photoUrls?.join('\n') || ''} onChange={handlePhotoUrlsChange} className="w-full bg-gray-700 p-2 rounded-lg text-white resize-none mt-1" rows={3}></textarea>
              </div>
              <div className="flex justify-between items-center flex-wrap gap-2 mt-2">
                <button onClick={handleGenerateBio} disabled={isGeneratingBio} className="px-4 py-2 text-sm bg-purple-600 rounded-lg hover:bg-purple-500 transition disabled:bg-gray-500 flex items-center gap-2">
                  {isGeneratingBio ? 'Генерация...' : <>✨ Сгенерировать био</>}
                </button>
                <div className="flex gap-2">
                    <button onClick={handleCancelEdit} className="px-4 py-2 text-sm bg-gray-600 rounded-lg hover:bg-gray-500 transition">Отмена</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm bg-indigo-600 rounded-lg hover:bg-indigo-500 transition">Сохранить</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300 whitespace-pre-wrap">{user.bio}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <p><span className="font-semibold text-gray-400">Рост:</span> {user.height || 'не указан'}</p>
                  <p><span className="font-semibold text-gray-400">Вес:</span> {user.weight || 'не указан'}</p>
                  <p><span className="font-semibold text-gray-400">Знак зодиака:</span> {user.zodiacSign || 'не указан'}</p>
                  <p><span className="font-semibold text-gray-400">Цвет глаз:</span> {user.eyeColor || 'не указан'}</p>
                  <p><span className="font-semibold text-gray-400">Предпочтения:</span> {user.preferences || 'не указаны'}</p>
                  <p><span className="font-semibold text-gray-400">Привычки:</span> {user.badHabits || 'не указаны'}</p>
              </div>
              <button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 transition rounded-lg">Редактировать профиль</button>
            </div>
          )}
        </div>
        
        {!user.isPremium && (
             <div className="mt-8 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 p-6 rounded-2xl text-center text-gray-900 shadow-lg">
                <h2 className="text-2xl font-bold">Станьте Премиум!</h2>
                <p className="mt-2">Открывайте суперлайки, смотрите, кто вас лайкнул, и ставьте безлимитные оценки!</p>
                {premiumRequest?.status === 'pending' ? (
                     <div className="mt-4 px-8 py-3 bg-gray-900 text-yellow-300 font-bold rounded-full cursor-not-allowed">
                        Ожидает одобрения
                    </div>
                ) : (
                    <button 
                        onClick={handleUpgrade}
                        className="mt-4 px-8 py-3 bg-gray-900 text-yellow-300 font-bold rounded-full hover:bg-black transition-transform transform hover:scale-105"
                    >
                        Получить за 299 RUB
                    </button>
                )}
            </div>
        )}
        
        <div className="mt-8 bg-gray-800 p-6 rounded-2xl">
             <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg">Нужна помощь?</h3>
                    <p className="text-gray-400 text-sm">Создайте тикет или просмотрите историю обращений.</p>
                </div>
                <button onClick={onContactAdmin} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 transition rounded-lg flex items-center gap-2">
                    <TicketIcon className="w-5 h-5"/>
                    <span>Поддержка</span>
                </button>
            </div>
             {userTickets.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                    <h4 className="font-semibold">Ваши тикеты:</h4>
                    {userTickets.map(ticket => (
                        <div key={ticket.id} className="bg-gray-700 p-3 rounded-lg">
                           <p className="font-bold">{ticket.subject}</p>
                           <p className="text-sm text-gray-300">{ticket.message}</p>
                           {ticket.reply && (
                                <div className="mt-2 pt-2 border-t border-gray-600">
                                    <p className="text-sm font-semibold text-indigo-300">Ответ администратора:</p>
                                    <p className="text-sm text-indigo-200 italic">"{ticket.reply}"</p>
                                </div>
                           )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};