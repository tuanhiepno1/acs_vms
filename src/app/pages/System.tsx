import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  ScrollText,
  Settings,
  UserCog,
  Globe,
  Plus,
  Search,
  Shield,
  Clock,
  User,
  Mail,
} from 'lucide-react';
import { cn } from '../lib/utils';

// Audit Log Tab Component
function AuditLogTab() {
  const [search, setSearch] = useState('');
  const [logs] = useState([
    { id: '1', user: 'admin', action: 'User created', target: 'john.doe', timestamp: '2024-01-20 14:30:00', ip: '192.168.1.100' },
    { id: '2', user: 'admin', action: 'Device updated', target: 'Main Entrance', timestamp: '2024-01-20 13:15:00', ip: '192.168.1.100' },
    { id: '3', user: 'operator', action: 'Rule modified', target: 'After Hours Access', timestamp: '2024-01-20 11:45:00', ip: '192.168.1.102' },
    { id: '4', user: 'admin', action: 'Group deleted', target: 'Temp Group', timestamp: '2024-01-20 10:20:00', ip: '192.168.1.100' },
    { id: '5', user: 'system', action: 'Backup completed', target: 'Daily Backup', timestamp: '2024-01-20 02:00:00', ip: '-' },
  ]);

  const filtered = logs.filter(l => 
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <CardTitle className="text-white">Audit Log</CardTitle>
            <p className="text-slate-400 text-sm mt-1">System activity and change history</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <Input 
              placeholder="Search logs..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10 bg-slate-800 border-slate-700 text-white" 
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filtered.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-4">
                <ScrollText className="size-5 text-slate-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{log.action}</span>
                    <span className="text-slate-500 text-xs">on</span>
                    <span className="text-slate-300 text-sm">{log.target}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{log.timestamp} • {log.ip}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                {log.user}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Settings Tab Component
function SettingsTab() {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div>
          <CardTitle className="text-white">System Settings</CardTitle>
          <p className="text-slate-400 text-sm mt-1">Configure system-wide settings</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <h4 className="text-white font-medium mb-2">General Settings</h4>
            <p className="text-slate-400 text-sm">System name, timezone, and language preferences</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <h4 className="text-white font-medium mb-2">Security Settings</h4>
            <p className="text-slate-400 text-sm">Password policies, session timeout, and 2FA</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <h4 className="text-white font-medium mb-2">Notification Settings</h4>
            <p className="text-slate-400 text-sm">Email and SMS notification preferences</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Account List Tab Component
function AccountListTab() {
  const [accounts] = useState([
    { id: '1', username: 'admin', name: 'System Administrator', email: 'admin@company.com', role: 'Super Admin', status: 'active', lastLogin: '2024-01-20 14:30' },
    { id: '2', username: 'operator1', name: 'John Smith', email: 'john@company.com', role: 'Operator', status: 'active', lastLogin: '2024-01-20 10:15' },
    { id: '3', username: 'operator2', name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Operator', status: 'active', lastLogin: '2024-01-19 16:45' },
    { id: '4', username: 'viewer1', name: 'Mike Johnson', email: 'mike@company.com', role: 'Viewer', status: 'inactive', lastLogin: '2024-01-15 09:20' },
  ]);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Account List</CardTitle>
            <p className="text-slate-400 text-sm mt-1">Manage system user accounts</p>
          </div>
          <Button className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
            <Plus className="size-4" />
            Add Account
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="size-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{account.name}</h4>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span>@{account.username}</span>
                    <span>•</span>
                    <Mail className="size-3" />
                    <span>{account.email}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className={cn(
                  account.status === 'active' ? 'border-green-600 bg-green-600/20 text-green-400' : 'border-slate-600 bg-slate-600/20 text-slate-400'
                )}>
                  {account.role}
                </Badge>
                <p className="text-slate-500 text-xs mt-1">
                  <Clock className="size-3 inline mr-1" />
                  {account.lastLogin}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Remote Management Tab Component
function RemoteManagementTab() {
  const [devices] = useState([
    { id: '1', name: 'Main Entrance', location: 'HQ Building', status: 'online', lastSeen: '2 min ago' },
    { id: '2', name: 'Back Door', location: 'HQ Building', status: 'online', lastSeen: '5 min ago' },
    { id: '3', name: 'Server Room', location: 'Data Center', status: 'offline', lastSeen: '2 hours ago' },
  ]);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div>
          <CardTitle className="text-white">Remote Management</CardTitle>
          <p className="text-slate-400 text-sm mt-1">Remote device management and control</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-4">
                <Globe className="size-5 text-slate-400" />
                <div>
                  <h4 className="text-white font-medium">{device.name}</h4>
                  <p className="text-slate-400 text-sm">{device.location} • Last seen {device.lastSeen}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn(
                  device.status === 'online' ? 'border-green-600 bg-green-600/20 text-green-400' : 'border-red-600 bg-red-600/20 text-red-400'
                )}>
                  {device.status}
                </Badge>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Settings className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main System Component
export function System() {
  const [activeTab, setActiveTab] = useState('audit');

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">System Management</h1>
          <p className="text-slate-400 text-sm">Audit logs, settings, accounts, and remote device management</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col">
        <TabsList className="bg-slate-800 border border-slate-700 w-fit">
          <TabsTrigger value="audit" className="data-[state=active]:bg-slate-700 text-slate-300">Audit Log</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700 text-slate-300">Settings</TabsTrigger>
          <TabsTrigger value="accounts" className="data-[state=active]:bg-slate-700 text-slate-300">Account List</TabsTrigger>
          <TabsTrigger value="remote" className="data-[state=active]:bg-slate-700 text-slate-300">Remote Management</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="flex-1 min-h-0 mt-3 overflow-y-auto">
          <AuditLogTab />
        </TabsContent>

        <TabsContent value="settings" className="flex-1 min-h-0 mt-3 overflow-y-auto">
          <SettingsTab />
        </TabsContent>

        <TabsContent value="accounts" className="flex-1 min-h-0 mt-3 overflow-y-auto">
          <AccountListTab />
        </TabsContent>

        <TabsContent value="remote" className="flex-1 min-h-0 mt-3 overflow-y-auto">
          <RemoteManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
