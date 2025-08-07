import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Download,
  Calendar,
  Users,
  Target,
  Activity
} from 'lucide-react';

interface SLAReport {
  period: string;
  totalTickets: number;
  resolvedTickets: number;
  escalatedTickets: number;
  overdueTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  slaCompliance: number;
  teamPerformance: TeamPerformance[];
  categoryBreakdown: CategoryBreakdown[];
}

interface TeamPerformance {
  team: string;
  totalTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number;
  slaCompliance: number;
  escalationRate: number;
}

interface CategoryBreakdown {
  category: string;
  totalTickets: number;
  avgResolutionTime: number;
  slaCompliance: number;
  priority: string;
}

const SLAReporting = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedTeam, setSelectedTeam] = useState('all');

  // Mock data for SLA reporting
  const slaReports: SLAReport[] = [
    {
      period: 'Last 7 Days',
      totalTickets: 156,
      resolvedTickets: 142,
      escalatedTickets: 8,
      overdueTickets: 6,
      avgResponseTime: 2.3,
      avgResolutionTime: 8.7,
      slaCompliance: 91.0,
      teamPerformance: [
        {
          team: 'Hardware Support',
          totalTickets: 45,
          resolvedTickets: 42,
          avgResolutionTime: 6.2,
          slaCompliance: 93.3,
          escalationRate: 6.7
        },
        {
          team: 'Network Team',
          totalTickets: 38,
          resolvedTickets: 35,
          avgResolutionTime: 4.8,
          slaCompliance: 92.1,
          escalationRate: 7.9
        },
        {
          team: 'Software Support',
          totalTickets: 73,
          resolvedTickets: 65,
          avgResolutionTime: 12.1,
          slaCompliance: 89.0,
          escalationRate: 11.0
        }
      ],
      categoryBreakdown: [
        {
          category: 'Hardware',
          totalTickets: 45,
          avgResolutionTime: 6.2,
          slaCompliance: 93.3,
          priority: 'high'
        },
        {
          category: 'Network',
          totalTickets: 38,
          avgResolutionTime: 4.8,
          slaCompliance: 92.1,
          priority: 'high'
        },
        {
          category: 'Software',
          totalTickets: 73,
          avgResolutionTime: 12.1,
          slaCompliance: 89.0,
          priority: 'medium'
        }
      ]
    }
  ];

  const currentReport = slaReports[0]; // For demo, using the first report

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return 'text-green-600';
    if (compliance >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceBadge = (compliance: number) => {
    if (compliance >= 95) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (compliance >= 85) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const handleExportReport = () => {
    // In a real app, this would generate and download a report
    console.log('Exporting SLA report for period:', selectedPeriod);
  };

  const filteredTeamPerformance = selectedTeam === 'all' 
    ? currentReport.teamPerformance 
    : currentReport.teamPerformance.filter(team => team.team === selectedTeam);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">SLA Analytics & Reporting</h2>
          <p className="text-muted-foreground">Comprehensive SLA performance metrics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold text-foreground">{currentReport.totalTickets}</p>
                <p className="text-xs text-muted-foreground mt-1">Period: {currentReport.period}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">SLA Compliance</p>
                <p className={`text-2xl font-bold ${getComplianceColor(currentReport.slaCompliance)}`}>
                  {currentReport.slaCompliance}%
                </p>
                <div className="mt-1">
                  {getComplianceBadge(currentReport.slaCompliance)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-500">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold text-foreground">{currentReport.avgResponseTime}h</p>
                <p className="text-xs text-muted-foreground mt-1">Target: 2h</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Escalation Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round((currentReport.escalatedTickets / currentReport.totalTickets) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentReport.escalatedTickets} escalations
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Team Performance</span>
            </CardTitle>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="Hardware Support">Hardware Support</SelectItem>
                <SelectItem value="Network Team">Network Team</SelectItem>
                <SelectItem value="Software Support">Software Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTeamPerformance.map((team, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{team.team}</h4>
                    <p className="text-sm text-muted-foreground">
                      {team.resolvedTickets} of {team.totalTickets} tickets resolved
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getComplianceColor(team.slaCompliance)}>
                      {team.slaCompliance}% SLA
                    </Badge>
                    <Badge variant="outline">
                      {team.escalationRate}% escalation
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Resolution Time</p>
                    <p className="text-lg font-semibold">{team.avgResolutionTime}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SLA Compliance</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={team.slaCompliance} className="flex-1" />
                      <span className="text-sm font-medium">{team.slaCompliance}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Escalation Rate</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={team.escalationRate} className="flex-1" />
                      <span className="text-sm font-medium">{team.escalationRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Category Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentReport.categoryBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      category.priority === 'high' ? 'bg-red-500' : 
                      category.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="font-medium text-foreground">{category.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.totalTickets} tickets
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{category.avgResolutionTime}h</p>
                    <p className={`text-sm ${getComplianceColor(category.slaCompliance)}`}>
                      {category.slaCompliance}% SLA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Performance Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">SLA Compliance</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">+2.3%</p>
                  <p className="text-xs text-muted-foreground">vs last period</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Response Time</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">-0.5h</p>
                  <p className="text-xs text-muted-foreground">vs last period</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Escalations</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">-1.2%</p>
                  <p className="text-xs text-muted-foreground">vs last period</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Resolution Rate</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">+5.1%</p>
                  <p className="text-xs text-muted-foreground">vs last period</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Detailed Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {currentReport.resolvedTickets}
              </div>
              <p className="text-sm text-muted-foreground">Resolved Tickets</p>
              <p className="text-xs text-green-600 mt-1">
                {Math.round((currentReport.resolvedTickets / currentReport.totalTickets) * 100)}% resolution rate
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {currentReport.avgResolutionTime}h
              </div>
              <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
              <p className="text-xs text-blue-600 mt-1">
                Target: 8h | {currentReport.avgResolutionTime > 8 ? 'Above' : 'Below'} target
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {currentReport.overdueTickets}
              </div>
              <p className="text-sm text-muted-foreground">Overdue Tickets</p>
              <p className="text-xs text-red-600 mt-1">
                {Math.round((currentReport.overdueTickets / currentReport.totalTickets) * 100)}% overdue rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SLAReporting; 