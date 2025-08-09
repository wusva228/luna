export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female'; // Добавлено обязательное поле пола
  bio: string;
  photoUrls: string[];
  isVerified: boolean;
  isPremium: boolean;
  isBlocked: boolean;
  lastLogin: number; // timestamp
  // New detailed profile fields
  height?: number;
  weight?: number;
  zodiacSign?: string;
  eyeColor?: string;
  preferences?: string;
  badHabits?: string;
}

export interface Rating {
  raterId: number;
  ratedId: number;
  score: number;
  isSuperLike: boolean;
  timestamp: number;
}

export interface Ticket {
  id: string;
  userId: number;
  userName: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  timestamp: number;
  reply?: string; // Admin's reply
}

export interface PremiumRequest {
  userId: number;
  userName: string;
  userTg: string;
  status: 'pending' | 'approved';
  timestamp: number;
}

export interface Report {
    id: string;
    reporterId: number;
    reportedId: number;
    reason: string;
    timestamp: number;
    status: 'open' | 'resolved';
}

export interface Notification {
  id: string;
  message: string;
  type: 'like' | 'info';
  onClick?: () => void;
}


export type AppView = 'meet' | 'profile' | 'admin' | 'registration';