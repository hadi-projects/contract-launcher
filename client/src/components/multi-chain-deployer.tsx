import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, Zap, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Network {
  id: string;
  name: string;
  chainId: number;
  rpcUrl: string;
  symbol: string;
  explorer: string;
  gasPrice: string;
  deploymentCost: string;
  status: "idle" | "deploying" | "success" | "failed";
}

interface MultiChainDeployerProps {
  contractData: {
    name: string;
    bytecode: string;
    abi: any[];
  };
  onDeploymentComplete?: (deployments: any[]) => void;
}

export default function MultiChainDeployer({ contractData, onDeploymentComplete }: MultiChainDeployerProps) {
  const [networks, setNetworks] = useState<Network[]>([
    {
      id: "ethereum",
      name: "Ethereum Mainnet",
      chainId: 1,
      rpcUrl: "https://mainnet.infura.io/v3/",
      symbol: "ETH",
      explorer: "https://etherscan.io",
      gasPrice: "25.5",
      deploymentCost: "0.0128",
      status: "idle"
    },
    {
      id: "polygon",
      name: "Polygon",
      chainId: 137,
      rpcUrl: "https://polygon-rpc.com",
      symbol: "MATIC",
      explorer: "https://polygonscan.com",
      gasPrice: "30.2",
      deploymentCost: "0.0015",
      status: "idle"
    },
    {
      id: "bsc",
      name: "BSC",
      chainId: 56,
      rpcUrl: "https://bsc-dataseed.binance.org",
      symbol: "BNB",
      explorer: "https://bscscan.com",
      gasPrice: "5.0",
      deploymentCost: "0.0032",
      status: "idle"
    },
    {
      id: "arbitrum",
      name: "Arbitrum One",
      chainId: 42161,
      rpcUrl: "https://arb1.arbitrum.io/rpc",
      symbol: "ETH",
      explorer: "https://arbiscan.io",
      gasPrice: "0.1",
      deploymentCost: "0.0001",
      status: "idle"
    },
    {
      id: "optimism",
      name: "Optimism",
      chainId: 10,
      rpcUrl: "https://mainnet.optimism.io",
      symbol: "ETH",
      explorer: "https://optimistic.etherscan.io",
      gasPrice: "0.001",
      deploymentCost: "0.00005",
      status: "idle"
    },
    {
      id: "avalanche",
      name: "Avalanche",
      chainId: 43114,
      rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
      symbol: "AVAX",
      explorer: "https://snowtrace.io",
      gasPrice: "25.0",
      deploymentCost: "0.0025",
      status: "idle"
    }
  ]);
  
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [deploying, setDeploying] = useState(false);
  const { toast } = useToast();

  const handleNetworkSelection = (networkId: string, selected: boolean) => {
    if (selected) {
      setSelectedNetworks([...selectedNetworks, networkId]);
    } else {
      setSelectedNetworks(selectedNetworks.filter(id => id !== networkId));
    }
  };

  const deployToMultipleChains = async () => {
    if (selectedNetworks.length === 0) {
      toast({
        title: "No Networks Selected",
        description: "Please select at least one network for deployment",
        variant: "destructive",
      });
      return;
    }

    setDeploying(true);
    const deployments: any[] = [];

    // Reset all statuses
    setNetworks(prev => prev.map(net => ({ 
      ...net, 
      status: selectedNetworks.includes(net.id) ? "deploying" : net.status 
    })));

    for (const networkId of selectedNetworks) {
      const network = networks.find(n => n.id === networkId);
      if (!network) continue;

      try {
        // Simulate deployment delay
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
        
        // Mock deployment result
        const mockAddress = "0x" + Math.random().toString(16).substr(2, 40);
        const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64);
        
        const deployment = {
          network: network.name,
          chainId: network.chainId,
          address: mockAddress,
          txHash: mockTxHash,
          explorer: `${network.explorer}/tx/${mockTxHash}`,
          gasUsed: Math.floor(Math.random() * 1000000) + 500000,
          deploymentCost: network.deploymentCost
        };
        
        deployments.push(deployment);
        
        // Update network status to success
        setNetworks(prev => prev.map(net => 
          net.id === networkId 
            ? { ...net, status: "success" }
            : net
        ));
        
        toast({
          title: `Deployed to ${network.name}`,
          description: `Contract deployed at ${mockAddress}`,
        });
        
      } catch (error) {
        // Update network status to failed
        setNetworks(prev => prev.map(net => 
          net.id === networkId 
            ? { ...net, status: "failed" }
            : net
        ));
        
        toast({
          title: `Deployment Failed`,
          description: `Failed to deploy to ${network?.name}`,
          variant: "destructive",
        });
      }
    }

    setDeploying(false);
    
    if (onDeploymentComplete) {
      onDeploymentComplete(deployments);
    }
    
    toast({
      title: "Multi-Chain Deployment Complete",
      description: `Successfully deployed to ${deployments.length} networks`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deploying":
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTotalCost = () => {
    return selectedNetworks.reduce((total, networkId) => {
      const network = networks.find(n => n.id === networkId);
      return total + (network ? parseFloat(network.deploymentCost) : 0);
    }, 0).toFixed(4);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2 text-primary" />
          Multi-Chain Deployer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Network Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Select Networks for Deployment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {networks.map((network) => (
              <Card
                key={network.id}
                className={`cursor-pointer transition-all ${
                  selectedNetworks.includes(network.id)
                    ? "border-primary bg-primary/5"
                    : "hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => handleNetworkSelection(
                  network.id,
                  !selectedNetworks.includes(network.id)
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedNetworks.includes(network.id)}
                        onChange={() => {}}
                        className="rounded border-gray-300"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {network.name}
                      </span>
                    </div>
                    {getStatusIcon(network.status)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Gas Price:</span>
                      <span>{network.gasPrice} gwei</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Est. Cost:</span>
                      <span>{network.deploymentCost} {network.symbol}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Deployment Summary */}
        {selectedNetworks.length > 0 && (
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Deployment Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Networks:</span>
                  <span className="ml-2 font-medium">{selectedNetworks.length}</span>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Total Cost:</span>
                  <span className="ml-2 font-medium">~{getTotalCost()} ETH</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deploy Button */}
        <Button
          onClick={deployToMultipleChains}
          disabled={deploying || selectedNetworks.length === 0}
          className="w-full"
          size="lg"
        >
          {deploying ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-spin" />
              Deploying to {selectedNetworks.length} networks...
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 mr-2" />
              Deploy to {selectedNetworks.length} Networks
            </>
          )}
        </Button>

        {/* Deployment Results */}
        {networks.some(n => n.status === "success" || n.status === "failed") && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Deployment Results
            </h4>
            {networks
              .filter(n => n.status === "success" || n.status === "failed")
              .map((network) => (
                <Card key={network.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {network.name}
                        </span>
                        <Badge
                          className={`ml-2 ${
                            network.status === "success"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {network.status}
                        </Badge>
                      </div>
                      {getStatusIcon(network.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}