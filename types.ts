export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female';
  bio: string;
  photoUrls: string[]; // Can be standard URLs or base64 data URLs
  isVerified: boolean; // Admin-granted verification
  isPremium: boolean;
  isBlocked: boolean;
  banReason?: string;
  lastLogin: number; // timestamp
  
  // Geolocation
  location?: { lat: number; lon: number; };
  city?: string; // e.g., "Moscow"
  shareLocation: boolean;
  
  // New detailed profile fields
  height?: number;
  weight?: number;
  zodiacSign?: string;
  eyeColor?: string;
  preferences?: string;
  badHabits?: string;

  // Age verification
  isAgeVerified: boolean;
  ageVerificationPhotoUrl?: string; // URL of the document from Uploadcare
  ageVerificationRequestId?: string;
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

export interface AgeVerificationRequest {
    id: string;
    userId: number;
    userName: string;
    photoUrl: string; // URL of the document photo from Uploadcare
    status: 'pending' | 'approved' | 'rejected';
    timestamp: number;
}

export interface UnbanRequest {
    id: string;
    userId: number;
    userName: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'like' | 'info';
  onClick?: () => void;
}


export type AppView = 'meet' | 'profile' | 'admin' | 'registration' | 'map';