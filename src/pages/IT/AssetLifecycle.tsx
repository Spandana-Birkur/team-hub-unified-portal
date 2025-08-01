import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import AssetLifecycle from '@/components/AssetLifecycle';

const AssetLifecyclePage = () => {
  const assets = [
    { 
      id: 'LAP-001', 
      type: 'Laptop', 
      model: 'MacBook Pro 16"', 
      user: 'John Doe', 
      status: 'assigned', 
      location: 'Office',
      purchaseDate: '2023-01-15',
      warrantyExpiry: '2026-01-15',
      lastMaintenance: '2024-06-01',
      depreciationValue: '$2,400',
      condition: 'Excellent'
    },
    { 
      id: 'MON-001', 
      type: 'Monitor', 
      model: 'Dell UltraSharp 27"', 
      user: 'Sarah Johnson', 
      status: 'assigned', 
      location: 'Office',
      purchaseDate: '2023-03-20',
      warrantyExpiry: '2026-03-20',
      lastMaintenance: '2024-03-15',
      depreciationValue: '$320',
      condition: 'Good'
    },
    { 
      id: 'PRT-001', 
      type: 'Printer', 
      model: 'HP LaserJet Pro', 
      user: 'Shared', 
      status: 'active', 
      location: 'Floor 2',
      purchaseDate: '2022-08-10',
      warrantyExpiry: '2025-08-10',
      lastMaintenance: '2024-01-05',
      depreciationValue: '$180',
      condition: 'Fair'
    },
    { 
      id: 'PHN-001', 
      type: 'Phone', 
      model: 'iPhone 13', 
      user: 'Mike Chen', 
      status: 'assigned', 
      location: 'Remote',
      purchaseDate: '2023-09-15',
      warrantyExpiry: '2024-09-15',
      lastMaintenance: 'N/A',
      depreciationValue: '$450',
      condition: 'Good'
    }
  ];

  const lifecycleStats = [
    { title: 'Total Assets', value: '324', icon: TrendingUp, color: 'bg-blue-500' },
    { title: 'End of Life', value: '12', icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Warranty Expiring', value: '15', icon: Calendar, color: 'bg-yellow-500' },
    { title: 'Total Value', value: '$245K', icon: DollarSign, color: 'bg-green-500' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Asset Lifecycle Management</h1>
        <p className="text-muted-foreground">Track asset lifecycle from procurement to retirement with comprehensive analytics.</p>
      </div>

      {/* Lifecycle Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {lifecycleStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Asset Lifecycle Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Asset Lifecycle Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AssetLifecycle assets={assets} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetLifecyclePage;
