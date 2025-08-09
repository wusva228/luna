import { useState, useCallback, useEffect } from 'react';
import type { User, Rating, Ticket, PremiumRequest, Notification, Report } from '../types';

const ADMIN_ID = 7264453091;

// Helper to get data from localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

// Helper to set data to localStorage
const setInStorage = <T>(key: string, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};


const initialUsers: User[] = [
  { id: ADMIN_ID, username: 'wusva', name: 'Администратор', email: 'admin@luna.app', age: 30, gender: 'male', bio: 'Обеспечиваю порядок и веселье в Luna Dating.', photoUrls: ['https://i.pravatar.cc/400?u=admin'], isVerified: true, isPremium: true, isBlocked: false, lastLogin: Date.now() },
  { id: 101, username: 'jessica_art', name: 'Джессика', email: 'jess@example.com', age: 24, gender: 'female', bio: 'Люблю искусство, музыку и спонтанные приключения. Ищу кого-то с хорошим чувством юмора.', photoUrls: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop'], isVerified: true, isPremium: true, isBlocked: false, lastLogin: 0, height: 170, zodiacSign: 'Весы', eyeColor: 'Голубой' },
  { id: 102, username: 'mike_climbs', name: 'Майк', email: 'mike@example.com', age: 28, gender: 'male', bio: 'Днем программист, по выходным скалолаз. Моя собака - мой лучший друг.', photoUrls: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop'], isVerified: false, isPremium: false, isBlocked: false, lastLogin: 0, height: 182, weight: 80, preferences: 'Горы, код, собаки' },
  { id: 103, username: 'chloe_travels', name: 'Хлоя', email: 'chloe@example.com', age: 26, gender: 'female', bio: 'Путешественница и гурман. Вероятно, смогу победить тебя в Mario Kart.', photoUrls: ['https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop'], isVerified: false, isPremium: false, isBlocked: false, lastLogin: 0, zodiacSign: 'Стрелец', badHabits: 'Прокрастинация' },
  { id: 104, username: 'david_fit', name: 'Давид', email: 'david@example.com', age: 31, gender: 'male', bio: 'Фитнес-энтузиаст и начинающий шеф-повар. Верю, что хороший разговор — лучшее первое свидание.', photoUrls: ['https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop'], isVerified: true, isPremium: false, isBlocked: false, lastLogin: 0, height: 185, weight: 85 },
];

const initialRatings: Rating[] = [
    { raterId: 102, ratedId: 101, score: 9, isSuperLike: false, timestamp: Date.now() - 200000 },
    { raterId: 103, ratedId: 102, score: 7, isSuperLike: false, timestamp: Date.now() - 300000 },
    { raterId: 101, ratedId: 102, score: 8, isSuperLike: false, timestamp: Date.now() - 100000 }, // Mutual like
];

const initialTickets: Ticket[] = [
    { id: 't1', userId: 102, userName: 'Майк', subject: 'Предложение функции', message: 'Было бы круто иметь видео-профили! Планируете добавить такое?', status: 'open', timestamp: Date.now() - 86400000 },
];

const initialPremiumRequests: PremiumRequest[] = [];
const initialReports: Report[] = [];

export const usePersistentData = () => {
    const [users, setUsers] = useState<User[]>(() => getFromStorage('luna_users', initialUsers));
    const [ratings, setRatings] = useState<Rating[]>(() => getFromStorage('luna_ratings', initialRatings));
    const [tickets, setTickets] = useState<Ticket[]>(() => getFromStorage('luna_tickets', initialTickets));
    const [premiumRequests, setPremiumRequests] = useState<PremiumRequest[]>(() => getFromStorage('luna_premium_requests', initialPremiumRequests));
    const [reports, setReports] = useState<Report[]>(() => getFromStorage('luna_reports', initialReports));

    useEffect(() => { setInStorage('luna_users', users); }, [users]);
    useEffect(() => { setInStorage('luna_ratings', ratings); }, [ratings]);
    useEffect(() => { setInStorage('luna_tickets', tickets); }, [tickets]);
    useEffect(() => { setInStorage('luna_premium_requests', premiumRequests); }, [premiumRequests]);
    useEffect(() => { setInStorage('luna_reports', reports); }, [reports]);

    const updateUser = useCallback((updatedUserData: Partial<User>) => {
        setUsers(currentUsers => currentUsers.map(u => u.id === updatedUserData.id ? { ...u, ...updatedUserData } : u));
    }, []);

    const addUser = useCallback((newUser: User) => {
        setUsers(currentUsers => {
            if (currentUsers.some(u => u.id === newUser.id)) {
                return currentUsers;
            }
            return [...currentUsers, newUser];
        });
    }, []);

    const addRating = useCallback((rating: Rating) => {
        setRatings(currentRatings => [...currentRatings, rating]);
    }, []);

    const addTicket = useCallback((ticketData: Omit<Ticket, 'id' | 'timestamp' | 'status'>) => {
        const newTicket: Ticket = { ...ticketData, id: `t${Date.now()}`, timestamp: Date.now(), status: 'open' };
        setTickets(currentTickets => [newTicket, ...currentTickets]);
    }, []);
    
    const replyToTicket = useCallback((ticketId: string, reply: string) => {
        setTickets(current => current.map(t => t.id === ticketId ? { ...t, reply, status: 'closed' } : t));
    }, []);

    const updateTicketStatus = useCallback((ticketId: string, status: 'open' | 'closed') => {
        setTickets(current => current.map(t => t.id === ticketId ? { ...t, status } : t));
    }, []);

    const addPremiumRequest = useCallback((userId: number, userName: string, userTg: string) => {
        setPremiumRequests(current => {
            if (current.some(r => r.userId === userId && r.status === 'pending')) return current;
            const newRequest: PremiumRequest = { userId, userName, userTg, status: 'pending', timestamp: Date.now() };
            return [newRequest, ...current];
        });
    }, []);

    const approvePremiumRequest = useCallback((userId: number) => {
        setUsers(current => current.map(u => u.id === userId ? { ...u, isPremium: true } : u));
        setPremiumRequests(current => current.filter(r => r.userId !== userId));
    }, []);
    
    const addReport = useCallback((reportedId: number, reason: string, reporterId: number) => {
        const newReport: Report = { id: `rep${Date.now()}`, reportedId, reporterId, reason, status: 'open', timestamp: Date.now() };
        setReports(current => [newReport, ...current]);
    }, []);

    const resolveReport = useCallback((reportId: string) => {
        setReports(current => current.map(r => r.id === reportId ? {...r, status: 'resolved'} : r));
    }, []);

    const getLikers = useCallback((userId: number): User[] => {
        const likerIds = new Set(ratings.filter(r => r.ratedId === userId && r.score >= 6).map(r => r.raterId));
        return users.filter(u => likerIds.has(u.id));
    }, [ratings, users]);

    const checkMatch = useCallback((userId1: number, userId2: number): boolean => {
        const u1_likes_u2 = ratings.some(r => r.raterId === userId1 && r.ratedId === userId2 && r.score >= 6);
        const u2_likes_u1 = ratings.some(r => r.raterId === userId2 && r.ratedId === userId1 && r.score >= 6);
        return u1_likes_u2 && u2_likes_u1;
    }, [ratings]);

    const getNotificationsForUser = useCallback((user: User | null | undefined, onLikeClick: () => void): Notification[] => {
        if (!user) return [];
        const newRatings = ratings.filter(r => r.ratedId === user.id && r.timestamp > user.lastLogin && r.score >= 6);
        if (newRatings.length > 0) {
            return [{
                id: `like-${Date.now()}`,
                message: `У вас ${newRatings.length} новых симпатий! Нажмите, чтобы посмотреть.`,
                type: 'like',
                onClick: onLikeClick,
            }];
        }
        return [];
    }, [ratings]);

    const updateLastLogin = useCallback((userId: number) => {
        updateUser({ id: userId, lastLogin: Date.now() });
    }, [updateUser]);

    return { users, ratings, tickets, premiumRequests, reports, updateUser, addUser, addRating, addTicket, updateTicketStatus, addPremiumRequest, approvePremiumRequest, getNotificationsForUser, updateLastLogin, checkMatch, getLikers, addReport, replyToTicket, resolveReport };
};