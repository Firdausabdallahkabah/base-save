'use client';

import { getDefaultWallets, RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { baseGoerli, base } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { useEffect, useState } from 'react';

const { chains, publicClient } = configureChains(
  [base, baseGoerli],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'BaseSave',
  projectId: 'basesave-app', // Replace with actual project ID from WalletConnect
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);
  
  // This is to prevent hydration errors with RainbowKit
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        chains={chains} 
        theme={{
          lightMode: lightTheme({
            accentColor: '#0052ff', // Base blue
            accentColorForeground: 'white',
            borderRadius: 'medium',
          }),
          darkMode: darkTheme({
            accentColor: '#0052ff', // Base blue
            accentColorForeground: 'white',
            borderRadius: 'medium',
          }),
        }}
      >
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
