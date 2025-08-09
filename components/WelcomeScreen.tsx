import React from 'react';

interface WelcomeScreenProps {
  onClose: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onClose }) => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center fade-in">
        <div className="max-w-md">
            <h1 className="text-4xl font-bold text-indigo-400 mb-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
              Привет, это луна
            </h1>
            <p className="text-xl text-gray-300 mb-10 fade-in-up" style={{ animationDelay: '0.5s' }}>
              тут ты найдешь свою половинку, или даже целое
            </p>
            <button
                onClick={onClose}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold text-white transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 fade-in-up"
                style={{ animationDelay: '0.8s' }}
            >
                Спасибо!
            </button>
        </div>
        <div className="absolute bottom-6 text-sm text-gray-600 fade-in" style={{ animationDelay: '1.2s' }}>
          Made by WUSVA
        </div>
    </div>
  );
};
