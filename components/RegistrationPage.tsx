
import React, { useState } from 'react';
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
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ telegramUser, onRegister }) => {
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('New to TeleMeet! Looking to connect.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !age.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 18) {
      alert('You must be at least 18 years old.');
      return;
    }
    const newUser: User = {
      id: telegramUser.id,
      username: telegramUser.username || `user${telegramUser.id}`,
      name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
      email,
      age: parsedAge,
      bio,
      photoUrl: telegramUser.photo_url || `https://picsum.photos/seed/${telegramUser.id}/400/600`,
      isVerified: false,
      isPremium: false,
      isBlocked: false,
    };
    onRegister(newUser);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-white antialiased">
      <div className="w-full max-w-md text-center">
        <img 
          src={telegramUser.photo_url || `https://picsum.photos/seed/${telegramUser.id}/200/200`} 
          alt="Profile" 
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 shadow-lg"
        />
        <h1 className="text-3xl font-bold">Welcome, {telegramUser.first_name}!</h1>
        <p className="text-gray-400 mt-2">Let's complete your profile to get you started on TeleMeet.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-300">Telegram Username</label>
            <input
              id="username"
              type="text"
              value={telegramUser.username ? `@${telegramUser.username}` : '(Not Set)'}
              disabled
              className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none sm:text-sm disabled:opacity-70"
            />
             {!telegramUser.username && <p className="text-xs text-yellow-400 mt-1">Please set a public username in Telegram settings for the best experience.</p>}
          </div>
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-300">Display Name</label>
            <input
              id="name"
              type="text"
              defaultValue={`${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim()}
              disabled
              className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none sm:text-sm disabled:opacity-70"
            />
             <p className="text-xs text-gray-400 mt-1">Your name can be changed later from your profile.</p>
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address <span className="text-red-500">*</span></label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="age" className="text-sm font-medium text-gray-300">Age <span className="text-red-500">*</span></label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min="18"
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              placeholder="Must be 18 or older"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-transform transform hover:scale-105"
            >
              Complete Registration & Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
