import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, Copy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useWeb3 } from "@/hooks/use-web3";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function TransactionHistory() {
  const { account } = useWeb3();
  const { toast } = useToast();

  const { data: transactions = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/transactions", { address: account }],
    enabled: !!account,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Transaction hash copied to clipboard",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      success: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status as keyof typeof statusClasses] || statusClasses.pending}`}>
        {status}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deploy":
        return "🚀";
      case "call":
        return "📞";
      case "send":
        return "💸";
      default:
        return "📄";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!account ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Connect your wallet to view transaction history</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Hash</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Gas Used</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Timestamp</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center">
                          <span className="mr-2">{getTypeIcon(tx.type)}</span>
                          <span className="text-sm font-medium capitalize">{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm font-mono text-gray-600">
                          {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                        </span>
                      </td>
                      <td className="py-4">
                        {getStatusBadge(tx.status)}
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-600">
                          {tx.gasUsed ? tx.gasUsed.toLocaleString() : "-"}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-600">
                          {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(tx.hash)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
