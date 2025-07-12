import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Rocket, History, FileCode, Wallet } from "lucide-react";
import WalletConnection from "@/components/wallet-connection";
import ContractDeploy from "@/components/contract-deploy";
import ContractInteract from "@/components/contract-interact";
import TransactionHistory from "@/components/transaction-history";
import ContractTemplates from "@/components/contract-templates";
import { useWeb3 } from "@/hooks/use-web3";

type TabType = "deploy" | "interact" | "history" | "templates";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("deploy");
  const { account, network, balance, isConnected } = useWeb3();

  const tabs = [
    { id: "deploy", label: "Deploy Contract", icon: Rocket },
    { id: "interact", label: "Interact with Contract", icon: Code },
    { id: "history", label: "Transaction History", icon: History },
    { id: "templates", label: "Contract Templates", icon: FileCode },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case "deploy":
        return <ContractDeploy />;
      case "interact":
        return <ContractInteract />;
      case "history":
        return <TransactionHistory />;
      case "templates":
        return <ContractTemplates onSelectTemplate={() => setActiveTab("deploy")} />;
      default:
        return <ContractDeploy />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Code className="text-primary text-2xl mr-3" />
                <h1 className="text-xl font-bold text-gray-900">SmartContract Studio</h1>
              </div>
            </div>
            
            <WalletConnection />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeTab === tab.id 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveTab(tab.id as TabType)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {tab.label}
                    </Button>
                  );
                })}
              </nav>
            </Card>

            {/* Wallet Status */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    isConnected 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Network</span>
                  <span className="text-gray-900">{network || "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Balance</span>
                  <span className="text-gray-900">{balance || "- ETH"}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 break-all">
                    {account || "No wallet connected"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
