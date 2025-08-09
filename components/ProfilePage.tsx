import React, { useState } from 'react';
import type { User, PremiumRequest, Ticket } from '../types';
import { VerifiedIcon, PremiumIcon, TicketIcon } from './icons';
import { generateBio } from '../services/geminiService';
import { uploadFile } from '../services/uploadService';


interface ProfilePageProps {
  user: User;
  tickets: Ticket[];
  updateUser: (user: Partial<User>) => void;
  onContactAdmin: () => void;
  onVerifyAge: () => void;
  requestPremium: (userId: number, userName: string, userTg: string) => void;
  premiumRequest: PremiumRequest | undefined;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, tickets, updateUser, onContactAdmin, onVerifyAge, requestPremium, premiumRequest }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({ ...user });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setIsUploading(true);
        const files = Array.from(e.target.files);
        const uploadPromises = files.map(file => uploadFile(file));
        try {
            const uploadedUrls = await Promise.all(uploadPromises);
            const newPhotoUrls = [...(editForm.photoUrls || []), ...uploadedUrls];
            setEditForm(prev => ({ ...prev, photoUrls: newPhotoUrls }));
        } catch (error) {
            console.error("Ошибка при загрузке фото:", error);
            alert("Не удалось загрузить одно или несколько изображений.");
        } finally {
            setIsUploading(false);
        }
    }
  };

  const removePhoto = (urlToRemove: string) => {
      setEditForm(prev => ({ ...prev, photoUrls: prev.photoUrls?.filter(url => url !== urlToRemove) }));
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
      setEditForm({ ...user });
  }
  
  const mainPhoto = (isEditing ? editForm.photoUrls : user.photoUrls)?.[0] || `https://ucarecdn.com/a6d94669-e389-4235-812e-15822deb257a/`;
  const userTickets = tickets.filter(t => t.userId === user.id);
  const genderDisplay = user.gender === 'male' ? 'Мужской' : 'Женский';

  return (
    <div className="p-4 sm:p-6 pb-24 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <img src={mainPhoto} alt={user.name} className="w-full h-80 object-cover rounded-2xl shadow-lg bg-gray-700" />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-700">
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
             {user.isAgeVerified && <p className="text-green-400 font-semibold text-sm mt-1">✅ Возраст подтвержден</p>}
             {user.isPremium && <p className="text-sm font-semibold text-yellow-300 mt-1">Премиум</p>}
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-3">Обо мне</h2>
          {isEditing ? (
            <div className="space-y-4">
              {/* EDITING FORM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Отображаемое имя</label>
                    <input type="text" name="name" value={editForm.name || ''} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white mt-1"/>
                  </div>
                   <div>
                    <label className="text-sm font-medium text-gray-400">Биография</label>
                    <textarea name="bio" value={editForm.bio || ''} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white resize-none mt-1" rows={3}></textarea>
                    <button onClick={handleGenerateBio} disabled={isGeneratingBio} className="text-xs text-indigo-300 hover:underline disabled:text-gray-500">
                      {isGeneratingBio ? 'Генерация...' : '✨ Сгенерировать с помощью AI'}
                    </button>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="text-sm font-medium text-gray-400">Цвет глаз</label>
                    <input type="text" name="eyeColor" value={editForm.eyeColor || ''} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white mt-1"/>
                  </div>
              </div>
               <div>
                <label className="text-sm font-medium text-gray-400">Предпочтения (например, "книги, кино, спорт")</label>
                <input type="text" name="preferences" value={editForm.preferences || ''} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white mt-1"/>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Вредные привычки</label>
                <input type="text" name="badHabits" value={editForm.badHabits || ''} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-lg text-white mt-1"/>
              </div>
              {/* Photo uploader */}
              <div>
                <label className="text-sm font-medium text-gray-400">Фотографии</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {editForm.photoUrls?.map(url => (
                        <div key={url} className="relative group">
                            <img src={url} className="w-full h-24 object-cover rounded-lg" />
                            <button onClick={() => removePhoto(url)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">&times;</button>
                        </div>
                    ))}
                    <label className={`w-full h-24 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg  hover:bg-gray-700 transition ${isUploading ? 'cursor-not-allowed bg-gray-700' : 'cursor-pointer'}`}>
                         {isUploading ? (
                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                         ) : (
                            <span className="text-gray-400 text-2xl">+</span>
                         )}
                         <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" disabled={isUploading}/>
                    </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={handleCancelEdit} className="px-4 py-2 text-sm bg-gray-600 rounded-lg hover:bg-gray-500 transition">Отмена</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm bg-indigo-600 rounded-lg hover:bg-indigo-500 transition">Сохранить</button>
              </div>
            </div>
          ) : (
             // VIEWING PROFILE
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

        <div className="mt-8 bg-gray-800 p-6 rounded-2xl space-y-4">
            {/* Age Verification */}
            {!user.isAgeVerified && (
                <div>
                     <h3 className="font-semibold text-lg">Подтверждение возраста</h3>
                     <p className="text-gray-400 text-sm mb-3">Подтвердите свой возраст, чтобы получить значок и больше доверия от других пользователей.</p>
                     <button 
                       onClick={onVerifyAge} 
                       className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 transition rounded-lg disabled:bg-gray-600"
                       disabled={!!user.ageVerificationRequestId}
                      >
                       {user.ageVerificationRequestId ? 'Запрос на верификацию отправлен' : 'Пройти верификацию'}
                      </button>
                </div>
            )}
             {/* Share Location */}
            <div>
                 <h3 className="font-semibold text-lg">Видимость на карте</h3>
                 <div className="flex items-center justify-between">
                     <p className="text-gray-400 text-sm">Показывать меня на карте</p>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={user.shareLocation} onChange={e => updateUser({ id: user.id, shareLocation: e.target.checked })} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                 </div>
            </div>
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