import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { AppView, User, Notification, Ticket, Rating, PremiumRequest, Report, AgeVerificationRequest, UnbanRequest } from './types';
import * as api from './services/apiService';
import { BottomNav } from './components/BottomNav';
import { MeetPage } from './components/MeetPage';
import { ProfilePage } from './components/ProfilePage';
import { AdminPanel } from './components/AdminPanel';
import { RegistrationPage } from './components/RegistrationPage';
import { TicketModal } from './components/TicketModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { NotificationBanner } from './components/NotificationBanner';
import { LikesModal } from './components/LikesModal';
import { BannedScreen } from './components/BannedScreen';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { MapPage } from './components/MapPage';
import { ViewProfileModal } from './components/ViewProfileModal';


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
  // Centralized state management
  const [users, setUsers] = useState<User[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [premiumRequests, setPremiumRequests] = useState<PremiumRequest[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [ageVerificationRequests, setAgeVerificationRequests] = useState<AgeVerificationRequest[]>([]);
  const [unbanRequests, setUnbanRequests] = useState<UnbanRequest[]>([]);

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  // Modals state
  const [isTicketModalOpen, setTicketModalOpen] = useState(false);
  const [isLikesModalOpen, setLikesModalOpen] = useState(false);
  const [isAgeVerificationModalOpen, setAgeVerificationModalOpen] = useState(false);
  const [viewProfileUser, setViewProfileUser] = useState<User | null>(null);

  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load all data from API on mount
  const loadAllData = useCallback(async () => {
    const [
      usersData, ratingsData, ticketsData, premiumRequestsData, 
      reportsData, ageVerificationRequestsData, unbanRequestsData
    ] = await Promise.all([
      api.getUsers(), api.getRatings(), api.getTickets(), api.getPremiumRequests(),
      api.getReports(), api.getAgeVerificationRequests(), api.getUnbanRequests()
    ]);
    setUsers(usersData);
    setRatings(ratingsData);
    setTickets(ticketsData);
    setPremiumRequests(premiumRequestsData);
    setReports(reportsData);
    setAgeVerificationRequests(ageVerificationRequestsData);
    setUnbanRequests(unbanRequestsData);
  }, []);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const user = tg.initDataUnsafe?.user;
      
      if (user) {
        setTelegramUser(user);
        api.getUserById(user.id).then(userExists => {
          if (userExists) {
            setCurrentUserId(user.id);
          }
          setIsDataLoading(false);
        });
      } else {
        console.warn("Не удалось получить пользователя из Telegram.");
        setIsDataLoading(false);
      }
    } else {
        console.warn("Скрипт Telegram Web App не найден. Запуск в режиме локальной разработки.");
        const mockDevUser: TelegramUser = { id: 101, first_name: 'Джессика', username: 'jessica_art', photo_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop' };
        setTelegramUser(mockDevUser);
        api.getUserById(mockDevUser.id).then(userExists => {
          if (userExists) {
            setCurrentUserId(mockDevUser.id);
          }
          setIsDataLoading(false);
        });
    }
    loadAllData();
  }, [loadAllData]);
  
  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return users.find(u => u.id === currentUserId);
  }, [users, currentUserId]);

  const updateUserState = useCallback(async (updatedUserData: Partial<User> & { id: number }) => {
    const updatedUser = await api.updateUser(updatedUserData);
    if(updatedUser) {
       setUsers(currentUsers => currentUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
  }, []);

  // Handle notifications and login timestamp
  useEffect(() => {
    if (currentUser && currentUser.lastLogin > 0) { // lastLogin > 0 means it's not the very first load
        const newRatings = ratings.filter(r => r.ratedId === currentUser.id && r.timestamp > currentUser.lastLogin && r.score >= 6);
        if (newRatings.length > 0) {
            setNotifications([{
                id: `like-${Date.now()}`,
                message: `У вас ${newRatings.length} новых симпатий! Нажмите, чтобы посмотреть.`,
                type: 'like',
                onClick: () => setLikesModalOpen(true),
            }]);
        }
    }
    if (currentUser) {
        updateUserState({ id: currentUser.id, lastLogin: Date.now() });
    }
  }, [currentUserId, ratings]); // Depends on ratings being loaded


  const isAdmin = currentUser?.id === ADMIN_ID;
  const [view, setView] = useState<AppView>('meet');

  useEffect(() => {
    if (currentUser) {
      setView(isAdmin ? 'admin' : 'meet');
    }
  }, [currentUser, isAdmin]);

  const handleRegister = async (newUser: Omit<User, 'lastLogin'>) => {
    const registeredUser = await api.addUser({ ...newUser, lastLogin: Date.now() });
    setUsers(current => [...current, registeredUser]);
    setCurrentUserId(registeredUser.id);
    setShowWelcomeScreen(true);
  };
  
  const handleWelcomeClose = () => {
    setShowWelcomeScreen(false);
  }

  const handleCreateTicket = async (subject: string, message: string) => {
    if(!currentUser) return;
    const newTicket = await api.addTicket({
      userId: currentUser.id,
      userName: currentUser.name,
      subject,
      message,
    });
    setTickets(current => [newTicket, ...current]);
    setTicketModalOpen(false);
    alert('Ваш тикет был отправлен!');
  };

  const handleNotificationDismiss = (id: string) => {
    setNotifications(current => current.filter(n => n.id !== id));
  };
  
  const addRating = useCallback(async (rating: Rating) => {
      await api.addRating(rating);
      setRatings(current => [...current, rating]);
  }, []);
  
  const addReport = useCallback(async (reportedId: number, reason: string, reporterId: number) => {
    const newReport = await api.addReport(reportedId, reason, reporterId);
    setReports(current => [newReport, ...current]);
  }, []);

  const checkMatch = useCallback((userId1: number, userId2: number): boolean => {
      const u1_likes_u2 = ratings.some(r => r.raterId === userId1 && r.ratedId === userId2 && r.score >= 6);
      const u2_likes_u1 = ratings.some(r => r.raterId === userId2 && r.ratedId === userId1 && r.score >= 6);
      return u1_likes_u2 && u2_likes_u1;
  }, [ratings]);

  const getDistanceToUser = useCallback((user1: User, user2: User) => {
      return api.getDistanceBetweenUsers(user1, user2);
  }, []);
  
  const getLikers = useCallback((userId: number): User[] => {
      const likerIds = new Set(ratings.filter(r => r.ratedId === userId && r.score >= 6).map(r => r.raterId));
      return users.filter(u => likerIds.has(u.id));
  }, [ratings, users]);

  if (isDataLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">Загрузка данных...</div>;
  }
  
  if (showWelcomeScreen) {
    return <WelcomeScreen onClose={handleWelcomeClose} />
  }

  if (currentUser?.isBlocked) {
      return <BannedScreen 
        user={currentUser} 
        onUnbanRequest={async (reason) => {
            const req = await api.addUnbanRequest(currentUser.id, currentUser.name, reason);
            setUnbanRequests(current => [...current, req]);
        }} 
      />
  }

  if (!currentUser && telegramUser) {
    return <RegistrationPage telegramUser={telegramUser} onRegister={handleRegister}/>;
  }

  if (!currentUser) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center text-center p-4 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold text-red-500">Ошибка Аутентификации</h1>
        <p className="mt-2 text-gray-300">Не удалось аутентифицировать пользователя. Пожалуйста, попробуйте запустить приложение снова из Telegram.</p>
      </div>
    );
  }
  
  const handleUpgradeFromLikes = () => {
    setLikesModalOpen(false);
    setView('profile');
  };

  const renderView = () => {
    const premiumRequestForUser = premiumRequests.find(r => r.userId === currentUser.id);
    switch (view) {
      case 'meet':
        return <MeetPage 
            currentUser={currentUser} 
            users={users} 
            addRating={addRating} 
            ratings={ratings} 
            addReport={addReport}
            checkMatch={checkMatch}
            getDistanceToUser={getDistanceToUser}
        />;
      case 'map':
        return <MapPage users={users} currentUser={currentUser} />;
      case 'profile':
        return <ProfilePage 
            user={currentUser} 
            tickets={tickets}
            updateUser={updateUserState} 
            onContactAdmin={() => setTicketModalOpen(true)} 
            onVerifyAge={() => setAgeVerificationModalOpen(true)}
            requestPremium={async (id, name, tg) => {
              const req = await api.addPremiumRequest(id, name, tg);
              setPremiumRequests(current => [...current, req]);
            }} 
            premiumRequest={premiumRequestForUser} 
        />;
      case 'admin':
        return isAdmin ? <AdminPanel 
            users={users} 
            ratings={ratings} 
            tickets={tickets} 
            premiumRequests={premiumRequests} 
            reports={reports}
            ageVerificationRequests={ageVerificationRequests}
            unbanRequests={unbanRequests}
            updateUser={updateUserState} 
            updateTicketStatus={async (id, status) => {
                const updatedTicket = await api.updateTicketStatus(id, status);
                setTickets(current => current.map(t => t.id === id ? updatedTicket : t));
            }} 
            approvePremiumRequest={async (id) => {
                await api.approvePremiumRequest(id);
                updateUserState({id, isPremium: true});
                setPremiumRequests(current => current.filter(r => r.userId !== id));
            }}
            replyToTicket={async (id, reply) => {
                 const updatedTicket = await api.replyToTicket(id, reply);
                 setTickets(current => current.map(t => t.id === id ? updatedTicket : t));
            }}
            resolveReport={async (id) => {
                const updatedReport = await api.resolveReport(id);
                setReports(current => current.map(r => r.id === id ? updatedReport : r));
            }}
            handleAgeVerificationRequest={async (id, isApproved) => {
                const req = await api.handleAgeVerificationRequest(id, isApproved);
                setAgeVerificationRequests(current => current.map(r => r.id === id ? req : r));
                if (req.status === 'approved') {
                    updateUserState({ id: req.userId, isAgeVerified: true });
                }
            }}
            handleUnbanRequest={async (id, isApproved) => {
                const req = await api.handleUnbanRequest(id, isApproved);
                setUnbanRequests(current => current.map(r => r.id === id ? req : r));
                if (req.status === 'approved') {
                    updateUserState({ id: req.userId, isBlocked: false, banReason: undefined });
                }
            }}
        /> : <div className="p-8 text-center">Доступ запрещен</div>;
      default:
        return <MeetPage 
            currentUser={currentUser} 
            users={users} 
            addRating={addRating} 
            ratings={ratings}
            addReport={addReport}
            checkMatch={checkMatch}
            getDistanceToUser={getDistanceToUser}
        />;
    }
  };
  
  const userTickets = tickets.filter(t => t.userId === currentUser.id);

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
        userTickets={userTickets}
      />
      <LikesModal
        isOpen={isLikesModalOpen}
        onClose={() => setLikesModalOpen(false)}
        currentUser={currentUser}
        getLikers={getLikers}
        onUpgrade={handleUpgradeFromLikes}
        onViewProfile={(user) => setViewProfileUser(user)}
      />
      <AgeVerificationModal
        isOpen={isAgeVerificationModalOpen}
        onClose={() => setAgeVerificationModalOpen(false)}
        onSubmit={async (photoUrl) => {
            const req = await api.addAgeVerificationRequest(currentUser.id, currentUser.name, photoUrl);
            setAgeVerificationRequests(current => [...current, req]);
            setAgeVerificationModalOpen(false);
            alert('Ваш запрос на верификацию отправлен.');
        }}
      />
      {viewProfileUser && (
        <ViewProfileModal
            user={viewProfileUser}
            isOpen={!!viewProfileUser}
            onClose={() => setViewProfileUser(null)}
            isMatch={checkMatch(currentUser.id, viewProfileUser.id)}
            distance={getDistanceToUser(currentUser, viewProfileUser)}
        />
      )}
    </div>
  );
};

export default App;
