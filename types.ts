
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isLocked: boolean;
  type: 'video' | 'text' | 'practical';
  description?: string;
  videoUrl?: string; // For admin uploaded videos
  transcript?: string; // For admin uploaded transcripts
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  partnerName: string; // The partner uploading the course
  description: string;
  modules: Module[];
  thumbnailUrl?: string;
  progress?: number; // 0-100 for gamification
  xp?: number; // Gamification points
  levelRequired?: number;
}

export interface PricingTier {
  id: string;
  name: string;
  priceUSD: number;
  priceZAR: number;
  features: string[];
  isRecommended?: boolean;
  cta: string;
}

export interface ReferralCode {
  code: string;
  discountPercent: number;
  assignedBy: string; // Admin who created it
  isActive: boolean;
}

export enum ViewState {
  LANDING = 'LANDING',
  STUDENT_DASHBOARD = 'STUDENT_DASHBOARD',
  COURSE = 'COURSE',
  PARTNER_HUB = 'PARTNER_HUB',
  BREAKOUT = 'BREAKOUT',
  LOGIN = 'LOGIN',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system' | 'ai';
  text: string;
  timestamp: Date;
  senderName?: string;
  avatar?: string;
  type?: 'text' | 'gif';
}

export interface AdminSettings {
  chatWebhookUrl: string;
}

export interface UserContext {
  currency: 'ZAR' | 'USD';
  countryCode: string;
  isAdmin: boolean;
  region?: string;
  isAuthenticated: boolean;
  displayName?: string;
  photoURL?: string;
  email?: string;
}