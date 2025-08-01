import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Bell,
  Users,
  CheckCircle
} from 'lucide-react';

interface SLARule {
  id: string;
  name: string;
  category: string;
  priority: string;
  responseTime: number; // in hours
  resolutionTime: number; // in hours
  escalationLevels: EscalationLevel[];
  enabled: boolean;
  description: string;
}

interface EscalationLevel {
  level: number;
  timeThreshold: number; // hours after creation
  action: string;
  recipients: string[];
  notificationType: 'email' | 'sms' | 'in-app';
}

const SLAConfiguration = () => {
  const [slaRules, setSlaRules] = useState<SLARule[]>([
    {
      id: '1',
      name: 'Critical Hardware Issues',
      category: 'Hardware',
      priority: 'high',
      responseTime: 1,
      resolutionTime: 4,
      escalationLevels: [
        {
          level: 1,
          timeThreshold: 2,
          action: 'Notify Team Lead',
          recipients: ['team-lead@company.com'],
          notificationType: 'email'
        },
        {
          level: 2,
          timeThreshold: 3,
          action: 'Escalate to Manager',
          recipients: ['manager@company.com'],
          notificationType: 'email'
        }
      ],
      enabled: true,
      description: 'SLA for critical hardware failures requiring immediate attention'
    },
    {
      id: '2',
      name: 'Network Connectivity',
      category: 'Network',
      priority: 'medium',
      responseTime: 2,
      resolutionTime: 8,
      escalationLevels: [
        {
          level: 1,
          timeThreshold: 4,
          action: 'Notify Network Team',
          recipients: ['network-team@company.com'],
          notificationType: 'in-app'
        }
      ],
      enabled: true,
      description: 'SLA for network connectivity issues'
    },
    {
      id: '3',
      name: 'Software Support',
      category: 'Software',
      priority: 'low',
      responseTime: 4,
      resolutionTime: 24,
      escalationLevels: [
        {
          level: 1,
          timeThreshold: 12,
          action: 'Notify Support Team',
          recipients: ['support@company.com'],
          notificationType: 'email'
        }
      ],
      enabled: true,
      description: 'SLA for general software support requests'
    }
  ]);

  const [editingRule, setEditingRule] = useState<SLARule | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<SLARule>>({
    name: '',
    category: '',
    priority: 'medium',
    responseTime: 4,
    resolutionTime: 24,
    escalationLevels: [],
    enabled: true,
    description: ''
  });

  const categories = ['Hardware', 'Network', 'Software', 'Email', 'Security', 'General'];
  const priorities = ['low', 'medium', 'high', 'critical'];

  const handleEditRule = (rule: SLARule) => {
    setEditingRule(rule);
    setIsEditModalOpen(true);
  };

  const handleSaveRule = (rule: SLARule) => {
    setSlaRules(prev => prev.map(r => r.id === rule.id ? rule : r));
    setIsEditModalOpen(false);
    setEditingRule(null);
  };

  const handleCreateRule = () => {
    if (newRule.name && newRule.category) {
      const rule: SLARule = {
        id: Date.now().toString(),
        name: newRule.name,
        category: newRule.category,
        priority: newRule.priority || 'medium',
        responseTime: newRule.responseTime || 4,
        resolutionTime: newRule.resolutionTime || 24,
        escalationLevels: newRule.escalationLevels || [],
        enabled: newRule.enabled || true,
        description: newRule.description || ''
      };
      setSlaRules(prev => [...prev, rule]);
      setIsCreateModalOpen(false);
      setNewRule({
        name: '',
        category: '',
        priority: 'medium',
        responseTime: 4,
        resolutionTime: 24,
        escalationLevels: [],
        enabled: true,
        description: ''
      });
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    setSlaRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const handleToggleRule = (ruleId: string) => {
    setSlaRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Hardware': return <Settings className="w-4 h-4" />;
      case 'Network': return <TrendingUp className="w-4 h-4" />;
      case 'Software': return <CheckCircle className="w-4 h-4" />;
      case 'Email': return <Bell className="w-4 h-4" />;
      case 'Security': return <AlertTriangle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">SLA Configuration</h2>
          <p className="text-muted-foreground">Manage service level agreement rules and escalation policies</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New SLA Rule
        </Button>
      </div>

      {/* SLA Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {slaRules.map((rule) => (
          <Card key={rule.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(rule.category)}
                  <div>
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{rule.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(rule.priority)}>
                    {rule.priority}
                  </Badge>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => handleToggleRule(rule.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{rule.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Response Time</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{rule.responseTime}h</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Resolution Time</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">{rule.resolutionTime}h</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Escalation Levels ({rule.escalationLevels.length})</h4>
                  {rule.escalationLevels.map((level, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Level {level.level}</Badge>
                        <span className="text-sm">{level.action}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{level.timeThreshold}h</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2 pt-2 border-t">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditRule(rule)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Rule Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create New SLA Rule</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input 
                  id="rule-name"
                  placeholder="Enter rule name"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="rule-category">Category</Label>
                <Select value={newRule.category} onValueChange={(value) => setNewRule(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rule-priority">Priority</Label>
                <Select value={newRule.priority} onValueChange={(value) => setNewRule(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="response-time">Response Time (hours)</Label>
                <Input 
                  id="response-time"
                  type="number"
                  min="1"
                  value={newRule.responseTime}
                  onChange={(e) => setNewRule(prev => ({ ...prev, responseTime: parseInt(e.target.value) || 4 }))}
                />
              </div>
              <div>
                <Label htmlFor="resolution-time">Resolution Time (hours)</Label>
                <Input 
                  id="resolution-time"
                  type="number"
                  min="1"
                  value={newRule.resolutionTime}
                  onChange={(e) => setNewRule(prev => ({ ...prev, resolutionTime: parseInt(e.target.value) || 24 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="rule-description">Description</Label>
              <Textarea 
                id="rule-description"
                rows={3}
                placeholder="Describe this SLA rule..."
                value={newRule.description}
                onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateRule}
                disabled={!newRule.name || !newRule.category}
              >
                <Save className="w-4 h-4 mr-2" />
                Create Rule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Modal */}
      {editingRule && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="w-5 h-5" />
                <span>Edit SLA Rule</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-rule-name">Rule Name</Label>
                  <Input 
                    id="edit-rule-name"
                    value={editingRule.name}
                    onChange={(e) => setEditingRule(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-rule-category">Category</Label>
                  <Select value={editingRule.category} onValueChange={(value) => setEditingRule(prev => prev ? { ...prev, category: value } : null)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-rule-priority">Priority</Label>
                  <Select value={editingRule.priority} onValueChange={(value) => setEditingRule(prev => prev ? { ...prev, priority: value } : null)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-response-time">Response Time (hours)</Label>
                  <Input 
                    id="edit-response-time"
                    type="number"
                    min="1"
                    value={editingRule.responseTime}
                    onChange={(e) => setEditingRule(prev => prev ? { ...prev, responseTime: parseInt(e.target.value) || 4 } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-resolution-time">Resolution Time (hours)</Label>
                  <Input 
                    id="edit-resolution-time"
                    type="number"
                    min="1"
                    value={editingRule.resolutionTime}
                    onChange={(e) => setEditingRule(prev => prev ? { ...prev, resolutionTime: parseInt(e.target.value) || 24 } : null)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-rule-description">Description</Label>
                <Textarea 
                  id="edit-rule-description"
                  rows={3}
                  value={editingRule.description}
                  onChange={(e) => setEditingRule(prev => prev ? { ...prev, description: e.target.value } : null)}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => editingRule && handleSaveRule(editingRule)}
                  disabled={!editingRule.name || !editingRule.category}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SLAConfiguration; 