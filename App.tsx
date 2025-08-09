import React, { useState, useMemo, useEffect } from 'react';
import type { AppView, User, Notification } from './types';
import { usePersistentData } from './hooks/usePersistentData';
import { BottomNav } from './components/BottomNav';
import { MeetPage } from './components/MeetPage';
import { ProfilePage } from './components/ProfilePage';
import { AdminPanel } from './components/AdminPanel';
import { RegistrationPage } from './components/RegistrationPage';
import { TicketModal } from './components/TicketModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { NotificationBanner } from './components/NotificationBanner';


declare global {
  interface Window {
    Telegram?: any;
  }
}

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

const ADMIN_ID = 7264453091;

const App: React.FC = () => {
  const { users, ratings, tickets, premiumRequests, updateUser, addUser, addRating, addTicket, updateTicketStatus, addPremiumRequest, approvePremiumRequest, getNotificationsForUser, updateLastLogin } = usePersistentData();
  
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTicketModalOpen, setTicketModalOpen] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      
      const user = tg.initDataUnsafe?.user;
      
      if (user) {
        setTelegramUser(user);
        const userExists = users.find(u => u.id === user.id);
        if (userExists) {
          setCurrentUserId(user.id);
          setNotifications(getNotificationsForUser(userExists));
          updateLastLogin(user.id);
        }
      } else {
        console.warn("Не удалось получить пользователя из Telegram.");
      }
      setIsLoading(false);
    } else {
        console.warn("Скрипт Telegram Web App не найден. Запуск в режиме локальной разработки.");
        const mockDevUser: TelegramUser = { id: 102, first_name: 'Майк (Дев)', username: 'mike_climbs' };
        setTelegramUser(mockDevUser);
        const userExists = users.find(u => u.id === mockDevUser.id);
         if (userExists) {
          setCurrentUserId(mockDevUser.id);
          setNotifications(getNotificationsForUser(userExists));
          updateLastLogin(mockDevUser.id);
        }
        setIsLoading(false);
    }
  }, []);

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return users.find(u => u.id === currentUserId);
  }, [users, currentUserId]);

  const isAdmin = currentUser?.id === ADMIN_ID;
  const [view, setView] = useState<AppView>('meet');

  useEffect(() => {
    if (currentUser) {
      setView(isAdmin ? 'admin' : 'meet');
    }
  }, [currentUser, isAdmin]);

  const handleRegister = (newUser: User) => {
    addUser(newUser);
    setCurrentUserId(newUser.id);
    setShowWelcomeScreen(true);
  };
  
  const handleWelcomeClose = () => {
    setShowWelcomeScreen(false);
  }

  const handleCreateTicket = (subject: string, message: string) => {
    if(!currentUser) return;
    addTicket({
      userId: currentUser.id,
      userName: currentUser.name,
      subject,
      message,
    });
    setTicketModalOpen(false);
    alert('Ваш тикет был отправлен!');
  };

  const handleNotificationDismiss = (id: string) => {
    setNotifications(current => current.filter(n => n.id !== id));
  };


  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">Подключение к Telegram...</div>;
  }
  
  if (showWelcomeScreen) {
    return <WelcomeScreen onClose={handleWelcomeClose} />
  }

  if (!currentUser && telegramUser) {
    return <RegistrationPage telegramUser={telegramUser} onRegister={handleRegister} />;
  }

  if (!currentUser) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center text-center p-4 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold text-red-500">Ошибка Аутентификации</h1>
        <p className="mt-2 text-gray-300">Не удалось аутентифицировать пользователя. Пожалуйста, попробуйте запустить приложение снова из Telegram.</p>
      </div>
    );
  }

  const renderView = () => {
    const premiumRequestForUser = premiumRequests.find(r => r.userId === currentUser.id);
    switch (view) {
      case 'meet':
        return <MeetPage currentUser={currentUser} users={users} addRating={addRating} ratings={ratings} />;
      case 'profile':
        return <ProfilePage user={currentUser} updateUser={updateUser} onContactAdmin={() => setTicketModalOpen(true)} requestPremium={addPremiumRequest} premiumRequest={premiumRequestForUser} />;
      case 'admin':
        return isAdmin ? <AdminPanel users={users} ratings={ratings} tickets={tickets} premiumRequests={premiumRequests} updateUser={updateUser} updateTicketStatus={updateTicketStatus} approvePremiumRequest={approvePremiumRequest} /> : <div className="p-8 text-center">Доступ запрещен</div>;
      default:
        return <MeetPage currentUser={currentUser} users={users} addRating={addRating} ratings={ratings} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 font-sans flex flex-col overflow-hidden">
      {notifications.map(n => (
          <NotificationBanner key={n.id} notification={n} onDismiss={() => handleNotificationDismiss(n.id)} />
      ))}
      <main className="flex-grow overflow-y-auto" style={{paddingBottom: '80px'}}>
        {renderView()}
      </main>
      <BottomNav currentView={view} setView={setView} isAdmin={isAdmin} />
      <TicketModal 
        isOpen={isTicketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
       <div className="fixed bottom-16 left-1/2 -translate-x-1/2 text-xs text-gray-600 z-0">
          Made by WUSVA
       </div>
    </div>
  );
};

export default App;
