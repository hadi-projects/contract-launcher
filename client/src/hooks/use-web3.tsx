import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface Web3ContextType {
  account: string | null;
  network: string | null;
  balance: string | null;
  isConnected: boolean;
  web3: any;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (networkId: string) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [web3, setWeb3] = useState<any>(null);
  const { toast } = useToast();

  const isConnected = !!account;

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          
          // Get network
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setNetwork(chainId);

          // Get balance
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest'],
          });
          const balanceInEth = parseInt(balance, 16) / 1e18;
          setBalance(balanceInEth.toFixed(4) + " ETH");

          toast({
            title: "Wallet Connected",
            description: "Successfully connected to MetaMask",
          });
        }
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to connect your wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setNetwork(null);
    setBalance(null);
    setWeb3(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Wallet disconnected successfully",
    });
  };

  const switchNetwork = async (networkId: string) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(networkId).toString(16)}` }],
      });
      setNetwork(networkId);
    } catch (error: any) {
      if (error.code === 4902) {
        toast({
          title: "Network Not Found",
          description: "Please add this network to MetaMask first",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Network Switch Failed",
          description: "Failed to switch network",
          variant: "destructive",
        });
      }
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        setNetwork(chainId);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        network,
        balance,
        isConnected,
        web3,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
