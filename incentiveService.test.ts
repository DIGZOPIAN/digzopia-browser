// src/features/incentives/tests/incentiveService.test.ts
import incentiveService from '../services/incentiveService';
import { UserStreak } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Incentive Service', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2025-05-27T12:00:00Z').valueOf());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should initialize a new user streak correctly', () => {
    const streak = incentiveService.initializeUserStreak();
    expect(streak.currentStreak).toBe(0);
    expect(streak.lastLoginDate).toBe('');
    expect(streak.weeklyCompletions).toBe(0);
    expect(streak.totalLogins).toBe(0);
    expect(streak.rewards.claimed).toEqual([]);
    expect(streak.rewards.pending).toEqual([]);
  });

  test('should get user streak from localStorage', () => {
    const mockStreak: UserStreak = {
      currentStreak: 3,
      lastLoginDate: '2025-05-26',
      weeklyCompletions: 0,
      totalLogins: 3,
      rewards: {
        claimed: ['day_1', 'day_2', 'day_3'],
        pending: []
      }
    };
    
    localStorageMock.setItem('digzopia_user_streak', JSON.stringify(mockStreak));
    
    const streak = incentiveService.getUserStreak();
    expect(streak).toEqual(mockStreak);
  });

  test('should save user streak to localStorage', () => {
    const mockStreak: UserStreak = {
      currentStreak: 5,
      lastLoginDate: '2025-05-26',
      weeklyCompletions: 0,
      totalLogins: 5,
      rewards: {
        claimed: [],
        pending: []
      }
    };
    
    incentiveService.saveUserStreak(mockStreak);
    
    const savedStreak = JSON.parse(localStorageMock.getItem('digzopia_user_streak') || '{}');
    expect(savedStreak).toEqual(mockStreak);
  });

  test('should check daily reward correctly for first login', () => {
    const userStreak: UserStreak = {
      currentStreak: 0,
      lastLoginDate: '',
      weeklyCompletions: 0,
      totalLogins: 0,
      rewards: {
        claimed: [],
        pending: []
      }
    };
    
    const reward = incentiveService.checkDailyReward(userStreak);
    expect(reward).not.toBeNull();
    expect(reward?.day).toBe(1);
    expect(reward?.reward.amount).toBe(5);
  });

  test('should not give reward if already logged in today', () => {
    const userStreak: UserStreak = {
      currentStreak: 3,
      lastLoginDate: '2025-05-27', // Today
      weeklyCompletions: 0,
      totalLogins: 3,
      rewards: {
        claimed: [],
        pending: []
      }
    };
    
    const reward = incentiveService.checkDailyReward(userStreak);
    expect(reward).toBeNull();
  });

  test('should continue streak if logged in yesterday', () => {
    const yesterday = new Date('2025-05-26').toISOString().split('T')[0];
    
    const userStreak: UserStreak = {
      currentStreak: 3,
      lastLoginDate: yesterday,
      weeklyCompletions: 0,
      totalLogins: 3,
      rewards: {
        claimed: [],
        pending: []
      }
    };
    
    const updatedStreak = incentiveService.updateUserStreak(userStreak);
    expect(updatedStreak.currentStreak).toBe(4);
    expect(updatedStreak.lastLoginDate).toBe('2025-05-27');
    expect(updatedStreak.totalLogins).toBe(4);
  });

  test('should reset streak if not logged in yesterday', () => {
    const twoDaysAgo = new Date('2025-05-25').toISOString().split('T')[0];
    
    const userStreak: UserStreak = {
      currentStreak: 3,
      lastLoginDate: twoDaysAgo,
      weeklyCompletions: 0,
      totalLogins: 3,
      rewards: {
        claimed: [],
        pending: []
      }
    };
    
    const updatedStreak = incentiveService.updateUserStreak(userStreak);
    expect(updatedStreak.currentStreak).toBe(1);
    expect(updatedStreak.lastLoginDate).toBe('2025-05-27');
    expect(updatedStreak.totalLogins).toBe(4);
  });

  test('should award weekly completion bonus on day 7', () => {
    const yesterday = new Date('2025-05-26').toISOString().split('T')[0];
    
    const userStreak: UserStreak = {
      currentStreak: 6,
      lastLoginDate: yesterday,
      weeklyCompletions: 0,
      totalLogins: 6,
      rewards: {
        claimed: [],
        pending: []
      }
    };
    
    const updatedStreak = incentiveService.updateUserStreak(userStreak);
    expect(updatedStreak.currentStreak).toBe(7);
    expect(updatedStreak.weeklyCompletions).toBe(1);
    expect(updatedStreak.rewards.pending).toContain('weekly_1');
  });
});
