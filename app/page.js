'use client';

import Image from "next/image";
import Link from "next/link";
import MainLayout from "./components/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-gray-50 dark:from-gray-900 dark:via-blue-950/30 dark:to-gray-800 py-24 md:py-32">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-6 py-2 bg-primary/10 dark:bg-primary/20 rounded-full">
            <span className="text-primary dark:text-primary-light font-medium">Built on Base</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-dark to-secondary">
            <span className="block">Save with purpose,</span>
            <span className="block">achieve your goals</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            A decentralized savings platform that helps you set goals, 
            lock funds, and earn rewards — all on Base.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/create" 
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Start Saving
            </Link>
            <Link 
              href="/goals" 
              className="px-8 py-4 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 text-primary border border-primary/20 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              View Goals
            </Link>
          </div>
          
          <div className="mt-16 flex justify-center">
            <div className="p-1 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm shadow-lg">
              <img 
                src="https://assets.coinbase.com/assets/base.38d8a9b1.svg" 
                alt="Base" 
                className="h-8 w-auto mx-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Set Savings Goals</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Define an amount, timeframe, and description for your financial goals. Whether it's for a vacation, gadget, or emergency fund.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M7 10V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 10H19V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Contract Vault</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Funds are locked in a secure smart contract until your goal is reached or the time expires, helping you stay committed.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.7942 4.20577L16 8M19.7942 19.7942L16 16M4.20577 19.7942L8 16M4.20577 4.20577L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn Rewards</h3>
              <p className="text-gray-600 dark:text-gray-400">
                When you hit your goals, mint NFT badges or earn small rewards from the community pool as recognition for your achievement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-16">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary">1</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">Connect Your Wallet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect your wallet using RainbowKit to get started. BaseSave works with any Base-compatible wallet.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse items-center mb-16">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pl-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary">2</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">Create a Savings Goal</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Set up your savings goal with a target amount, deadline, and description. Choose which tokens you want to save in.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-16">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary">3</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">Deposit Funds Regularly</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Make regular deposits to your goal. The smart contract will lock your funds until you reach your target or the deadline passes.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pl-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary">4</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">Achieve Your Goal & Earn Rewards</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Once you hit your target, withdraw your funds and claim your reward NFT badge as proof of your achievement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to start saving?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of users who are achieving their financial goals with BaseSave.
          </p>
          <Link 
            href="/create" 
            className="px-8 py-3 bg-white text-primary hover:bg-gray-100 font-medium rounded-lg transition-colors inline-block"
          >
            Create Your First Goal
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
