import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Rocket, Info, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/hooks/use-web3";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ConstructorParam {
  name: string;
  type: string;
  value: string;
}

export default function ContractDeploy() {
  const [sourceCode, setSourceCode] = useState("");
  const [contractName, setContractName] = useState("");
  const [solidityVersion, setSolidityVersion] = useState("0.8.19");
  const [optimization, setOptimization] = useState("enabled");
  const [constructorParams, setConstructorParams] = useState<ConstructorParam[]>([]);
  const [gasLimit, setGasLimit] = useState("3000000");
  const [gasPrice, setGasPrice] = useState("20");
  const [deploymentStatus, setDeploymentStatus] = useState<string>("");
  
  const { toast } = useToast();
  const { account, web3, isConnected } = useWeb3();
  const queryClient = useQueryClient();

  // Load template data if available
  useEffect(() => {
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    if (selectedTemplate) {
      const template = JSON.parse(selectedTemplate);
      setSourceCode(template.sourceCode || "");
      setContractName(template.name || "");
      
      // Parse constructor parameters if available
      if (template.constructorParams) {
        setConstructorParams(template.constructorParams.map((param: any) => ({
          name: param.name,
          type: param.type,
          value: ""
        })));
      }
      
      // Clear the stored template
      localStorage.removeItem('selectedTemplate');
      
      toast({
        title: "Template Loaded",
        description: `${template.name} template has been loaded`,
      });
    }
  }, [toast]);

  const compileMutation = useMutation({
    mutationFn: async (data: { sourceCode: string; version: string }) => {
      const response = await apiRequest("POST", "/api/compile", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Compilation Successful",
          description: "Contract compiled successfully",
        });
      } else {
        toast({
          title: "Compilation Failed",
          description: data.error || "Unknown compilation error",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Compilation Error",
        description: "Failed to compile contract",
        variant: "destructive",
      });
    },
  });

  const deployMutation = useMutation({
    mutationFn: async (contractData: any) => {
      const response = await apiRequest("POST", "/api/contracts", contractData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({
        title: "Contract Deployed",
        description: "Contract deployed successfully",
      });
      setDeploymentStatus("deployed");
    },
    onError: () => {
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy contract",
        variant: "destructive",
      });
      setDeploymentStatus("failed");
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSourceCode(content);
        setContractName(file.name.replace('.sol', ''));
      };
      reader.readAsText(file);
    }
  };

  const addConstructorParam = () => {
    setConstructorParams([...constructorParams, { name: "", type: "string", value: "" }]);
  };

  const removeConstructorParam = (index: number) => {
    setConstructorParams(constructorParams.filter((_, i) => i !== index));
  };

  const updateConstructorParam = (index: number, field: keyof ConstructorParam, value: string) => {
    const updated = [...constructorParams];
    updated[index][field] = value;
    setConstructorParams(updated);
  };

  const handleCompile = () => {
    if (!sourceCode) {
      toast({
        title: "Error",
        description: "Please provide source code",
        variant: "destructive",
      });
      return;
    }

    compileMutation.mutate({
      sourceCode,
      version: solidityVersion,
    });
  };

  const handleDeploy = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!sourceCode || !contractName) {
      toast({
        title: "Missing Information",
        description: "Please provide contract name and source code",
        variant: "destructive",
      });
      return;
    }

    setDeploymentStatus("compiling");

    try {
      // First compile the contract
      const compileResult = await compileMutation.mutateAsync({
        sourceCode,
        version: solidityVersion,
      });

      if (!compileResult.success) {
        throw new Error("Compilation failed");
      }

      setDeploymentStatus("deploying");

      // In a real implementation, this would deploy using Web3
      // For now, we'll create a mock deployment
      const mockAddress = "0x" + Math.random().toString(16).substr(2, 40);
      const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64);

      const contractData = {
        name: contractName,
        address: mockAddress,
        abi: compileResult.abi,
        bytecode: compileResult.bytecode,
        sourceCode,
        compilationVersion: solidityVersion,
        network: "1", // Mock network ID
        deployerAddress: account || "",
        deploymentTxHash: mockTxHash,
        isVerified: false,
      };

      await deployMutation.mutateAsync(contractData);

    } catch (error) {
      setDeploymentStatus("failed");
      console.error("Deployment error:", error);
    }
  };

  const estimatedCost = (parseInt(gasLimit) * parseInt(gasPrice)) / 1e9;

  return (
    <div className="space-y-6">
      {/* Contract Deployment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Deploy Smart Contract</span>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Info className="h-4 w-4" />
              <span>Fill in contract details to deploy</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contract Name */}
          <div>
            <Label htmlFor="contractName">Contract Name</Label>
            <Input
              id="contractName"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              placeholder="Enter contract name"
            />
          </div>

          {/* Contract Source */}
          <div>
            <Label>Contract Source Code</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="text-gray-400 text-2xl mb-2 mx-auto" />
              <p className="text-gray-600 mb-2">Drop your .sol files here or click to browse</p>
              <input
                type="file"
                className="hidden"
                accept=".sol"
                onChange={handleFileUpload}
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Browse Files
              </Button>
            </div>
            {sourceCode && (
              <Textarea
                className="mt-4 font-mono text-sm"
                rows={10}
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                placeholder="Paste your Solidity code here..."
              />
            )}
          </div>

          {/* Compiler Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Solidity Version</Label>
              <Select value={solidityVersion} onValueChange={setSolidityVersion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.8.19">0.8.19</SelectItem>
                  <SelectItem value="0.8.18">0.8.18</SelectItem>
                  <SelectItem value="0.8.17">0.8.17</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Optimization</Label>
              <Select value={optimization} onValueChange={setOptimization}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled (200 runs)</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Constructor Parameters */}
          <div>
            <Label>Constructor Parameters</Label>
            <div className="space-y-3">
              {constructorParams.map((param, index) => (
                <div key={index} className="flex space-x-3">
                  <Input
                    placeholder="Parameter name"
                    value={param.name}
                    onChange={(e) => updateConstructorParam(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    value={param.type}
                    onValueChange={(value) => updateConstructorParam(index, "type", value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">string</SelectItem>
                      <SelectItem value="uint256">uint256</SelectItem>
                      <SelectItem value="address">address</SelectItem>
                      <SelectItem value="bool">bool</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Value"
                    value={param.value}
                    onChange={(e) => updateConstructorParam(index, "value", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeConstructorParam(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addConstructorParam}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Parameter
              </Button>
            </div>
          </div>

          {/* Gas Settings */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Gas Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Gas Limit</Label>
                <Input
                  type="number"
                  value={gasLimit}
                  onChange={(e) => setGasLimit(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">Gas Price (Gwei)</Label>
                <Input
                  type="number"
                  value={gasPrice}
                  onChange={(e) => setGasPrice(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">Estimated Cost</Label>
                <div className="px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900">
                  ~{estimatedCost.toFixed(6)} ETH
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleCompile}
              variant="outline"
              disabled={compileMutation.isPending || !sourceCode}
            >
              {compileMutation.isPending ? "Compiling..." : "Compile"}
            </Button>
            <Button
              onClick={handleDeploy}
              disabled={deployMutation.isPending || !sourceCode || !isConnected}
              className="flex items-center space-x-2"
            >
              <Rocket className="h-4 w-4" />
              <span>{deployMutation.isPending ? "Deploying..." : "Deploy Contract"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                deploymentStatus === "deployed" ? "bg-green-500" :
                deploymentStatus === "failed" ? "bg-red-500" :
                deploymentStatus ? "bg-yellow-500 animate-pulse" : "bg-gray-300"
              }`}></div>
              <span className="text-gray-600">
                {deploymentStatus === "compiling" ? "Compiling contract..." :
                 deploymentStatus === "deploying" ? "Deploying contract..." :
                 deploymentStatus === "deployed" ? "Contract deployed successfully!" :
                 deploymentStatus === "failed" ? "Deployment failed" :
                 "Waiting for deployment..."}
              </span>
            </div>
            
            {deploymentStatus && (
              <div className="ml-6 space-y-2 text-sm text-gray-500">
                <div>• Compiling contract...</div>
                <div>• Estimating gas...</div>
                <div>• Waiting for user confirmation...</div>
                <div>• Broadcasting transaction...</div>
                <div>• Waiting for confirmation...</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
