import React, { createContext, useContext, useState } from 'react';

// Create the Wallet Context
const WalletContext = createContext();

// Provider Component
export const SharedWalletProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(1000); // Initial balance

  const addFunds = (amount) => setWalletBalance(walletBalance + amount);
  const withdrawFunds = (amount) => {
    if (amount <= walletBalance) {
      setWalletBalance(walletBalance - amount);
    } else {
      alert('Insufficient balance!');
    }
  };

  return (
    <WalletContext.Provider value={{ walletBalance, addFunds, withdrawFunds }}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook to use the wallet context
export const useWallet = () => useContext(WalletContext);
