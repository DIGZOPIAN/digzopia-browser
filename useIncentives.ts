// src/features/incentives/hooks/useIncentives.ts
import { useEffect, useState } from 'react';
import { UserStreak, UserProfile } from '../types';
import incentiveService from '../services/incentiveService';

export const useIncentives = () => {
  const [userStreak, setUserStreak] = useState<UserStreak | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showEmailSignup, setShowEmailSignup] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Initialize user streak and profile
  useEffect(() => {
    // Get user streak from local storage
    const streak = incentiveService.getUserStreak();
    setUserStreak(streak);
    
    // Get user profile from local storage
    const storedProfile = localStorage.getItem('digzopia_user_profile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      // If no profile exists, show email signup
      setShowEmailSignup(true);
      
      // Initialize default profile
      const defaultProfile: UserProfile = {
        marketingConsent: false,
        notificationPreferences: {
          dailyReminders: true,
          weeklyReminders: true,
          marketingEmails: false
        }
      };
      setUserProfile(defaultProfile);
    }
    
    // Check if should show reward modal (if not already logged in today)
    const today = new Date().toISOString().split('T')[0];
    if (streak.lastLoginDate !== today) {
      setShowRewardModal(true);
    }
  }, []);
  
  // Save user profile to local storage
  const saveUserProfile = (profile: UserProfile) => {
    localStorage.setItem('digzopia_user_profile', JSON.stringify(profile));
    setUserProfile(profile);
  };
  
  // Handle email signup submission
  const handleEmailSignup = (email: string, marketingConsent: boolean) => {
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        email,
        marketingConsent,
        notificationPreferences: {
          ...userProfile.notificationPreferences,
          marketingEmails: marketingConsent
        }
      };
      saveUserProfile(updatedProfile);
    }
    setShowEmailSignup(false);
  };
  
  // Handle email signup skip
  const handleSkipEmailSignup = () => {
    setShowEmailSignup(false);
  };
  
  // Handle reward modal close
  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
  };
  
  return {
    userStreak,
    userProfile,
    showRewardModal,
    showEmailSignup,
    handleEmailSignup,
    handleSkipEmailSignup,
    handleCloseRewardModal,
    saveUserProfile
  };
};
