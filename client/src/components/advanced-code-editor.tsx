import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, AlertTriangle, CheckCircle, Lightbulb, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeIssue {
  line: number;
  column: number;
  type: "error" | "warning" | "info";
  message: string;
  severity: "critical" | "high" | "medium" | "low";
}

interface CodeSuggestion {
  line: number;
  type: "optimization" | "security" | "style";
  message: string;
  before: string;
  after: string;
}

interface AdvancedCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCompile?: (result: any) => void;
}

export default function AdvancedCodeEditor({ value, onChange, onCompile }: AdvancedCodeEditorProps) {
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [solidityVersion, setSolidityVersion] = useState("0.8.19");
  const [isCompiling, setIsCompiling] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [theme, setTheme] = useState("dark");
  const { toast } = useToast();

  // Real-time code analysis
  useEffect(() => {
    const analyzeCode = () => {
      const lines = value.split('\n');
      const newIssues: CodeIssue[] = [];
      const newSuggestions: CodeSuggestion[] = [];

      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        
        // Check for common issues
        if (line.includes('tx.origin')) {
          newIssues.push({
            line: lineNumber,
            column: line.indexOf('tx.origin'),
            type: "error",
            message: "Use of tx.origin is discouraged",
            severity: "high"
          });
        }
        
        if (line.includes('block.timestamp') && !line.includes('//')) {
          newIssues.push({
            line: lineNumber,
            column: line.indexOf('block.timestamp'),
            type: "warning",
            message: "Timestamp dependence detected",
            severity: "medium"
          });
        }
        
        if (line.trim().startsWith('function') && !line.includes('public') && !line.includes('private') && !line.includes('internal') && !line.includes('external')) {
          newIssues.push({
            line: lineNumber,
            column: 0,
            type: "warning",
            message: "Function visibility should be explicitly defined",
            severity: "medium"
          });
        }
        
        // Gas optimization suggestions
        if (line.includes('for (uint256 i = 0;')) {
          newSuggestions.push({
            line: lineNumber,
            type: "optimization",
            message: "Use unchecked increment for gas optimization",
            before: "for (uint256 i = 0; i < length; i++)",
            after: "for (uint256 i = 0; i < length; ) { ... unchecked { ++i; } }"
          });
        }
        
        if (line.includes('require(') && line.includes('"')) {
          newSuggestions.push({
            line: lineNumber,
            type: "optimization",
            message: "Consider using custom errors instead of string messages",
            before: 'require(condition, "Error message");',
            after: "if (!condition) revert CustomError();"
          });
        }
      });

      setIssues(newIssues);
      setSuggestions(newSuggestions);
    };

    const debounceTimer = setTimeout(analyzeCode, 500);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const compileCode = async () => {
    setIsCompiling(true);
    
    try {
      // Simulate compilation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const hasErrors = issues.some(issue => issue.type === "error");
      
      if (hasErrors) {
        toast({
          title: "Compilation Failed",
          description: "Please fix the errors before compiling",
          variant: "destructive",
        });
      } else {
        const mockResult = {
          success: true,
          bytecode: "0x608060405234801561001057600080fd5b50...",
          abi: [
            {
              inputs: [],
              name: "example",
              outputs: [{ internalType: "string", name: "", type: "string" }],
              stateMutability: "view",
              type: "function"
            }
          ],
          gasEstimate: 2500000
        };
        
        toast({
          title: "Compilation Successful",
          description: "Contract compiled without errors",
        });
        
        if (onCompile) {
          onCompile(mockResult);
        }
      }
    } finally {
      setIsCompiling(false);
    }
  };

  const formatCode = () => {
    // Basic code formatting
    const formatted = value
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('}')) {
          return '    '.repeat(Math.max(0, (line.length - line.trimLeft().length) / 4 - 1)) + trimmed;
        }
        return line;
      })
      .join('\n');
    
    onChange(formatted);
    
    toast({
      title: "Code Formatted",
      description: "Code has been formatted successfully",
    });
  };

  const insertSnippet = (snippet: string) => {
    const snippets: Record<string, string> = {
      "erc20": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}`,
      "erc721": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    
    constructor() ERC721("MyNFT", "NFT") {}
    
    function mint(address to) public onlyOwner {
        _mint(to, nextTokenId);
        nextTokenId++;
    }
}`,
      "modifier": `modifier onlyOwner() {
    require(msg.sender == owner, "Not the owner");
    _;
}`,
      "event": `event Transfer(address indexed from, address indexed to, uint256 value);`,
      "mapping": `mapping(address => uint256) public balances;`
    };
    
    onChange(value + '\n\n' + snippets[snippet]);
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  const lineCount = value.split('\n').length;

  return (
    <div className="space-y-4">
      {/* Editor Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Code className="h-5 w-5 mr-2 text-primary" />
              Advanced Solidity Editor
            </div>
            <div className="flex items-center space-x-2">
              <Select value={solidityVersion} onValueChange={setSolidityVersion}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.8.19">0.8.19</SelectItem>
                  <SelectItem value="0.8.18">0.8.18</SelectItem>
                  <SelectItem value="0.8.17">0.8.17</SelectItem>
                  <SelectItem value="0.8.16">0.8.16</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={formatCode} variant="outline" size="sm">
                Format
              </Button>
              <Button 
                onClick={compileCode} 
                disabled={isCompiling}
                size="sm"
              >
                {isCompiling ? "Compiling..." : "Compile"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Quick Insert:
            </span>
            <Button 
              onClick={() => insertSnippet("erc20")} 
              variant="outline" 
              size="sm"
            >
              ERC-20
            </Button>
            <Button 
              onClick={() => insertSnippet("erc721")} 
              variant="outline" 
              size="sm"
            >
              ERC-721
            </Button>
            <Button 
              onClick={() => insertSnippet("modifier")} 
              variant="outline" 
              size="sm"
            >
              Modifier
            </Button>
            <Button 
              onClick={() => insertSnippet("event")} 
              variant="outline" 
              size="sm"
            >
              Event
            </Button>
            <Button 
              onClick={() => insertSnippet("mapping")} 
              variant="outline" 
              size="sm"
            >
              Mapping
            </Button>
          </div>

          {/* Code Editor */}
          <div className="relative">
            <div className="flex">
              {showLineNumbers && (
                <div className="bg-gray-100 dark:bg-gray-800 p-3 text-sm text-gray-500 font-mono select-none border-r">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i + 1} className="leading-6">
                      {i + 1}
                    </div>
                  ))}
                </div>
              )}
              <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="font-mono text-sm resize-none border-0 rounded-l-none min-h-[400px]"
                style={{ 
                  lineHeight: '1.5',
                  tabSize: 4
                }}
                placeholder="// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    // Your code here
}"
              />
            </div>
          </div>

          {/* Editor Stats */}
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex space-x-4">
              <span>Lines: {lineCount}</span>
              <span>Characters: {value.length}</span>
              <span>Solidity: {solidityVersion}</span>
            </div>
            <div className="flex items-center space-x-2">
              {issues.length > 0 && (
                <Badge variant="destructive">
                  {issues.filter(i => i.type === "error").length} errors, {issues.filter(i => i.type === "warning").length} warnings
                </Badge>
              )}
              {issues.length === 0 && value.trim() && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  No issues
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues Panel */}
      {issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Code Issues ({issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  {getIssueIcon(issue.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Line {issue.line}
                      </span>
                      <Badge className={`${
                        issue.type === "error" 
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}>
                        {issue.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {issue.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions Panel */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Optimization Suggestions ({suggestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Line {suggestion.line}
                    </span>
                    <Badge className={`${
                      suggestion.type === "optimization" 
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : suggestion.type === "security"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}>
                      {suggestion.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {suggestion.message}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Before:
                      </span>
                      <pre className="text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded mt-1 text-red-800 dark:text-red-200">
                        {suggestion.before}
                      </pre>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        After:
                      </span>
                      <pre className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded mt-1 text-green-800 dark:text-green-200">
                        {suggestion.after}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}