
import { useState, useCallback } from 'react';
import type { User, Rating, Ticket } from '../types';

const ADMIN_ID = 7264453091;

const initialUsers: User[] = [
  { id: ADMIN_ID, username: 'admin_user', name: 'Admin', email: 'admin@telemeet.app', age: 30, bio: 'Keeping TeleMeet safe and fun. I have the power!', photoUrl: 'https://picsum.photos/id/1005/400/600', isVerified: true, isPremium: true, isBlocked: false },
  { id: 101, username: 'jessica_art', name: 'Jessica', email: 'jess@example.com', age: 24, bio: 'Lover of art, music, and spontaneous adventures. Looking for someone with a good sense of humor.', photoUrl: 'https://picsum.photos/id/1011/400/600', isVerified: true, isPremium: true, isBlocked: false },
  { id: 102, username: 'mike_climbs', name: 'Mike', email: 'mike@example.com', age: 28, bio: 'Software engineer by day, rock climber by weekend. My dog is my best friend. Tacos are my love language.', photoUrl: 'https://picsum.photos/id/1012/400/600', isVerified: false, isPremium: false, isBlocked: false },
  { id: 103, username: 'chloe_travels', name: 'Chloe', email: 'chloe@example.com', age: 26, bio: 'Globetrotter and foodie. I can probably beat you at Mario Kart. Let\'s find the best coffee spot in town.', photoUrl: 'https://picsum.photos/id/1013/400/600', isVerified: false, isPremium: false, isBlocked: false },
  { id: 104, username: 'david_fit', name: 'David', email: 'david@example.com', age: 31, bio: 'Fitness enthusiast and aspiring chef. I believe a good conversation is the best first date.', photoUrl: 'https://picsum.photos/id/1014/400/600', isVerified: true, isPremium: false, isBlocked: false },
  { id: 105, username: 'sophia_reads', name: 'Sophia', email: 'sophia@example.com', age: 22, bio: 'Student, dreamer, and a bit of a bookworm. Let\'s talk about anything and everything.', photoUrl: 'https://picsum.photos/id/1015/400/600', isVerified: false, isPremium: false, isBlocked: false },
  { id: 201, username: 'liam_music', name: 'Liam', email: 'liam@example.com', age: 29, bio: 'Musician and nature lover. Just looking for my harmony.', photoUrl: 'https://picsum.photos/id/1025/400/600', isVerified: false, isPremium: false, isBlocked: true },
];

const initialRatings: Rating[] = [
    { raterId: 102, ratedId: 101, score: 9, isSuperLike: false, timestamp: new Date() },
    { raterId: 103, ratedId: 102, score: 7, isSuperLike: false, timestamp: new Date() },
];

const initialTickets: Ticket[] = [
    { id: 't1', userId: 102, userName: 'Mike', subject: 'Feature Request', message: 'It would be cool to have video profiles! Is that something you are planning to add?', status: 'open', timestamp: new Date(Date.now() - 86400000) },
    { id: 't2', userId: 105, userName: 'Sophia', subject: 'Login Issue', message: 'I was having trouble logging in yesterday but it seems to be fixed now. Just letting you know.', status: 'closed', timestamp: new Date(Date.now() - 172800000) },
];


export const useMockData = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [ratings, setRatings] = useState<Rating[]>(initialRatings);
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

    const updateUser = useCallback((updatedUser: User) => {
        setUsers(currentUsers => currentUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
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
        const newTicket: Ticket = {
            ...ticketData,
            id: `t${Date.now()}`,
            timestamp: new Date(),
            status: 'open',
        };
        setTickets(currentTickets => [newTicket, ...currentTickets]);
    }, []);
    
    const updateTicketStatus = useCallback((ticketId: string, status: 'open' | 'closed') => {
        setTickets(currentTickets => currentTickets.map(t => t.id === ticketId ? { ...t, status } : t));
    }, []);


    return { users, ratings, tickets, updateUser, addUser, addRating, addTicket, updateTicketStatus };
};