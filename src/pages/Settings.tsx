import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Save, Check, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const { profile, updateProfile } = useUserProfile();
  const { theme, setTheme } = useTheme();
  const [localProfile, setLocalProfile] = useState(profile);
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    ticketUpdates: true,
    trainingReminders: true,
    systemAlerts: false,
    marketingEmails: false,
    frequency: 'immediate'
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginNotifications: true,
    deviceManagement: true
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: theme,
    fontSize: 'medium',
    compactMode: false,
    showAnimations: true,
    language: 'en'
  });

  const handleSave = async (section: string) => {
    setLoading(true);
    setError('');
    setSaved(false);

    try {
      if (section === 'profile') {
        const response = await fetch('http://localhost:8080/api/update-bio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: localProfile.email,
            bio: localProfile.bio,
          })
        });

        if (!response.ok) throw new Error('Failed to update bio');

        // Update profile in context and localStorage
        updateProfile({ ...localProfile, bio: localProfile.bio });
        localStorage.setItem('userProfile', JSON.stringify({ ...localProfile, bio: localProfile.bio }));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setLocalProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean | string) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: boolean | string) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };

  const handleAppearanceChange = (field: string, value: string | boolean) => {
    setAppearance(prev => ({ ...prev, [field]: value }));
    
    // Apply theme change immediately
    if (field === 'theme') {
      setTheme(value as 'light' | 'dark');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-500/30 rounded-lg dark:bg-green-500/30 dark:border-green-500/40">
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-green-800 dark:text-green-200">Settings saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-lg dark:bg-red-500/30 dark:border-red-500/40">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <span className="text-red-800 dark:text-red-200">{error}</span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={localProfile.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    disabled={localProfile.role !== "IT Support"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={localProfile.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    disabled={localProfile.role !== "IT Support"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={localProfile.email}
                  disabled={localProfile.role !== "IT Support"}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={localProfile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  disabled={localProfile.role !== "IT Support"}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={localProfile.department} onValueChange={(value) => handleProfileChange('department', value)} disabled={localProfile.role !== "IT Support"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={localProfile.role} onValueChange={(value) => handleProfileChange('role', value)} disabled={localProfile.role !== "IT Support"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Employee">Employee</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="HRManager">HR Manager</SelectItem>
                      <SelectItem value="ITSupport">IT Support</SelectItem>
                    </SelectContent>
                  </Select>
                  
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={localProfile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  rows={3}
                />
              </div>
              <Button 
                onClick={() => handleSave('profile')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Ticket Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about ticket status changes</p>
                  </div>
                  <Switch
                    checked={notifications.ticketUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('ticketUpdates', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Training Reminders</Label>
                    <p className="text-sm text-muted-foreground">Reminders for upcoming training sessions</p>
                  </div>
                  <Switch
                    checked={notifications.trainingReminders}
                    onCheckedChange={(checked) => handleNotificationChange('trainingReminders', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>System Alerts</Label>
                    <p className="text-sm text-muted-foreground">Important system maintenance and security alerts</p>
                  </div>
                  <Switch
                    checked={notifications.systemAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('systemAlerts', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional and marketing emails</p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notification Frequency</Label>
                <Select value={notifications.frequency} onValueChange={(value) => handleNotificationChange('frequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => handleSave('notifications')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={security.loginNotifications}
                    onCheckedChange={(checked) => handleSecurityChange('loginNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Device Management</Label>
                    <p className="text-sm text-muted-foreground">Manage active sessions and devices</p>
                  </div>
                  <Switch
                    checked={security.deviceManagement}
                    onCheckedChange={(checked) => handleSecurityChange('deviceManagement', checked)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select value={security.sessionTimeout} onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Password Expiry (days)</Label>
                  <Select value={security.passwordExpiry} onValueChange={(value) => handleSecurityChange('passwordExpiry', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={() => handleSave('security')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Saving...' : 'Save Security Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-500">Theme (Disabled)</Label>
                      <p className="text-sm text-muted-foreground">Dark mode is temporarily disabled</p>
                    </div>
                    <Switch
                      checked={false}
                      disabled={true}
                      onCheckedChange={() => {}} // Do nothing
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select value={appearance.fontSize} onValueChange={(value) => handleAppearanceChange('fontSize', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce spacing for a more compact layout</p>
                  </div>
                  <Switch
                    checked={appearance.compactMode}
                    onCheckedChange={(checked) => handleAppearanceChange('compactMode', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
                  </div>
                  <Switch
                    checked={appearance.showAnimations}
                    onCheckedChange={(checked) => handleAppearanceChange('showAnimations', checked)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={appearance.language} onValueChange={(value) => handleAppearanceChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => handleSave('appearance')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Saving...' : 'Save Appearance Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;