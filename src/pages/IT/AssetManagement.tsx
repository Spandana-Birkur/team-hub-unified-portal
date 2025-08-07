import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Laptop, Monitor, Printer, Smartphone, Plus, Search, Filter, X, History, Settings, User, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AssetManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [newAsset, setNewAsset] = useState({
    type: '',
    model: '',
    user: '',
    location: '',
    purchaseDate: '',
    warrantyExpiry: '',
    condition: 'Good'
  });

  const [assets, setAssets] = useState([
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
      condition: 'Excellent',
      history: [
        { date: '2024-06-01', action: 'Maintenance completed', user: 'IT Staff' },
        { date: '2023-01-15', action: 'Asset assigned to John Doe', user: 'HR' },
        { date: '2023-01-10', action: 'Asset purchased', user: 'Procurement' }
      ]
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
      condition: 'Good',
      history: [
        { date: '2024-03-15', action: 'Routine maintenance', user: 'IT Staff' },
        { date: '2023-03-20', action: 'Asset assigned to Sarah Johnson', user: 'HR' },
        { date: '2023-03-15', action: 'Asset purchased', user: 'Procurement' }
      ]
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
      condition: 'Fair',
      history: [
        { date: '2024-01-05', action: 'Maintenance - replaced toner', user: 'IT Staff' },
        { date: '2022-08-10', action: 'Asset installed in Floor 2', user: 'IT Staff' },
        { date: '2022-08-05', action: 'Asset purchased', user: 'Procurement' }
      ]
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
      condition: 'Good',
      history: [
        { date: '2023-09-15', action: 'Asset assigned to Mike Chen', user: 'HR' },
        { date: '2023-09-10', action: 'Asset purchased', user: 'Procurement' }
      ]
    },
    { 
      id: 'LAP-002', 
      type: 'Laptop', 
      model: 'Dell XPS 15', 
      user: 'Emily Davis', 
      status: 'assigned', 
      location: 'Office',
      purchaseDate: '2023-05-10',
      warrantyExpiry: '2026-05-10',
      lastMaintenance: '2024-04-20',
      depreciationValue: '$1,800',
      condition: 'Good',
      history: [
        { date: '2024-04-20', action: 'Software update and maintenance', user: 'IT Staff' },
        { date: '2023-05-10', action: 'Asset assigned to Emily Davis', user: 'HR' },
        { date: '2023-05-05', action: 'Asset purchased', user: 'Procurement' }
      ]
    },
    { 
      id: 'MON-002', 
      type: 'Monitor', 
      model: 'LG 34" Ultrawide', 
      user: 'Tom Wilson', 
      status: 'assigned', 
      location: 'Office',
      purchaseDate: '2023-07-15',
      warrantyExpiry: '2026-07-15',
      lastMaintenance: '2024-02-10',
      depreciationValue: '$280',
      condition: 'Excellent',
      history: [
        { date: '2024-02-10', action: 'Display calibration', user: 'IT Staff' },
        { date: '2023-07-15', action: 'Asset assigned to Tom Wilson', user: 'HR' },
        { date: '2023-07-10', action: 'Asset purchased', user: 'Procurement' }
      ]
    }
  ]);

  const assetStats = [
    { title: 'Total Assets', value: '324', icon: Laptop, color: 'bg-blue-500' },
    { title: 'Assigned', value: '287', icon: Monitor, color: 'bg-green-500' },
    { title: 'Available', value: '37', icon: Printer, color: 'bg-yellow-500' },
    { title: 'Under Maintenance', value: '12', icon: Smartphone, color: 'bg-orange-500' },
  ];

  const getAssetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'laptop': return Laptop;
      case 'monitor': return Monitor;
      case 'printer': return Printer;
      case 'phone': return Smartphone;
      default: return Laptop;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter assets based on search and filter criteria
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = searchQuery === '' || 
      asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || asset.type.toLowerCase() === filterType.toLowerCase();
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddAsset = () => {
    if (!newAsset.type || !newAsset.model || !newAsset.user || !newAsset.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Generate new asset ID
    const assetId = `${newAsset.type.substring(0, 3).toUpperCase()}-${String(assets.length + 1).padStart(3, '0')}`;
    
    const asset = {
      id: assetId,
      type: newAsset.type,
      model: newAsset.model,
      user: newAsset.user,
      status: 'assigned',
      location: newAsset.location,
      purchaseDate: newAsset.purchaseDate,
      warrantyExpiry: newAsset.warrantyExpiry,
      lastMaintenance: 'N/A',
      depreciationValue: '$0',
      condition: newAsset.condition,
      history: [
        { date: new Date().toISOString().split('T')[0], action: 'Asset added to inventory', user: 'IT Staff' }
      ]
    };

    // Add the new asset to the state
    setAssets(prevAssets => [...prevAssets, asset]);

    toast({
      title: "Asset Added",
      description: `Asset ${assetId} has been successfully added to inventory.`,
    });

    setNewAsset({
      type: '',
      model: '',
      user: '',
      location: '',
      purchaseDate: '',
      warrantyExpiry: '',
      condition: 'Good'
    });
    setShowAddAsset(false);
  };

  const handleViewHistory = (asset: any) => {
    setSelectedAsset(asset);
    setShowHistory(true);
  };

  const handleManage = (asset: any) => {
    setSelectedAsset(asset);
    setShowManage(true);
  };

  const handleUpdateAsset = (updates: any) => {
    // Update the asset in the state
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === selectedAsset.id ? { ...asset, ...updates } : asset
      )
    );

    toast({
      title: "Asset Updated",
      description: `Asset ${selectedAsset.id} has been successfully updated.`,
    });
    setShowManage(false);
    setSelectedAsset(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Asset Management</h1>
        <p className="text-muted-foreground">Track and manage IT assets, hardware inventory, and equipment lifecycle.</p>
      </div>

      {/* Asset Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {assetStats.map((stat, index) => (
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

      {/* Asset Management Controls */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Laptop className="w-5 h-5" />
            <span>IT Assets ({assets.length})</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowAddAsset(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          {showSearch && (
            <div className="mb-4">
              <Input 
                placeholder="Search assets by model, user, or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {/* Filter Options */}
          {showFilter && (
            <div className="mb-4 flex space-x-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="laptop">Laptops</SelectItem>
                  <SelectItem value="monitor">Monitors</SelectItem>
                  <SelectItem value="printer">Printers</SelectItem>
                  <SelectItem value="phone">Phones</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-4">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => {
                const AssetIcon = getAssetIcon(asset.type);
                return (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <AssetIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{asset.model}</h4>
                          <p className="text-sm text-muted-foreground">{asset.type} • {asset.id}</p>
                          <p className="text-xs text-muted-foreground opacity-70">Assigned to: {asset.user} • {asset.location}</p>
                          <p className="text-xs text-muted-foreground opacity-70">Condition: {asset.condition} • Value: {asset.depreciationValue}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(asset.status)}>
                        {asset.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewHistory(asset)}
                      >
                        <History className="w-3 h-3 mr-1" />
                        View History
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleManage(asset)}
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Laptop className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
                <p className="text-gray-500">
                  {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No assets have been added yet. Click "Add Asset" to get started.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Asset Categories Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Asset Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Laptops</span>
                <Badge variant="secondary">{assets.filter(a => a.type.toLowerCase() === 'laptop').length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Monitors</span>
                <Badge variant="secondary">{assets.filter(a => a.type.toLowerCase() === 'monitor').length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Printers</span>
                <Badge variant="secondary">{assets.filter(a => a.type.toLowerCase() === 'printer').length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Phones</span>
                <Badge variant="secondary">{assets.filter(a => a.type.toLowerCase() === 'phone').length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Warranty Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Under Warranty</span>
                <Badge className="bg-green-100 text-green-800">298</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Expiring Soon</span>
                <Badge className="bg-yellow-100 text-yellow-800">15</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Expired</span>
                <Badge className="bg-red-100 text-red-800">11</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Due This Month</span>
                <Badge className="bg-orange-100 text-orange-800">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Due Next Month</span>
                <Badge className="bg-blue-100 text-blue-800">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Recently Maintained</span>
                <Badge className="bg-green-100 text-green-800">45</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Asset Dialog */}
      <Dialog open={showAddAsset} onOpenChange={setShowAddAsset}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Asset Type</Label>
              <Select value={newAsset.type} onValueChange={(value) => setNewAsset({...newAsset, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="Printer">Printer</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input 
                id="model"
                value={newAsset.model}
                onChange={(e) => setNewAsset({...newAsset, model: e.target.value})}
                placeholder="e.g., MacBook Pro 16"
              />
            </div>
            <div>
              <Label htmlFor="user">Assigned User</Label>
              <Input 
                id="user"
                value={newAsset.user}
                onChange={(e) => setNewAsset({...newAsset, user: e.target.value})}
                placeholder="e.g., John Doe"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location"
                value={newAsset.location}
                onChange={(e) => setNewAsset({...newAsset, location: e.target.value})}
                placeholder="e.g., Office, Floor 2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input 
                  id="purchaseDate"
                  type="date"
                  value={newAsset.purchaseDate}
                  onChange={(e) => setNewAsset({...newAsset, purchaseDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                <Input 
                  id="warrantyExpiry"
                  type="date"
                  value={newAsset.warrantyExpiry}
                  onChange={(e) => setNewAsset({...newAsset, warrantyExpiry: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select value={newAsset.condition} onValueChange={(value) => setNewAsset({...newAsset, condition: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAsset(false)}>Cancel</Button>
            <Button onClick={handleAddAsset}>Add Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Asset History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset History - {selectedAsset?.id}</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{selectedAsset.model}</h4>
                <p className="text-sm text-muted-foreground">{selectedAsset.type} • {selectedAsset.user} • {selectedAsset.location}</p>
              </div>
              <div className="space-y-3">
                {selectedAsset.history.map((entry: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">By {entry.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{entry.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowHistory(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Asset Dialog */}
      <Dialog open={showManage} onOpenChange={setShowManage}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Asset - {selectedAsset?.id}</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="manageUser">Assigned User</Label>
                <Input 
                  id="manageUser"
                  value={selectedAsset.user}
                  onChange={(e) => setSelectedAsset({...selectedAsset, user: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="manageLocation">Location</Label>
                <Input 
                  id="manageLocation"
                  value={selectedAsset.location}
                  onChange={(e) => setSelectedAsset({...selectedAsset, location: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="manageStatus">Status</Label>
                <Select value={selectedAsset.status} onValueChange={(value) => setSelectedAsset({...selectedAsset, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="manageCondition">Condition</Label>
                <Select value={selectedAsset.condition} onValueChange={(value) => setSelectedAsset({...selectedAsset, condition: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManage(false)}>Cancel</Button>
            <Button onClick={() => handleUpdateAsset(selectedAsset)}>Update Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetManagement;
