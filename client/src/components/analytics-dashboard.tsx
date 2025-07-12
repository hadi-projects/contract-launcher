import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  Activity, 
  TrendingUp, 
  Zap, 
  Users, 
  DollarSign, 
  Clock,
  RefreshCw,
  Lightbulb
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AnalyticsData {
  deployments: any[];
  transactions: any[];
  gasUsage: any[];
  networkActivity: any[];
  userActivity: any[];
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);

  // Mock analytics data
  const { data: analytics, refetch } = useQuery({
    queryKey: ["/api/analytics", timeRange],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        deployments: [
          { date: "2024-01-01", count: 12, success: 10, failed: 2 },
          { date: "2024-01-02", count: 15, success: 14, failed: 1 },
          { date: "2024-01-03", count: 8, success: 7, failed: 1 },
          { date: "2024-01-04", count: 20, success: 18, failed: 2 },
          { date: "2024-01-05", count: 16, success: 15, failed: 1 },
          { date: "2024-01-06", count: 11, success: 10, failed: 1 },
          { date: "2024-01-07", count: 14, success: 13, failed: 1 }
        ],
        gasUsage: [
          { network: "Ethereum", avgGas: 125000, totalCost: 2.4 },
          { network: "Polygon", avgGas: 95000, totalCost: 0.12 },
          { network: "BSC", avgGas: 87000, totalCost: 0.34 },
          { network: "Arbitrum", avgGas: 65000, totalCost: 0.08 },
          { network: "Optimism", avgGas: 58000, totalCost: 0.06 }
        ],
        networkActivity: [
          { name: "Ethereum", value: 45, color: "#627EEA" },
          { name: "Polygon", value: 25, color: "#8247E5" },
          { name: "BSC", value: 15, color: "#F3BA2F" },
          { name: "Arbitrum", value: 10, color: "#28A0F0" },
          { name: "Optimism", value: 5, color: "#FF0420" }
        ],
        userActivity: [
          { hour: "00", deployments: 2, interactions: 5 },
          { hour: "04", deployments: 1, interactions: 3 },
          { hour: "08", deployments: 8, interactions: 15 },
          { hour: "12", deployments: 12, interactions: 25 },
          { hour: "16", deployments: 15, interactions: 30 },
          { hour: "20", deployments: 10, interactions: 20 }
        ]
      };
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const totalDeployments = analytics?.deployments.reduce((sum, day) => sum + day.count, 0) || 0;
  const successRate = analytics?.deployments.reduce((sum, day) => sum + day.success, 0) / Math.max(totalDeployments, 1) * 100 || 0;
  const totalGasCost = analytics?.gasUsage.reduce((sum, network) => sum + network.totalCost, 0) || 0;
  const avgGasUsage = analytics?.gasUsage.reduce((sum, network) => sum + network.avgGas, 0) / Math.max(analytics?.gasUsage.length || 1, 1) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Contract Analytics Dashboard
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleRefresh} 
                disabled={refreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Deployments
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalDeployments}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +12% from last period
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Success Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {successRate.toFixed(1)}%
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +2.3% from last period
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Gas Cost
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalGasCost.toFixed(2)} ETH
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  +5.4% from last period
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Avg Gas Usage
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Math.round(avgGasUsage).toLocaleString()}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  -8.2% from last period
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deployment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics?.deployments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Network Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Network Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.networkActivity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics?.networkActivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gas Usage by Network */}
        <Card>
          <CardHeader>
            <CardTitle>Gas Usage by Network</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.gasUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="network" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgGas" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Activity Pattern */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="deployments" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Deployments"
                />
                <Line 
                  type="monotone" 
                  dataKey="interactions" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Interactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gas Optimization Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            Gas Optimization Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Most Efficient Network
              </h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Optimism
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Average 58k gas per deployment
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                Cost Savings
              </h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                -15.2%
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Compared to last month
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                Peak Hours
              </h4>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                12-16 UTC
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Highest activity period
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: "deployment", contract: "MyToken", network: "Ethereum", time: "2 minutes ago", status: "success" },
              { type: "interaction", contract: "NFTMarketplace", network: "Polygon", time: "5 minutes ago", status: "success" },
              { type: "deployment", contract: "Staking", network: "BSC", time: "12 minutes ago", status: "failed" },
              { type: "interaction", contract: "MyToken", network: "Arbitrum", time: "18 minutes ago", status: "success" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === "success" ? "bg-green-500" : "bg-red-500"
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.type === "deployment" ? "Deployed" : "Interacted with"} {activity.contract}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      on {activity.network} • {activity.time}
                    </p>
                  </div>
                </div>
                <Badge className={
                  activity.status === "success" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}