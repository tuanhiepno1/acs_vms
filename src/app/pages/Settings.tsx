import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Mail,
  Clock,
  Database,
  Save,
} from 'lucide-react';

export function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [accessAlerts, setAccessAlerts] = useState(true);
  const [deviceAlerts, setDeviceAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div>
        <h1 className="text-white mb-0.5 text-xl font-bold">System Settings</h1>
        <p className="text-slate-400 text-sm">Manage configuration and system preferences</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">General</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">Security</TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Company Information</CardTitle>
              <CardDescription className="text-slate-400">Update basic company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName" className="text-slate-200">Company Name</Label>
                <Input id="companyName" defaultValue="Timpl" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address" className="text-slate-200">Address</Label>
                <Input id="address" defaultValue="4227 Pleasant Hill Rd Building 15, Duluth, GA 30096, United States" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-slate-200">Phone</Label>
                  <Input id="phone" defaultValue="+16782485833" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-200">Email</Label>
                  <Input id="email" type="email" defaultValue="info@company.com" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
              <Separator className="bg-slate-800" />
              <div className="grid gap-2">
                <Label htmlFor="timezone" className="text-slate-200">Timezone</Label>
                <Select defaultValue="america-new-york">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="america-new-york" className="text-white">New York (GMT-5)</SelectItem>
                    <SelectItem value="america-los-angeles" className="text-white">Los Angeles (GMT-8)</SelectItem>
                    <SelectItem value="america-chicago" className="text-white">Chicago (GMT-6)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language" className="text-slate-200">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="en" className="text-white">English</SelectItem>
                    <SelectItem value="es" className="text-white">Español</SelectItem>
                    <SelectItem value="fr" className="text-white">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
                  <Save className="size-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-blue-400" />
                <div>
                  <CardTitle className="text-white">Notification Settings</CardTitle>
                  <CardDescription className="text-slate-400">Manage notification preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="emailNotifications" className="text-slate-200">Email Notifications</Label>
                  <p className="text-slate-400">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator className="bg-slate-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="pushNotifications" className="text-slate-200">Push Notifications</Label>
                  <p className="text-slate-400">Receive push notifications on devices</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <Separator className="bg-slate-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="accessAlerts" className="text-slate-200">Access Alerts</Label>
                  <p className="text-slate-400">
                    Notify when access is denied
                  </p>
                </div>
                <Switch
                  id="accessAlerts"
                  checked={accessAlerts}
                  onCheckedChange={setAccessAlerts}
                />
              </div>
              <Separator className="bg-slate-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="deviceAlerts" className="text-slate-200">Device Alerts</Label>
                  <p className="text-slate-400">
                    Notify when device is offline or has errors
                  </p>
                </div>
                <Switch
                  id="deviceAlerts"
                  checked={deviceAlerts}
                  onCheckedChange={setDeviceAlerts}
                />
              </div>
              <div className="flex justify-end">
                <Button className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
                  <Save className="size-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-blue-400" />
                <div>
                  <CardTitle className="text-white">Security</CardTitle>
                  <CardDescription className="text-slate-400">Manage system security settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="twoFactorAuth" className="text-slate-200">Two-Factor Authentication</Label>
                  <p className="text-slate-400">
                    Add extra security layer with 2FA
                  </p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>
              <Separator className="bg-slate-800" />
              <div className="grid gap-2">
                <Label htmlFor="sessionTimeout" className="text-slate-200">Session Timeout</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="15" className="text-white">15 minutes</SelectItem>
                    <SelectItem value="30" className="text-white">30 minutes</SelectItem>
                    <SelectItem value="60" className="text-white">1 hour</SelectItem>
                    <SelectItem value="120" className="text-white">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="bg-slate-800" />
              <div className="grid gap-2">
                <Label htmlFor="passwordPolicy" className="text-slate-200">Password Policy</Label>
                <Select defaultValue="strong">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="basic" className="text-white">Basic</SelectItem>
                    <SelectItem value="medium" className="text-white">Medium</SelectItem>
                    <SelectItem value="strong" className="text-white">Strong</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
                  <Save className="size-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="size-5 text-blue-400" />
                <div>
                  <CardTitle className="text-white">System</CardTitle>
                  <CardDescription className="text-slate-400">Backup and maintenance settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="autoBackup" className="text-slate-200">Auto Backup</Label>
                  <p className="text-slate-400">
                    Automatically backup system data daily
                  </p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={autoBackup}
                  onCheckedChange={setAutoBackup}
                />
              </div>
              <Separator className="bg-slate-800" />
              <div className="grid gap-2">
                <Label htmlFor="backupTime" className="text-slate-200">Backup Time</Label>
                <Select defaultValue="02:00">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="00:00" className="text-white">12:00 AM</SelectItem>
                    <SelectItem value="02:00" className="text-white">2:00 AM</SelectItem>
                    <SelectItem value="04:00" className="text-white">4:00 AM</SelectItem>
                    <SelectItem value="06:00" className="text-white">6:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="bg-slate-800" />
              <div className="grid gap-2">
                <Label htmlFor="dataRetention" className="text-slate-200">Log Retention Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="30" className="text-white">30 days</SelectItem>
                    <SelectItem value="60" className="text-white">60 days</SelectItem>
                    <SelectItem value="90" className="text-white">90 days</SelectItem>
                    <SelectItem value="180" className="text-white">180 days</SelectItem>
                    <SelectItem value="365" className="text-white">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="bg-slate-800" />
              <div className="space-y-3">
                <Label className="text-slate-200">System Actions</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2 border-slate-700 text-slate-200">
                    <Database className="size-4" />
                    Backup Now
                  </Button>
                  <Button variant="outline" className="gap-2 border-slate-700 text-slate-200">
                    <Clock className="size-4" />
                    Restore
                  </Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
                  <Save className="size-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
