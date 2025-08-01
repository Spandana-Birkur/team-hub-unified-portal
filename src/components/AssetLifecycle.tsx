
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, DollarSign, Wrench, AlertTriangle, TrendingDown, Shield, CalendarDays, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showValueDialog, setShowValueDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState({
    scheduledDate: '',
    maintenanceType: '',
    description: '',
    assignedTechnician: ''
  });
  const [valueData, setValueData] = useState({
    newValue: '',
    reason: ''
  });

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

  const handleScheduleMaintenance = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowMaintenanceDialog(true);
  };

  const handleUpdateValue = (asset: Asset) => {
    setSelectedAsset(asset);
    setValueData({ newValue: asset.depreciationValue.replace('$', ''), reason: '' });
    setShowValueDialog(true);
  };

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowDetailsDialog(true);
  };

  const submitMaintenance = () => {
    if (!maintenanceData.scheduledDate || !maintenanceData.maintenanceType || !maintenanceData.assignedTechnician) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Maintenance Scheduled",
      description: `Maintenance scheduled for ${selectedAsset?.model} on ${maintenanceData.scheduledDate}`,
    });

    setMaintenanceData({
      scheduledDate: '',
      maintenanceType: '',
      description: '',
      assignedTechnician: ''
    });
    setShowMaintenanceDialog(false);
  };

  const submitValueUpdate = () => {
    if (!valueData.newValue || !valueData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Value Updated",
      description: `Asset value updated to $${valueData.newValue}`,
    });

    setValueData({ newValue: '', reason: '' });
    setShowValueDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Lifecycle Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Warranties</p>
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
                <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
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
                <p className="text-sm font-medium text-muted-foreground">Expired Warranties</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
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
                      <h4 className="font-semibold text-foreground">{asset.model}</h4>
                      <p className="text-sm text-muted-foreground">{asset.type} • {asset.id}</p>
                      <p className="text-xs text-muted-foreground opacity-70">Assigned to: {asset.user} • {asset.location}</p>
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
                        <span className="text-sm font-medium text-muted-foreground">Warranty Status</span>
                        <Badge className={warranty.color}>
                          {warranty.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground opacity-70">
                        <p>Expires: {asset.warrantyExpiry}</p>
                        {warranty.days > 0 && <p>{warranty.days} days remaining</p>}
                      </div>
                    </div>

                    {/* Maintenance Information */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Maintenance</span>
                        <Badge className={maintenance.color}>
                          {maintenance.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground opacity-70">
                        <p>Last: {asset.lastMaintenance}</p>
                      </div>
                    </div>

                    {/* Depreciation Information */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Current Value</span>
                        <span className="font-semibold">{asset.depreciationValue}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground opacity-70">
                          <span>Depreciation</span>
                          <span>{Math.round(depreciationProgress)}%</span>
                        </div>
                        <Progress value={depreciationProgress} className="h-1" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground opacity-70">
                      <span>Purchase Date: {asset.purchaseDate}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleScheduleMaintenance(asset)}
                      >
                        <Wrench className="w-3 h-3 mr-1" />
                        Schedule Maintenance
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateValue(asset)}
                      >
                        <TrendingDown className="w-3 h-3 mr-1" />
                        Update Value
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleViewDetails(asset)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Maintenance Dialog */}
      <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance - {selectedAsset?.model}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input 
                id="scheduledDate"
                type="date"
                value={maintenanceData.scheduledDate}
                onChange={(e) => setMaintenanceData({...maintenanceData, scheduledDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="maintenanceType">Maintenance Type</Label>
              <Select value={maintenanceData.maintenanceType} onValueChange={(value) => setMaintenanceData({...maintenanceData, maintenanceType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select maintenance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine Maintenance</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="upgrade">Upgrade</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignedTechnician">Assigned Technician</Label>
              <Input 
                id="assignedTechnician"
                value={maintenanceData.assignedTechnician}
                onChange={(e) => setMaintenanceData({...maintenanceData, assignedTechnician: e.target.value})}
                placeholder="e.g., John Smith"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={maintenanceData.description}
                onChange={(e) => setMaintenanceData({...maintenanceData, description: e.target.value})}
                placeholder="Describe the maintenance work to be performed..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMaintenanceDialog(false)}>Cancel</Button>
            <Button onClick={submitMaintenance}>Schedule Maintenance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Value Dialog */}
      <Dialog open={showValueDialog} onOpenChange={setShowValueDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Asset Value - {selectedAsset?.model}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newValue">New Value ($)</Label>
              <Input 
                id="newValue"
                type="number"
                value={valueData.newValue}
                onChange={(e) => setValueData({...valueData, newValue: e.target.value})}
                placeholder="e.g., 1800"
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason for Update</Label>
              <Select value={valueData.reason} onValueChange={(value) => setValueData({...valueData, reason: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="depreciation">Depreciation</SelectItem>
                  <SelectItem value="market-value">Market Value Change</SelectItem>
                  <SelectItem value="damage">Damage Assessment</SelectItem>
                  <SelectItem value="upgrade">Upgrade Impact</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowValueDialog(false)}>Cancel</Button>
            <Button onClick={submitValueUpdate}>Update Value</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Asset Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Details - {selectedAsset?.model}</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Asset ID</Label>
                  <p className="text-sm">{selectedAsset.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="text-sm">{selectedAsset.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                  <p className="text-sm">{selectedAsset.model}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className={getConditionColor(selectedAsset.condition)}>
                    {selectedAsset.condition}
                  </Badge>
                </div>
              </div>

              {/* Assignment Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Assignment Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Assigned User</Label>
                    <p className="text-sm">{selectedAsset.user}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                    <p className="text-sm">{selectedAsset.location}</p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Financial Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Current Value</Label>
                    <p className="text-sm font-semibold">{selectedAsset.depreciationValue}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                    <p className="text-sm">{calculateAssetAge(selectedAsset.purchaseDate)} years</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Purchase Date</Label>
                    <p className="text-sm">{selectedAsset.purchaseDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Warranty Expiry</Label>
                    <p className="text-sm">{selectedAsset.warrantyExpiry}</p>
                  </div>
                </div>
              </div>

              {/* Maintenance Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Maintenance Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Maintenance</Label>
                    <p className="text-sm">{selectedAsset.lastMaintenance}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Maintenance Status</Label>
                    <Badge className={getMaintenanceStatus(selectedAsset.lastMaintenance).color}>
                      {getMaintenanceStatus(selectedAsset.lastMaintenance).status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Depreciation Progress */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Depreciation Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Depreciation Progress</span>
                    <span>{Math.round(getDepreciationProgress(selectedAsset.purchaseDate))}%</span>
                  </div>
                  <Progress value={getDepreciationProgress(selectedAsset.purchaseDate)} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Expected lifespan: 5 years • Current age: {calculateAssetAge(selectedAsset.purchaseDate)} years
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetLifecycle;
