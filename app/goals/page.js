'use client';

import { useState } from 'react';
import Link from 'next/link';
import MainLayout from '../components/MainLayout';
import { useAccount } from 'wagmi';

export default function GoalsPage() {
  const { address, isConnected } = useAccount();

  // This would normally come from a blockchain query or API
  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'New Laptop',
      description: 'Saving for a MacBook Pro',
      targetAmount: '0.5',
      currentAmount: '0.2',
      deadline: '2025-08-01',
      token: 'ETH',
      status: 'active'
    },
    {
      id: '2',
      title: 'Emergency Fund',
      description: 'Building a rainy day fund',
      targetAmount: '1000',
      currentAmount: '250',
      deadline: '2025-12-31',
      token: 'DAI',
      status: 'active'
    },
    {
      id: '3',
      title: 'Vacation',
      description: 'Trip to Bali',
      targetAmount: '0.8',
      currentAmount: '0.8',
      deadline: '2025-03-15',
      token: 'ETH',
      status: 'completed'
    }
  ]);

  // Calculate progress percentage
  const calculateProgress = (current, target) => {
    return Math.min(100, Math.round((parseFloat(current) / parseFloat(target)) * 100));
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Savings Goals</h1>
          <Link
            href="/create"
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
          >
            Create New Goal
          </Link>
        </div>

        {!isConnected ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please connect your wallet to view your savings goals.
            </p>
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">No Goals Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't created any savings goals yet. Create your first goal to get started!
            </p>
            <Link
              href="/create"
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors inline-block"
            >
              Create Your First Goal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const isCompleted = goal.status === 'completed';

              return (
                <div
                  key={goal.id}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden card-hover hover:border-primary/30 dark:hover:border-primary/30 transition-all"
                >
                  {/* Goal header with gradient background */}
                  <div className={`p-6 ${isCompleted ? 'bg-gradient-to-r from-green-500/10 to-green-600/10 dark:from-green-500/20 dark:to-green-600/20' : 'bg-gradient-to-r from-primary/10 to-indigo-600/10 dark:from-primary/20 dark:to-indigo-600/20'}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{goal.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isCompleted
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                      }`}>
                        {isCompleted ? 'Completed' : 'Active'}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {goal.description}
                    </p>
                  </div>

                  <div className="p-6">
                    {/* Progress bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="font-medium text-primary">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all ${isCompleted ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-primary to-indigo-500'}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Goal details */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current</p>
                        <p className="font-semibold text-lg flex items-baseline">
                          <span>{goal.currentAmount}</span>
                          <span className="text-xs ml-1 text-gray-500">{goal.token}</span>
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Target</p>
                        <p className="font-semibold text-lg flex items-baseline">
                          <span>{goal.targetAmount}</span>
                          <span className="text-xs ml-1 text-gray-500">{goal.token}</span>
                        </p>
                      </div>
                      <div className="col-span-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Deadline</p>
                        <p className="font-semibold flex items-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1 text-primary">
                            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {formatDate(goal.deadline)}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-3">
                      {goal.status === 'active' && (
                        <>
                          <button className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1">
                              <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Deposit
                          </button>
                          <button className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-all text-sm flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1">
                              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Details
                          </button>
                        </>
                      )}
                      {goal.status === 'completed' && (
                        <button className="flex-1 px-4 py-3 bg-gradient-to-r from-secondary to-teal-500 hover:from-teal-500 hover:to-secondary text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1">
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19.7942 4.20577L16 8M19.7942 19.7942L16 16M4.20577 19.7942L8 16M4.20577 4.20577L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          View Reward
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
