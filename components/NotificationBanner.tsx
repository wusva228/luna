import React, { useState, useEffect } from 'react';
import type { Notification } from '../types';
import { PremiumIcon } from './icons'; // Using premium icon for likes

interface NotificationBannerProps {
  notification: Notification;
  onDismiss: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ notification, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            handleDismiss();
        }, 5000); // Auto-dismiss after 5 seconds

        return () => clearTimeout(timer);
    }, [notification]);

    const handleDismiss = () => {
        setIsVisible(false);
        // Allow time for fade-out animation before calling onDismiss
        setTimeout(() => {
            onDismiss();
        }, 300);
    };

    return (
        <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-50 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}
        >
            <div className="bg-indigo-500 text-white rounded-lg shadow-2xl p-3 flex items-center justify-between">
                <div className="flex items-center">
                    <PremiumIcon className="w-5 h-5 mr-3 text-yellow-300" />
                    <span className="font-medium text-sm">{notification.message}</span>
                </div>
                <button onClick={handleDismiss} className="text-indigo-100 hover:text-white text-xl leading-none">&times;</button>
            </div>
        </div>
    );
};
