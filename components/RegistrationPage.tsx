import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface RegistrationPageProps {
  telegramUser: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  };
  onRegister: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ telegramUser, onRegister, updateUser }) => {
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [bio, setBio] = useState('Привет в Luna Dating! Ищу с кем познакомиться.');
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [shareLocation, setShareLocation] = useState(true);
  
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        // In a real app, you would use a reverse geocoding API here.
        // For now, we'll just store coords.
        setCity("Местоположение определено"); 
      },
      (error) => {
        console.error("Ошибка получения геолокации:", error);
        alert("Не удалось получить вашу геолокацию. Вы можете продолжить без нее.");
      }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !age.trim() || !gender) {
      alert('Пожалуйста, заполните все обязательные поля, включая пол.');
      return;
    }
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 18) {
      alert('Вам должно быть не менее 18 лет.');
      return;
    }
    const newUser: User = {
      id: telegramUser.id,
      username: telegramUser.username || `user${telegramUser.id}`,
      name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
      email,
      age: parsedAge,
      gender,
      bio,
      photoUrls: telegramUser.photo_url ? [telegramUser.photo_url] : [`https://i.pravatar.cc/400?u=${telegramUser.id}`],
      isVerified: false,
      isPremium: false,
      isBlocked: false,
      lastLogin: Date.now(),
      location: location || undefined,
      city,
      shareLocation,
      isAgeVerified: false,
      height: height ? parseInt(height) : undefined,
      weight: weight ? parseInt(weight) : undefined,
      zodiacSign: zodiacSign || undefined,
    };
    onRegister(newUser);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-white antialiased">
      <div className="w-full max-w-md">
        <div className="text-center">
            <img 
              src={telegramUser.photo_url || `https://i.pravatar.cc/200?u=${telegramUser.id}`} 
              alt="Profile" 
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 shadow-lg"
            />
            <h1 className="text-3xl font-bold">Добро пожаловать, {telegramUser.first_name}!</h1>
            <p className="text-gray-400 mt-2">Давайте завершим ваш профиль для начала знакомств в Luna Dating.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Основная информация</h3>
          
           <div>
            <label className="text-sm font-medium text-gray-300">Ваш пол <span className="text-red-500">*</span></label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${gender === 'male' ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Мужской ♂️
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${gender === 'female' ? 'bg-pink-600 text-white ring-2 ring-pink-400' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Женский ♀️
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email адрес <span className="text-red-500">*</span></label>
            <input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="age" className="text-sm font-medium text-gray-300">Возраст <span className="text-red-500">*</span></label>
            <input
              id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required min="18"
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              placeholder="Вам должно быть 18 или больше"
            />
          </div>

          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 pt-4">Дополнительно (необязательно)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="height" className="text-sm font-medium text-gray-300">Рост (см)</label>
                    <input id="height" type="number" value={height} onChange={e => setHeight(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                </div>
                 <div>
                    <label htmlFor="weight" className="text-sm font-medium text-gray-300">Вес (кг)</label>
                    <input id="weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
                </div>
            </div>
             <div>
                <label htmlFor="zodiacSign" className="text-sm font-medium text-gray-300">Знак зодиака</label>
                <input id="zodiacSign" type="text" value={zodiacSign} onChange={e => setZodiacSign(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3" />
            </div>

             <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 pt-4">Приватность</h3>
             <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <label htmlFor="shareLocation" className="text-sm font-medium text-gray-300">Показывать меня на карте</label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="shareLocation" checked={shareLocation} onChange={e => setShareLocation(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-transform transform hover:scale-105"
            >
              Завершить регистрацию и войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};