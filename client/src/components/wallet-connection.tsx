import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWeb3 } from "@/hooks/use-web3";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WalletConnection() {
  const { isConnected, connectWallet, disconnectWallet, network, switchNetwork } = useWeb3();

  const networks = [
    { id: "1", name: "Ethereum Mainnet" },
    { id: "5", name: "Goerli Testnet" },
    { id: "11155111", name: "Sepolia Testnet" },
    { id: "80001", name: "Polygon Mumbai" },
  ];

  return (
    <div className="flex items-center space-x-4">
      {/* Network Selector */}
      <Select value={network} onValueChange={switchNetwork}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select Network" />
        </SelectTrigger>
        <SelectContent>
          {networks.map((net) => (
            <SelectItem key={net.id} value={net.id}>
              {net.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Wallet Connection */}
      <Button
        onClick={isConnected ? disconnectWallet : connectWallet}
        className="flex items-center space-x-2"
      >
        <Wallet className="h-4 w-4" />
        <span>{isConnected ? "Disconnect" : "Connect Wallet"}</span>
      </Button>
    </div>
  );
}
