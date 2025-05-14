'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../components/MainLayout';
import { useAccount } from 'wagmi';

export default function CreateGoalPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    token: 'ETH',
    deadline: '',
    isPublic: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would normally call a smart contract function
      console.log('Creating goal with data:', formData);
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to goals page after successful creation
      router.push('/goals');
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate minimum date for deadline (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create a New Savings Goal</h1>
          
          {!isConnected ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please connect your wallet to create a savings goal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800"
                  placeholder="e.g., New Laptop"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800"
                  placeholder="What are you saving for?"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="targetAmount" className="block text-sm font-medium mb-2">
                    Target Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="targetAmount"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      required
                      min="0.0001"
                      step="0.0001"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800"
                      placeholder="0.5"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="token" className="block text-sm font-medium mb-2">
                    Token
                  </label>
                  <select
                    id="token"
                    name="token"
                    value={formData.token}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800"
                  >
                    <option value="ETH">ETH</option>
                    <option value="DAI">DAI</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  min={getMinDate()}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm">
                  Make this goal public (visible to other users)
                </label>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300">
                <p className="flex items-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Your funds will be locked in a smart contract until you reach your goal or the deadline passes.
                </p>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/goals')}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
