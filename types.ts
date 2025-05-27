// src/features/incentives/types.ts
export interface LoginReward {
  day: number;
  reward: {
    type: 'token' | 'badge' | 'feature';
    amount: number;
    name: string;
    description: string;
  };
}

export interface UserStreak {
  currentStreak: number;
  lastLoginDate: string;
  weeklyCompletions: number;
  totalLogins: number;
  rewards: {
    claimed: string[];
    pending: string[];
  };
}

export interface UserProfile {
  email?: string;
  marketingConsent: boolean;
  notificationPreferences: {
    dailyReminders: boolean;
    weeklyReminders: boolean;
    marketingEmails: boolean;
  };
}
