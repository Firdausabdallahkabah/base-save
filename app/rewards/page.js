'use client';

import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { useAccount } from 'wagmi';

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  
  // Mock data for rewards/badges
  const [rewards, setRewards] = useState([
    {
      id: '1',
      name: 'First Goal Completed',
      description: 'Successfully completed your first savings goal',
      image: '🏆',
      dateEarned: '2025-03-15',
      type: 'badge'
    },
    {
      id: '2',
      name: 'Savings Streak',
      description: 'Maintained regular deposits for 30 days',
      image: '🔥',
      dateEarned: '2025-04-20',
      type: 'badge'
    },
    {
      id: '3',
      name: 'Big Saver',
      description: 'Saved more than 1 ETH in a single goal',
      image: '💰',
      dateEarned: '2025-05-01',
      type: 'badge'
    }
  ]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Rewards & Badges</h1>
        
        {!isConnected ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please connect your wallet to view your rewards and badges.
            </p>
          </div>
        ) : rewards.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">No Rewards Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Complete savings goals to earn rewards and badges!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-2">Total Rewards</h3>
                <p className="text-4xl font-bold">{rewards.length}</p>
              </div>
              
              <div className="bg-gradient-to-br from-secondary to-teal-500 text-white rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-2">Goals Completed</h3>
                <p className="text-4xl font-bold">1</p>
              </div>
              
              <div className="bg-gradient-to-br from-accent to-yellow-500 text-white rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-2">Savings Streak</h3>
                <p className="text-4xl font-bold">30 days</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-6">Badges Collection</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div 
                  key={reward.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl mr-4">
                        {reward.image}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{reward.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Earned on {formatDate(reward.dateEarned)}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {reward.description}
                    </p>
                    
                    <div className="flex justify-end">
                      <button className="px-4 py-2 text-primary border border-primary hover:bg-primary/5 font-medium rounded-lg transition-colors text-sm">
                        View on Base
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
