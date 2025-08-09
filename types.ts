export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  age: number;
  bio: string;
  photoUrl: string;
  isVerified: boolean;
  isPremium: boolean;
  isBlocked: boolean;
  lastLogin: number; // timestamp
}

export interface Rating {
  raterId: number;
  ratedId: number;
  score: number;
  isSuperLike: boolean;
  timestamp: number; // Use number for easier localStorage serialization
}

export interface Ticket {
  id: string;
  userId: number;
  userName: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  timestamp: number;
}

export interface PremiumRequest {
  userId: number;
  userName: string;
  userTg: string;
  status: 'pending' | 'approved';
  timestamp: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'like' | 'info';
}


export type AppView = 'meet' | 'profile' | 'admin' | 'registration';