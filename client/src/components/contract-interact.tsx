import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Edit, Upload, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/hooks/use-web3";
import { useQuery } from "@tanstack/react-query";

interface ContractFunction {
  name: string;
  type: "function";
  stateMutability: "view" | "pure" | "nonpayable" | "payable";
  inputs: Array<{
    name: string;
    type: string;
  }>;
  outputs: Array<{
    name: string;
    type: string;
  }>;
}

export default function ContractInteract() {
  const [contractAddress, setContractAddress] = useState("");
  const [abiInput, setAbiInput] = useState("");
  const [parsedAbi, setParsedAbi] = useState<ContractFunction[]>([]);
  const [functionResults, setFunctionResults] = useState<Record<string, any>>({});
  const [functionInputs, setFunctionInputs] = useState<Record<string, Record<string, string>>>({});
  
  const { toast } = useToast();
  const { isConnected } = useWeb3();

  const { data: contractData } = useQuery({
    queryKey: ["/api/contracts/address", contractAddress],
    enabled: !!contractAddress && contractAddress.length === 42,
  });

  const loadContract = () => {
    if (!contractAddress) {
      toast({
        title: "Error",
        description: "Please enter a contract address",
        variant: "destructive",
      });
      return;
    }

    if (!abiInput) {
      toast({
        title: "Error",
        description: "Please provide contract ABI",
        variant: "destructive",
      });
      return;
    }

    try {
      const abi = JSON.parse(abiInput);
      const functions = abi.filter((item: any) => item.type === "function");
      setParsedAbi(functions);
      
      toast({
        title: "Contract Loaded",
        description: "Contract ABI parsed successfully",
      });
    } catch (error) {
      toast({
        title: "Invalid ABI",
        description: "Please check your ABI format",
        variant: "destructive",
      });
    }
  };

  const handleFunctionCall = async (func: ContractFunction, isWrite: boolean) => {
    if (!isConnected && isWrite) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet for write operations",
        variant: "destructive",
      });
      return;
    }

    const inputs = functionInputs[func.name] || {};
    
    try {
      if (isWrite) {
        // Mock write function call
        toast({
          title: "Transaction Sent",
          description: "Transaction submitted to blockchain",
        });
      } else {
        // Mock read function call
        const mockResult = "Mock result: " + Math.random().toString(36).substr(2, 9);
        setFunctionResults({
          ...functionResults,
          [func.name]: mockResult,
        });
      }
    } catch (error) {
      toast({
        title: "Function Call Failed",
        description: "Failed to call contract function",
        variant: "destructive",
      });
    }
  };

  const updateFunctionInput = (functionName: string, paramName: string, value: string) => {
    setFunctionInputs({
      ...functionInputs,
      [functionName]: {
        ...functionInputs[functionName],
        [paramName]: value,
      },
    });
  };

  const readFunctions = parsedAbi.filter(f => f.stateMutability === "view" || f.stateMutability === "pure");
  const writeFunctions = parsedAbi.filter(f => f.stateMutability === "nonpayable" || f.stateMutability === "payable");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interact with Smart Contract</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contract Address Input */}
          <div>
            <Label htmlFor="contractAddress">Contract Address</Label>
            <div className="flex space-x-3">
              <Input
                id="contractAddress"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1"
              />
              <Button onClick={loadContract}>
                Load Contract
              </Button>
            </div>
          </div>

          {/* ABI Upload */}
          <div>
            <Label htmlFor="abi">Contract ABI</Label>
            <Textarea
              id="abi"
              rows={6}
              value={abiInput}
              onChange={(e) => setAbiInput(e.target.value)}
              placeholder="Paste contract ABI JSON here..."
              className="font-mono text-sm"
            />
            <div className="mt-2 flex space-x-3">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Upload ABI File
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-1" />
                Fetch from Etherscan
              </Button>
            </div>
          </div>

          {/* Function Interface */}
          {parsedAbi.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Available Functions</h3>
              
              {/* Read Functions */}
              {readFunctions.length > 0 && (
                <Card>
                  <CardHeader className="bg-gray-50 py-3">
                    <CardTitle className="text-base flex items-center">
                      <Eye className="text-blue-500 mr-2 h-4 w-4" />
                      Read Functions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {readFunctions.map((func) => (
                      <Card key={func.name} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900">{func.name}</h5>
                            <Button
                              size="sm"
                              onClick={() => handleFunctionCall(func, false)}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Query
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {func.inputs.map((input) => (
                              <Input
                                key={input.name}
                                placeholder={`${input.type} ${input.name}`}
                                value={functionInputs[func.name]?.[input.name] || ""}
                                onChange={(e) => updateFunctionInput(func.name, input.name, e.target.value)}
                                className="text-sm"
                              />
                            ))}
                          </div>
                          {functionResults[func.name] && (
                            <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                              <span className="text-sm text-gray-600">Result: </span>
                              <span className="font-mono text-sm">{functionResults[func.name]}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Write Functions */}
              {writeFunctions.length > 0 && (
                <Card>
                  <CardHeader className="bg-gray-50 py-3">
                    <CardTitle className="text-base flex items-center">
                      <Edit className="text-orange-500 mr-2 h-4 w-4" />
                      Write Functions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {writeFunctions.map((func) => (
                      <Card key={func.name} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900">{func.name}</h5>
                            <Button
                              size="sm"
                              onClick={() => handleFunctionCall(func, true)}
                              className="bg-orange-500 hover:bg-orange-600"
                              disabled={!isConnected}
                            >
                              Write
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {func.inputs.map((input) => (
                              <Input
                                key={input.name}
                                placeholder={`${input.type} ${input.name}`}
                                value={functionInputs[func.name]?.[input.name] || ""}
                                onChange={(e) => updateFunctionInput(func.name, input.name, e.target.value)}
                                className="text-sm"
                              />
                            ))}
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <Label className="text-gray-600 mb-1">Gas Limit</Label>
                              <Input type="number" defaultValue="21000" className="text-sm" />
                            </div>
                            <div>
                              <Label className="text-gray-600 mb-1">Gas Price</Label>
                              <Input type="number" defaultValue="20" className="text-sm" />
                            </div>
                            <div>
                              <Label className="text-gray-600 mb-1">Value (ETH)</Label>
                              <Input type="number" defaultValue="0" className="text-sm" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
