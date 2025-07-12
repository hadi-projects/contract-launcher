import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, CheckCircle, XCircle, Clock, TestTube, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestCase {
  id: string;
  name: string;
  description: string;
  code: string;
  status: "idle" | "running" | "passed" | "failed";
  result?: string;
  gasUsed?: number;
  executionTime?: number;
}

interface TestSuiteProps {
  contractCode: string;
  contractAbi: any[];
  onTestComplete?: (results: TestCase[]) => void;
}

export default function ContractTestingSuite({ contractCode, contractAbi, onTestComplete }: TestSuiteProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: "test1",
      name: "Contract Deployment",
      description: "Test successful contract deployment",
      code: `it("should deploy successfully", async function() {
  const contract = await deploy();
  expect(contract.address).to.be.properAddress;
});`,
      status: "idle"
    },
    {
      id: "test2",
      name: "Initial State",
      description: "Verify initial contract state",
      code: `it("should have correct initial state", async function() {
  const contract = await deploy();
  const owner = await contract.owner();
  expect(owner).to.equal(deployer.address);
});`,
      status: "idle"
    },
    {
      id: "test3",
      name: "Access Control",
      description: "Test access control mechanisms",
      code: `it("should restrict access to owner only", async function() {
  const contract = await deploy();
  await expect(
    contract.connect(user1).restrictedFunction()
  ).to.be.revertedWith("Ownable: caller is not the owner");
});`,
      status: "idle"
    }
  ]);
  
  const [customTest, setCustomTest] = useState("");
  const [running, setRunning] = useState(false);
  const [coverage, setCoverage] = useState(0);
  const { toast } = useToast();

  const generateTests = async () => {
    if (!contractCode.trim()) {
      toast({
        title: "No Contract Code",
        description: "Please provide contract code to generate tests",
        variant: "destructive",
      });
      return;
    }

    const generatedTests: TestCase[] = [];
    
    // Analyze contract and generate appropriate tests
    if (contractCode.includes("function transfer")) {
      generatedTests.push({
        id: `test_${Date.now()}_1`,
        name: "Token Transfer",
        description: "Test token transfer functionality",
        code: `it("should transfer tokens correctly", async function() {
  const amount = ethers.utils.parseEther("100");
  await token.transfer(recipient.address, amount);
  expect(await token.balanceOf(recipient.address)).to.equal(amount);
});`,
        status: "idle"
      });
    }
    
    if (contractCode.includes("function mint")) {
      generatedTests.push({
        id: `test_${Date.now()}_2`,
        name: "Token Minting",
        description: "Test token minting functionality",
        code: `it("should mint tokens correctly", async function() {
  const amount = ethers.utils.parseEther("1000");
  await token.mint(user.address, amount);
  expect(await token.balanceOf(user.address)).to.equal(amount);
});`,
        status: "idle"
      });
    }
    
    if (contractCode.includes("onlyOwner")) {
      generatedTests.push({
        id: `test_${Date.now()}_3`,
        name: "Owner Restrictions",
        description: "Test owner-only function restrictions",
        code: `it("should restrict owner-only functions", async function() {
  await expect(
    contract.connect(user).ownerOnlyFunction()
  ).to.be.revertedWith("Ownable: caller is not the owner");
});`,
        status: "idle"
      });
    }

    setTestCases([...testCases, ...generatedTests]);
    
    toast({
      title: "Tests Generated",
      description: `Generated ${generatedTests.length} new test cases`,
    });
  };

  const runAllTests = async () => {
    setRunning(true);
    
    for (let i = 0; i < testCases.length; i++) {
      // Update test status to running
      setTestCases(prev => prev.map((test, index) => 
        index === i ? { ...test, status: "running" } : test
      ));
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Simulate test result
      const passed = Math.random() > 0.2; // 80% pass rate
      const gasUsed = Math.floor(Math.random() * 100000) + 21000;
      const executionTime = Math.floor(Math.random() * 500) + 50;
      
      setTestCases(prev => prev.map((test, index) => 
        index === i ? {
          ...test,
          status: passed ? "passed" : "failed",
          result: passed ? "✓ Test passed" : "✗ Test failed: Assertion error",
          gasUsed,
          executionTime
        } : test
      ));
    }
    
    // Calculate coverage
    const passedTests = testCases.filter(t => t.status === "passed").length;
    const newCoverage = Math.min(95, (passedTests / testCases.length) * 100 + Math.random() * 20);
    setCoverage(newCoverage);
    
    setRunning(false);
    
    if (onTestComplete) {
      onTestComplete(testCases);
    }
    
    toast({
      title: "Test Suite Complete",
      description: `${passedTests}/${testCases.length} tests passed`,
      variant: passedTests === testCases.length ? "default" : "destructive"
    });
  };

  const runSingleTest = async (testId: string) => {
    setTestCases(prev => prev.map(test => 
      test.id === testId ? { ...test, status: "running" } : test
    ));
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const passed = Math.random() > 0.2;
    const gasUsed = Math.floor(Math.random() * 100000) + 21000;
    const executionTime = Math.floor(Math.random() * 500) + 50;
    
    setTestCases(prev => prev.map(test => 
      test.id === testId ? {
        ...test,
        status: passed ? "passed" : "failed",
        result: passed ? "✓ Test passed" : "✗ Test failed: Assertion error",
        gasUsed,
        executionTime
      } : test
    ));
  };

  const addCustomTest = () => {
    if (!customTest.trim()) return;
    
    const newTest: TestCase = {
      id: `custom_${Date.now()}`,
      name: "Custom Test",
      description: "User-defined test case",
      code: customTest,
      status: "idle"
    };
    
    setTestCases([...testCases, newTest]);
    setCustomTest("");
    
    toast({
      title: "Test Added",
      description: "Custom test case added to suite",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <TestTube className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "running":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <TestTube className="h-5 w-5 mr-2 text-primary" />
              Contract Testing Suite
            </div>
            <div className="flex space-x-2">
              <Button onClick={generateTests} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate Tests
              </Button>
              <Button 
                onClick={runAllTests} 
                disabled={running || testCases.length === 0}
                size="sm"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Run All Tests
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Coverage Display */}
          {coverage > 0 && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Test Coverage
                </span>
                <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                  {coverage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div 
                  className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${coverage}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Test Results Summary */}
          {testCases.some(t => t.status !== "idle") && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {testCases.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {testCases.filter(t => t.status === "passed").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {testCases.filter(t => t.status === "failed").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {testCases.filter(t => t.status === "running").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Running</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Test Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testCases.map((test) => (
              <Card key={test.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {test.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {test.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      <Button
                        onClick={() => runSingleTest(test.id)}
                        disabled={test.status === "running"}
                        variant="outline"
                        size="sm"
                      >
                        Run
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 mb-3">
                    <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                      {test.code}
                    </pre>
                  </div>
                  
                  {test.result && (
                    <div className="space-y-2">
                      <div className={`p-2 rounded text-sm ${
                        test.status === "passed" 
                          ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                          : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                      }`}>
                        {test.result}
                      </div>
                      <div className="flex space-x-4 text-xs text-gray-600 dark:text-gray-300">
                        {test.gasUsed && (
                          <span>Gas Used: {test.gasUsed.toLocaleString()}</span>
                        )}
                        {test.executionTime && (
                          <span>Execution Time: {test.executionTime}ms</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Custom Test */}
      <Card>
        <CardHeader>
          <CardTitle>Add Custom Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={customTest}
              onChange={(e) => setCustomTest(e.target.value)}
              placeholder="Write your custom test case here..."
              rows={6}
              className="font-mono text-sm"
            />
            <Button onClick={addCustomTest} disabled={!customTest.trim()}>
              Add Test Case
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}