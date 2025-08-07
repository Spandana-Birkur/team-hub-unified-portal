import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'recharts';
import {
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Award,
  AlertTriangle,
  UserPlus,
  UserMinus,
  Calendar,
  FileText,
  Target,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Download
} from 'lucide-react';

const HRAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last30days');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for analytics
  const employeeMetrics = {
    totalEmployees: 247,
    newHires: 12,
    departures: 3,
    activeEmployees: 244,
    contractEmployees: 28,
    fullTimeEmployees: 219
  };

  const departmentData = [
    { name: 'Engineering', employees: 85, budget: 850000, avgSalary: 95000 },
    { name: 'Sales', employees: 45, budget: 450000, avgSalary: 75000 },
    { name: 'Marketing', employees: 25, budget: 300000, avgSalary: 70000 },
    { name: 'HR', employees: 15, budget: 180000, avgSalary: 65000 },
    { name: 'Operations', employees: 35, budget: 280000, avgSalary: 58000 },
    { name: 'Finance', employees: 20, budget: 240000, avgSalary: 80000 },
    { name: 'Customer Support', employees: 22, budget: 176000, avgSalary: 55000 }
  ];

  const hiringTrendsData = [
    { month: 'Jan', hires: 8, departures: 5 },
    { month: 'Feb', hires: 12, departures: 3 },
    { month: 'Mar', hires: 15, departures: 7 },
    { month: 'Apr', hires: 10, departures: 4 },
    { month: 'May', hires: 18, departures: 6 },
    { month: 'Jun', hires: 14, departures: 2 },
    { month: 'Jul', hires: 20, departures: 8 },
    { month: 'Aug', hires: 16, departures: 5 },
    { month: 'Sep', hires: 22, departures: 3 },
    { month: 'Oct', hires: 19, departures: 9 },
    { month: 'Nov', hires: 12, departures: 4 },
    { month: 'Dec', hires: 14, departures: 6 }
  ];

  const performanceData = [
    { rating: 'Excellent', count: 45, percentage: 18.3 },
    { rating: 'Good', count: 98, percentage: 39.8 },
    { rating: 'Satisfactory', count: 85, percentage: 34.6 },
    { rating: 'Needs Improvement', count: 15, percentage: 6.1 },
    { rating: 'Unsatisfactory', count: 3, percentage: 1.2 }
  ];

  const leaveData = [
    { month: 'Jan', vacation: 45, sick: 23, personal: 12 },
    { month: 'Feb', vacation: 38, sick: 19, personal: 8 },
    { month: 'Mar', vacation: 52, sick: 25, personal: 15 },
    { month: 'Apr', vacation: 68, sick: 18, personal: 22 },
    { month: 'May', vacation: 75, sick: 20, personal: 18 },
    { month: 'Jun', vacation: 85, sick: 15, personal: 25 }
  ];

  const diversityData = [
    { category: 'Male', value: 142, color: '#3b82f6' },
    { category: 'Female', value: 105, color: '#ec4899' },
    { category: 'Prefer not to say', value: 0, color: '#64748b' }
  ];

  const ageDistributionData = [
    { range: '18-25', count: 32 },
    { range: '26-35', count: 98 },
    { range: '36-45', count: 85 },
    { range: '46-55', count: 28 },
    { range: '56+', count: 4 }
  ];

  const salaryBenchmarkData = [
    { position: 'Software Engineer', internal: 95000, market: 98000, difference: -3.1 },
    { position: 'Product Manager', internal: 120000, market: 115000, difference: 4.3 },
    { position: 'Sales Manager', internal: 85000, market: 88000, difference: -3.4 },
    { position: 'Marketing Specialist', internal: 65000, market: 67000, difference: -3.0 },
    { position: 'HR Specialist', internal: 60000, market: 62000, difference: -3.2 }
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">{employeeMetrics.totalEmployees}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+2.5% from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Hires</p>
              <p className="text-3xl font-bold text-gray-900">{employeeMetrics.newHires}</p>
            </div>
            <UserPlus className="w-8 h-8 text-green-500" />
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+20% from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Departures</p>
              <p className="text-3xl font-bold text-gray-900">{employeeMetrics.departures}</p>
            </div>
            <UserMinus className="w-8 h-8 text-red-500" />
          </div>
          <div className="flex items-center mt-2">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-sm text-red-600">-50% from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Retention Rate</p>
              <p className="text-3xl font-bold text-gray-900">94.2%</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+1.2% from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into workforce metrics and trends</p>
        </div>
        <div className="flex space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="lastyear">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hiring">Hiring & Retention</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="diversity">Diversity & Demographics</TabsTrigger>
          <TabsTrigger value="compensation">Compensation</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {renderOverviewCards()}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Department Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="employees" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Hiring vs Departures Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hiringTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hires" stroke="#10b981" strokeWidth={3} />
                    <Line type="monotone" dataKey="departures" stroke="#ef4444" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hiring & Retention Tab */}
        <TabsContent value="hiring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Hiring Rate</p>
                  <p className="text-2xl font-bold text-green-600">15.2%</p>
                  <p className="text-xs text-gray-500">Annual growth rate</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Turnover Rate</p>
                  <p className="text-2xl font-bold text-red-600">5.8%</p>
                  <p className="text-xs text-gray-500">Below industry average</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Time to Fill</p>
                  <p className="text-2xl font-bold text-blue-600">32 days</p>
                  <p className="text-xs text-gray-500">Average position</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hiring Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={hiringTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="hires" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="departures" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="w-5 h-5" />
                  <span>Performance Ratings Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leaveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vacation" fill="#3b82f6" />
                    <Bar dataKey="sick" fill="#ef4444" />
                    <Bar dataKey="personal" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Diversity Tab */}
        <TabsContent value="diversity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={diversityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, value }) => `${category}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {diversityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compensation Tab */}
        <TabsContent value="compensation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Benchmark Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salaryBenchmarkData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.position}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">
                          Internal: ${item.internal.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-600">
                          Market: ${item.market.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Badge variant={item.difference >= 0 ? 'default' : 'destructive'}>
                      {item.difference >= 0 ? '+' : ''}{item.difference}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRAnalytics;
