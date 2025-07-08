
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, DollarSign, Wrench, AlertTriangle, TrendingDown, Shield } from 'lucide-react';

interface Asset {
  id: string;
  type: string;
  model: string;
  user: string;
  status: string;
  location: string;
  purchaseDate: string;
  warrantyExpiry: string;
  lastMaintenance: string;
  depreciationValue: string;
  condition: string;
}

interface AssetLifecycleProps {
  assets: Asset[];
}

const AssetLifecycle: React.FC<AssetLifecycleProps> = ({ assets }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const calculateAssetAge = (purchaseDate: string) => {
    const purchase = new Date(purchaseDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - purchase.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 365);
  };

  const getWarrantyStatus = (warrantyExpiry: string) => {
    const expiry = new Date(warrantyExpiry);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { status: 'Expired', color: 'bg-red-100 text-red-800', days: 0 };
    if (diffDays <= 30) return { status: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800', days: diffDays };
    return { status: 'Active', color: 'bg-green-100 text-green-800', days: diffDays };
  };

  const getMaintenanceStatus = (lastMaintenance: string) => {
    if (lastMaintenance === 'N/A') return { status: 'N/A', color: 'bg-gray-100 text-gray-800' };
    
    const maintenance = new Date(lastMaintenance);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - maintenance.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 180) return { status: 'Overdue', color: 'bg-red-100 text-red-800' };
    if (diffDays > 90) return { status: 'Due Soon', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Up to Date', color: 'bg-green-100 text-green-800' };
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepreciationProgress = (purchaseDate: string) => {
    const age = calculateAssetAge(purchaseDate);
    const expectedLifespan = 5; // Assuming 5 years expected lifespan
    return Math.min(100, (age / expectedLifespan) * 100);
  };

  const filteredAssets = assets.filter(asset => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'warranty-expiring') {
      const warranty = getWarrantyStatus(asset.warrantyExpiry);
      return warranty.status === 'Expiring Soon' || warranty.status === 'Expired';
    }
    if (selectedFilter === 'maintenance-due') {
      const maintenance = getMaintenanceStatus(asset.lastMaintenance);
      return maintenance.status === 'Due Soon' || maintenance.status === 'Overdue';
    }
    if (selectedFilter === 'high-depreciation') {
      return getDepreciationProgress(asset.purchaseDate) > 60;
    }
    return true;
  });

  const warrantyStats = {
    active: assets.filter(a => getWarrantyStatus(a.warrantyExpiry).status === 'Active').length,
    expiring: assets.filter(a => getWarrantyStatus(a.warrantyExpiry).status === 'Expiring Soon').length,
    expired: assets.filter(a => getWarrantyStatus(a.warrantyExpiry).status === 'Expired').length,
  };

  return (
    <div className="space-y-6">
      {/* Lifecycle Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Warranties</p>
                <p className="text-2xl font-bold text-green-600">{warrantyStats.active}</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{warrantyStats.expiring}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired Warranties</p>
                <p className="text-2xl font-bold text-red-600">{warrantyStats.expired}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-blue-600">$45.2K</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Lifecycle Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Asset Lifecycle Management</span>
          </CardTitle>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="warranty-expiring">Warranty Issues</SelectItem>
              <SelectItem value="maintenance-due">Maintenance Due</SelectItem>
              <SelectItem value="high-depreciation">High Depreciation</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredAssets.map((asset) => {
              const warranty = getWarrantyStatus(asset.warrantyExpiry);
              const maintenance = getMaintenanceStatus(asset.lastMaintenance);
              const age = calculateAssetAge(asset.purchaseDate);
              const depreciationProgress = getDepreciationProgress(asset.purchaseDate);

              return (
                <div key={asset.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{asset.model}</h4>
                      <p className="text-sm text-gray-600">{asset.type} • {asset.id}</p>
                      <p className="text-xs text-gray-500">Assigned to: {asset.user} • {asset.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getConditionColor(asset.condition)}>
                        {asset.condition}
                      </Badge>
                      <Badge variant="outline">{age} years old</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Warranty Information */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Warranty Status</span>
                        <Badge className={warranty.color}>
                          {warranty.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>Expires: {asset.warrantyExpiry}</p>
                        {warranty.days > 0 && <p>{warranty.days} days remaining</p>}
                      </div>
                    </div>

                    {/* Maintenance Information */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Maintenance</span>
                        <Badge className={maintenance.color}>
                          {maintenance.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>Last: {asset.lastMaintenance}</p>
                      </div>
                    </div>

                    {/* Depreciation Information */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Current Value</span>
                        <span className="font-semibold">{asset.depreciationValue}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Depreciation</span>
                          <span>{Math.round(depreciationProgress)}%</span>
                        </div>
                        <Progress value={depreciationProgress} className="h-1" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Purchase Date: {asset.purchaseDate}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Wrench className="w-3 h-3 mr-1" />
                        Schedule Maintenance
                      </Button>
                      <Button size="sm" variant="outline">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        Update Value
                      </Button>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetLifecycle;
