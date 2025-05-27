// src/features/incentives/services/incentiveService.ts
import { LoginReward, UserStreak } from '../types';

// Daily rewards configuration
const DAILY_REWARDS: LoginReward[] = [
  {
    day: 1,
    reward: {
      type: 'token',
      amount: 5,
      name: 'DIGZ Tokens',
      description: 'Welcome reward for your first login!'
    }
  },
  {
    day: 2,
    reward: {
      type: 'token',
      amount: 10,
      name: 'DIGZ Tokens',
      description: 'You\'re on a streak! Keep going!'
    }
  },
  {
    day: 3,
    reward: {
      type: 'token',
      amount: 15,
      name: 'DIGZ Tokens',
      description: 'Three days in a row! You\'re doing great!'
    }
  },
  {
    day: 4,
    reward: {
      type: 'token',
      amount: 20,
      name: 'DIGZ Tokens',
      description: 'Four days and counting!'
    }
  },
  {
    day: 5,
    reward: {
      type: 'token',
      amount: 25,
      name: 'DIGZ Tokens',
      description: 'Five days! You\'re almost there!'
    }
  },
  {
    day: 6,
    reward: {
      type: 'token',
      amount: 30,
      name: 'DIGZ Tokens',
      description: 'Six days! One more for the weekly bonus!'
    }
  },
  {
    day: 7,
    reward: {
      type: 'token',
      amount: 100,
      name: 'DIGZ Tokens',
      description: 'Weekly completion bonus! Amazing work!'
    }
  }
];

// Weekly bonus (in addition to day 7 reward)
const WEEKLY_COMPLETION_BONUS = {
  type: 'badge',
  amount: 1,
  name: 'Weekly Champion',
  description: 'Completed a full week of logins!'
};

class IncentiveService {
  // Check if user should receive a login reward today
  checkDailyReward(userStreak: UserStreak): LoginReward | null {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = userStreak.lastLoginDate;
    
    // If already logged in today, no reward
    if (lastLogin === today) {
      return null;
    }
    
    // If last login was yesterday, continue streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    let currentDay = userStreak.currentStreak;
    
    if (lastLogin === yesterdayStr) {
      // Continue streak
      currentDay += 1;
    } else {
      // Streak broken, start over
      currentDay = 1;
    }
    
    // Get reward for current day (capped at 7, then cycles)
    const dayIndex = (currentDay - 1) % 7;
    return DAILY_REWARDS[dayIndex];
  }
  
  // Update user streak after login
  updateUserStreak(userStreak: UserStreak): UserStreak {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = userStreak.lastLoginDate;
    
    // If already logged in today, no change
    if (lastLogin === today) {
      return userStreak;
    }
    
    // Check if continuing streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    let newStreak = userStreak;
    
    if (lastLogin === yesterdayStr) {
      // Continue streak
      newStreak.currentStreak += 1;
    } else {
      // Streak broken, start over
      newStreak.currentStreak = 1;
    }
    
    // Update last login date
    newStreak.lastLoginDate = today;
    newStreak.totalLogins += 1;
    
    // Check for weekly completion
    if (newStreak.currentStreak % 7 === 0) {
      newStreak.weeklyCompletions += 1;
      // Add weekly bonus to pending rewards
      newStreak.rewards.pending.push(`weekly_${newStreak.weeklyCompletions}`);
    }
    
    return newStreak;
  }
  
  // Initialize a new user streak
  initializeUserStreak(): UserStreak {
    return {
      currentStreak: 0,
      lastLoginDate: '',
      weeklyCompletions: 0,
      totalLogins: 0,
      rewards: {
        claimed: [],
        pending: []
      }
    };
  }
  
  // Get user streak from local storage
  getUserStreak(): UserStreak {
    const storedStreak = localStorage.getItem('digzopia_user_streak');
    if (storedStreak) {
      return JSON.parse(storedStreak);
    }
    return this.initializeUserStreak();
  }
  
  // Save user streak to local storage
  saveUserStreak(userStreak: UserStreak): void {
    localStorage.setItem('digzopia_user_streak', JSON.stringify(userStreak));
  }
  
  // Process daily login
  processDailyLogin(): { streak: UserStreak; reward: LoginReward | null } {
    let userStreak = this.getUserStreak();
    const reward = this.checkDailyReward(userStreak);
    
    if (reward) {
      userStreak = this.updateUserStreak(userStreak);
      this.saveUserStreak(userStreak);
    }
    
    return { streak: userStreak, reward };
  }
}

export default new IncentiveService();
