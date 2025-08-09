import React, { useState } from 'react';
import type { User } from '../types';

interface BannedScreenProps {
  user: User;
  onUnbanRequest: (reason: string) => void;
}

export const BannedScreen: React.FC<BannedScreenProps> = ({ user, onUnbanRequest }) => {
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Пожалуйста, опишите причину для разблокировки.');
      return;
    }
    onUnbanRequest(reason);
    setIsSubmitted(true);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-red-900/50 text-white p-4 text-center">
      <div className="max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-red-500">
        <h1 className="text-3xl font-bold text-red-400 mb-4">Ваш профиль заблокирован</h1>
        <p className="text-gray-300">Причина блокировки:</p>
        <p className="text-lg font-semibold my-3 text-white italic">"{user.banReason || 'Причина не указана.'}"</p>
        
        {isSubmitted ? (
            <p className="text-green-400 mt-4">Ваш запрос на разбан отправлен администратору. Ожидайте рассмотрения.</p>
        ) : (
            <>
                <p className="text-gray-400 mt-6">Если вы считаете, что это ошибка, вы можете отправить запрос на разбан.</p>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <textarea
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Опишите, почему ваш профиль следует разблокировать..."
                        rows={4}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white resize-none"
                        required
                    />
                    <button type="submit" className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-colors">
                        Отправить запрос на разбан
                    </button>
                </form>
            </>
        )}
      </div>
    </div>
  );
};