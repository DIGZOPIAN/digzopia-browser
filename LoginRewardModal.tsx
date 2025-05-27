// src/features/incentives/components/LoginRewardModal.tsx
import React, { useEffect, useState } from 'react';
import { LoginReward, UserStreak } from '../types';
import incentiveService from '../services/incentiveService';

interface LoginRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginRewardModal: React.FC<LoginRewardModalProps> = ({ isOpen, onClose }) => {
  const [reward, setReward] = useState<LoginReward | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      const { reward, streak } = incentiveService.processDailyLogin();
      setReward(reward);
      setStreak(streak);
    }
  }, [isOpen]);
  
  if (!isOpen || !reward) return null;
  
  const isWeeklyCompletion = streak?.currentStreak && streak.currentStreak % 7 === 0;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {isWeeklyCompletion ? '🎉 Weekly Reward! 🎉' : '🎁 Daily Reward!'}
          </h2>
          
          <div className="mb-6">
            <div className="text-5xl mb-4">
              {reward.reward.type === 'token' ? '🪙' : '🏆'}
            </div>
            <p className="text-xl font-semibold">
              {reward.reward.amount} {reward.reward.name}
            </p>
            <p className="text-gray-600 mt-2">
              {reward.reward.description}
            </p>
          </div>
          
          <div className="mb-6">
            <p className="font-medium">
              Current streak: {streak?.currentStreak} day{streak?.currentStreak !== 1 ? 's' : ''}
            </p>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div 
                  key={day}
                  className={`w-8 h-8 mx-1 rounded-full flex items-center justify-center ${
                    day <= (streak?.currentStreak || 0) % 7 || (day === 7 && (streak?.currentStreak || 0) % 7 === 0)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          
          {isWeeklyCompletion && (
            <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
              <p className="font-bold text-yellow-800">
                Congratulations! You've completed a full week!
              </p>
              <p className="text-yellow-700">
                You've earned the Weekly Champion badge!
              </p>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRewardModal;
