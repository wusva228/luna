import { useState, useCallback, useEffect } from 'react';
import type { User, Rating, Ticket, PremiumRequest, Notification } from '../types';

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
  { id: ADMIN_ID, username: 'wusva', name: 'Администратор', email: 'admin@luna.app', age: 30, bio: 'Обеспечиваю порядок и веселье в Luna Dating.', photoUrl: 'https://i.pravatar.cc/400?u=admin', isVerified: true, isPremium: true, isBlocked: false, lastLogin: Date.now() },
  { id: 101, username: 'jessica_art', name: 'Джессика', email: 'jess@example.com', age: 24, bio: 'Люблю искусство, музыку и спонтанные приключения. Ищу кого-то с хорошим чувством юмора.', photoUrl: 'https://i.pravatar.cc/400?u=jessica', isVerified: true, isPremium: true, isBlocked: false, lastLogin: 0 },
  { id: 102, username: 'mike_climbs', name: 'Майк', email: 'mike@example.com', age: 28, bio: 'Днем программист, по выходным скалолаз. Моя собака - мой лучший друг.', photoUrl: 'https://i.pravatar.cc/400?u=mike', isVerified: false, isPremium: false, isBlocked: false, lastLogin: 0 },
  { id: 103, username: 'chloe_travels', name: 'Хлоя', email: 'chloe@example.com', age: 26, bio: 'Путешественница и гурман. Вероятно, смогу победить тебя в Mario Kart.', photoUrl: 'https://i.pravatar.cc/400?u=chloe', isVerified: false, isPremium: false, isBlocked: false, lastLogin: 0 },
  { id: 104, username: 'david_fit', name: 'Давид', email: 'david@example.com', age: 31, bio: 'Фитнес-энтузиаст и начинающий шеф-повар. Верю, что хороший разговор — лучшее первое свидание.', photoUrl: 'https://i.pravatar.cc/400?u=david', isVerified: true, isPremium: false, isBlocked: false, lastLogin: 0 },
];

const initialRatings: Rating[] = [
    { raterId: 102, ratedId: 101, score: 9, isSuperLike: false, timestamp: Date.now() - 200000 },
    { raterId: 103, ratedId: 102, score: 7, isSuperLike: false, timestamp: Date.now() - 300000 },
];

const initialTickets: Ticket[] = [
    { id: 't1', userId: 102, userName: 'Майк', subject: 'Предложение функции', message: 'Было бы круто иметь видео-профили! Планируете добавить такое?', status: 'open', timestamp: Date.now() - 86400000 },
];

const initialPremiumRequests: PremiumRequest[] = [];

export const usePersistentData = () => {
    const [users, setUsers] = useState<User[]>(() => getFromStorage('luna_users', initialUsers));
    const [ratings, setRatings] = useState<Rating[]>(() => getFromStorage('luna_ratings', initialRatings));
    const [tickets, setTickets] = useState<Ticket[]>(() => getFromStorage('luna_tickets', initialTickets));
    const [premiumRequests, setPremiumRequests] = useState<PremiumRequest[]>(() => getFromStorage('luna_premium_requests', initialPremiumRequests));

    useEffect(() => { setInStorage('luna_users', users); }, [users]);
    useEffect(() => { setInStorage('luna_ratings', ratings); }, [ratings]);
    useEffect(() => { setInStorage('luna_tickets', tickets); }, [tickets]);
    useEffect(() => { setInStorage('luna_premium_requests', premiumRequests); }, [premiumRequests]);

    const updateUser = useCallback((updatedUser: User) => {
        setUsers(currentUsers => currentUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    }, []);

    const addUser = useCallback((newUser: User) => {
        setUsers(currentUsers => {
            if (currentUsers.some(u => u.id === newUser.id)) {
                return currentUsers; // Prevent duplicates
            }
            return [...currentUsers, newUser];
        });
    }, []);

    const addRating = useCallback((rating: Rating) => {
        setRatings(currentRatings => [...currentRatings, rating]);
    }, []);

    const addTicket = useCallback((ticketData: Omit<Ticket, 'id' | 'timestamp' | 'status'>) => {
        const newTicket: Ticket = {
            ...ticketData,
            id: `t${Date.now()}`,
            timestamp: Date.now(),
            status: 'open',
        };
        setTickets(currentTickets => [newTicket, ...currentTickets]);
    }, []);
    
    const updateTicketStatus = useCallback((ticketId: string, status: 'open' | 'closed') => {
        setTickets(currentTickets => currentTickets.map(t => t.id === ticketId ? { ...t, status } : t));
    }, []);

    const addPremiumRequest = useCallback((userId: number, userName: string, userTg: string) => {
        setPremiumRequests(currentRequests => {
            // Prevent duplicate pending requests
            if (currentRequests.some(r => r.userId === userId && r.status === 'pending')) {
                return currentRequests;
            }
            const newRequest: PremiumRequest = { userId, userName, userTg, status: 'pending', timestamp: Date.now() };
            return [newRequest, ...currentRequests];
        });
    }, []);

    const approvePremiumRequest = useCallback((userId: number) => {
        setUsers(currentUsers => currentUsers.map(u => u.id === userId ? { ...u, isPremium: true } : u));
        setPremiumRequests(currentRequests => currentRequests.filter(r => r.userId !== userId));
    }, []);
    
    const getNotificationsForUser = useCallback((user: User | null | undefined): Notification[] => {
        if (!user) return [];
        const newRatings = ratings.filter(r => r.ratedId === user.id && r.timestamp > user.lastLogin);
        if (newRatings.length > 0) {
            return [{
                id: `like-${Date.now()}`,
                message: `У вас ${newRatings.length} новых оценок!`,
                type: 'like'
            }];
        }
        return [];
    }, [ratings]);

    const updateLastLogin = useCallback((userId: number) => {
        setUsers(currentUsers => currentUsers.map(u => u.id === userId ? { ...u, lastLogin: Date.now() } : u));
    }, []);


    return { users, ratings, tickets, premiumRequests, updateUser, addUser, addRating, addTicket, updateTicketStatus, addPremiumRequest, approvePremiumRequest, getNotificationsForUser, updateLastLogin };
};