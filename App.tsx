
import React, { useState, useMemo, useEffect } from 'react';
import type { AppView, User, Ticket } from './types';
import { useMockData } from './hooks/useMockData';
import { BottomNav } from './components/BottomNav';
import { MeetPage } from './components/MeetPage';
import { ProfilePage } from './components/ProfilePage';
import { AdminPanel } from './components/AdminPanel';
import { RegistrationPage } from './components/RegistrationPage';
import { TicketModal } from './components/TicketModal';

// Extend the Window interface to include the Telegram Web App object
declare global {
  interface Window {
    Telegram?: any;
  }
}

// Define a type for Telegram's user object for clarity
type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

const ADMIN_ID = 7264453091;

const App: React.FC = () => {
  const { users, ratings, tickets, updateUser, addUser, addRating, addTicket, updateTicketStatus } = useMockData();
  
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTicketModalOpen, setTicketModalOpen] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      
      const user = tg.initDataUnsafe?.user;
      
      if (user) {
        setTelegramUser(user);
        const userExists = users.some(u => u.id === user.id);
        if (userExists) {
          setCurrentUserId(user.id);
        }
      } else {
        console.warn("Could not retrieve user from Telegram. App may not function correctly.");
      }
      setIsLoading(false);
    } else {
        console.warn("Telegram Web App script not found. Running in local dev mode.");
        // Fallback for local development without Telegram
        const mockDevUser: TelegramUser = { id: 102, first_name: 'Mike (Dev)', username: 'mike_climbs' };
        setTelegramUser(mockDevUser);
        setCurrentUserId(mockDevUser.id);
        setIsLoading(false);
    }
  }, []); // Run only once on mount

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
  };

  const handleCreateTicket = (subject: string, message: string) => {
    if(!currentUser) return;
    addTicket({
      userId: currentUser.id,
      userName: currentUser.name,
      subject,
      message,
    });
    setTicketModalOpen(false);
    alert('Your ticket has been submitted!');
  };

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">Connecting to Telegram...</div>;
  }
  
  if (!currentUser && telegramUser) {
    return <RegistrationPage telegramUser={telegramUser} onRegister={handleRegister} />;
  }

  if (!currentUser) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center text-center p-4 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold text-red-500">Authentication Failed</h1>
        <p className="mt-2 text-gray-300">Could not authenticate user. Please try launching the app again from Telegram.</p>
        <p className="mt-1 text-gray-400 text-sm">(If developing locally, make sure a mock user is set).</p>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'meet':
        return <MeetPage currentUser={currentUser} users={users} addRating={addRating} ratings={ratings} />;
      case 'profile':
        return <ProfilePage user={currentUser} updateUser={updateUser} onContactAdmin={() => setTicketModalOpen(true)} />;
      case 'admin':
        return isAdmin ? <AdminPanel users={users} ratings={ratings} tickets={tickets} updateUser={updateUser} updateTicketStatus={updateTicketStatus} /> : <div className="p-8 text-center">Access Denied</div>;
      default:
        return <MeetPage currentUser={currentUser} users={users} addRating={addRating} ratings={ratings} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 font-sans flex flex-col overflow-hidden">
      <main className="flex-grow overflow-y-auto" style={{paddingBottom: '80px'}}>
        {renderView()}
      </main>
      <BottomNav currentView={view} setView={setView} isAdmin={isAdmin} />
      <TicketModal 
        isOpen={isTicketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
};

export default App;