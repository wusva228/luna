export interface User {
  id: number;
  username: string; // From Telegram, not editable
  name: string; // From Telegram, but editable
  email: string; // User-provided during registration
  age: number;
  bio: string;
  photoUrl: string; // From Telegram, but editable
  isVerified: boolean;
  isPremium: boolean;
  isBlocked: boolean;
}

export interface Rating {
  raterId: number;
  ratedId: number;
  score: number; // 1-10, or 11 for Super Like
  isSuperLike: boolean;
  timestamp: Date;
}

export interface Ticket {
  id: string;
  userId: number;
  userName: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  timestamp: Date;
}


export type AppView = 'meet' | 'profile' | 'admin' | 'registration';