import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, CheckCircle, XCircle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SecurityIssue {
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  line?: number;
  recommendation: string;
}

interface SecurityScannerProps {
  sourceCode: string;
  onScanComplete?: (issues: SecurityIssue[]) => void;
}

export default function ContractSecurityScanner({ sourceCode, onScanComplete }: SecurityScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<SecurityIssue[]>([]);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const performSecurityScan = async () => {
    if (!sourceCode.trim()) {
      toast({
        title: "No Code to Scan",
        description: "Please provide source code to analyze",
        variant: "destructive",
      });
      return;
    }

    setScanning(true);
    
    // Simulate security analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockIssues: SecurityIssue[] = [];
    
    // Check for common vulnerabilities
    if (sourceCode.includes("tx.origin")) {
      mockIssues.push({
        severity: "high",
        title: "Use of tx.origin",
        description: "Using tx.origin for authorization can be vulnerable to phishing attacks",
        recommendation: "Use msg.sender instead of tx.origin for access control"
      });
    }
    
    if (sourceCode.includes("block.timestamp") || sourceCode.includes("now")) {
      mockIssues.push({
        severity: "medium",
        title: "Timestamp Dependence",
        description: "Relying on block.timestamp can be manipulated by miners",
        recommendation: "Avoid using block.timestamp for critical logic or add reasonable tolerance"
      });
    }
    
    if (!sourceCode.includes("require(") && !sourceCode.includes("assert(")) {
      mockIssues.push({
        severity: "medium",
        title: "Missing Input Validation",
        description: "No input validation detected in the contract",
        recommendation: "Add require() statements to validate inputs and state conditions"
      });
    }
    
    if (sourceCode.includes("selfdestruct")) {
      mockIssues.push({
        severity: "critical",
        title: "Self-Destruct Function",
        description: "Contract contains self-destruct functionality",
        recommendation: "Ensure proper access controls on self-destruct functions"
      });
    }
    
    if (!sourceCode.includes("nonReentrant") && sourceCode.includes("call")) {
      mockIssues.push({
        severity: "high",
        title: "Potential Reentrancy",
        description: "External calls detected without reentrancy protection",
        recommendation: "Use OpenZeppelin's ReentrancyGuard or follow checks-effects-interactions pattern"
      });
    }

    setScanResults(mockIssues);
    setLastScanTime(new Date());
    setScanning(false);
    
    if (onScanComplete) {
      onScanComplete(mockIssues);
    }
    
    toast({
      title: "Security Scan Complete",
      description: `Found ${mockIssues.length} potential issues`,
      variant: mockIssues.length > 0 ? "destructive" : "default",
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Security Scanner
          </div>
          <Button
            onClick={performSecurityScan}
            disabled={scanning || !sourceCode.trim()}
            size="sm"
          >
            {scanning ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Scan Contract
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lastScanTime && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Last scan: {lastScanTime.toLocaleString()}
          </div>
        )}
        
        {scanResults.length === 0 && lastScanTime ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Security Issues Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your contract passed all security checks!
            </p>
          </div>
        ) : scanResults.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Security Issues Found
              </h3>
              <Badge variant="destructive">{scanResults.length} issues</Badge>
            </div>
            
            <div className="space-y-3">
              {scanResults.map((issue, index) => (
                <Card key={index} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {issue.title}
                            </h4>
                            <Badge className={getSeverityColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {issue.description}
                          </p>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                            <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                              Recommendation:
                            </h5>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {issue.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : !lastScanTime ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Ready to Scan
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Click "Scan Contract" to analyze your code for security vulnerabilities
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}