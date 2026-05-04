import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  Scale,
  Activity,
  ClipboardList,
  Plus,
  Play,
  Pause,
  Settings,
} from 'lucide-react';
import { cn } from '../lib/utils';

// Event Rule Tab Component
function EventRuleTab() {
  const [rules] = useState([
    { id: '1', name: 'After Hours Access Alert', type: 'alert', status: 'active', description: 'Send alert when access is granted after business hours' },
    { id: '2', name: 'Failed Auth Limit', type: 'security', status: 'active', description: 'Trigger alert after 3 failed authentication attempts' },
    { id: '3', name: 'Emergency Unlock', type: 'emergency', status: 'inactive', description: 'Automatically unlock all doors in emergency' },
    { id: '4', name: 'Visitor Expiry', type: 'schedule', status: 'active', description: 'Auto-expire visitor access after 24 hours' },
  ]);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Event Rules</CardTitle>
            <p className="text-slate-400 text-sm mt-1">Configure automated event triggers and conditions</p>
          </div>
          <Button className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
            <Plus className="size-4" />
            Add Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'size-10 rounded-lg flex items-center justify-center',
                  rule.type === 'alert' && 'bg-yellow-600/20',
                  rule.type === 'security' && 'bg-red-600/20',
                  rule.type === 'emergency' && 'bg-orange-600/20',
                  rule.type === 'schedule' && 'bg-blue-600/20'
                )}>
                  <Scale className={cn(
                    'size-5',
                    rule.type === 'alert' && 'text-yellow-500',
                    rule.type === 'security' && 'text-red-500',
                    rule.type === 'emergency' && 'text-orange-500',
                    rule.type === 'schedule' && 'text-blue-500'
                  )} />
                </div>
                <div>
                  <h4 className="text-white font-medium">{rule.name}</h4>
                  <p className="text-slate-400 text-sm">{rule.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={cn(
                  rule.status === 'active' ? 'border-green-600 bg-green-600/20 text-green-400' : 'border-slate-600 bg-slate-600/20 text-slate-400'
                )}>
                  {rule.status === 'active' ? 'Active' : 'Inactive'}
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

// Event Action Tab Component
function EventActionTab() {
  const [actions] = useState([
    { id: '1', name: 'Send Email Alert', type: 'notification', status: 'active', description: 'Send email to administrators when event triggered' },
    { id: '2', name: 'Unlock Door', type: 'door', status: 'active', description: 'Automatically unlock specified door' },
    { id: '3', name: 'Log to Database', type: 'logging', status: 'active', description: 'Record event to audit database' },
    { id: '4', name: 'Trigger Alarm', type: 'alarm', status: 'inactive', description: 'Activate security alarm' },
  ]);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Event Actions</CardTitle>
            <p className="text-slate-400 text-sm mt-1">Configure actions to execute when events are triggered</p>
          </div>
          <Button className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
            <Plus className="size-4" />
            Add Action
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'size-10 rounded-lg flex items-center justify-center',
                  action.type === 'notification' && 'bg-blue-600/20',
                  action.type === 'door' && 'bg-green-600/20',
                  action.type === 'logging' && 'bg-purple-600/20',
                  action.type === 'alarm' && 'bg-red-600/20'
                )}>
                  <Activity className={cn(
                    'size-5',
                    action.type === 'notification' && 'text-blue-500',
                    action.type === 'door' && 'text-green-500',
                    action.type === 'logging' && 'text-purple-500',
                    action.type === 'alarm' && 'text-red-500'
                  )} />
                </div>
                <div>
                  <h4 className="text-white font-medium">{action.name}</h4>
                  <p className="text-slate-400 text-sm">{action.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={cn(
                  action.status === 'active' ? 'border-green-600 bg-green-600/20 text-green-400' : 'border-slate-600 bg-slate-600/20 text-slate-400'
                )}>
                  {action.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  {action.status === 'active' ? <Pause className="size-4" /> : <Play className="size-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Event Action Log Tab Component
function EventActionLogTab() {
  const [logs] = useState([
    { id: '1', rule: 'After Hours Access Alert', action: 'Send Email Alert', timestamp: '2024-01-20 14:30:00', status: 'success', details: 'Alert sent to admin@company.com' },
    { id: '2', rule: 'Failed Auth Limit', action: 'Trigger Alarm', timestamp: '2024-01-20 12:15:00', status: 'success', details: 'Alarm activated for 30 seconds' },
    { id: '3', rule: 'Visitor Expiry', action: 'Log to Database', timestamp: '2024-01-20 10:00:00', status: 'success', details: 'Expired 5 visitor records' },
    { id: '4', rule: 'Emergency Unlock', action: 'Unlock Door', timestamp: '2024-01-19 18:45:00', status: 'failed', details: 'Device offline - action failed' },
  ]);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Event Action Log</CardTitle>
            <p className="text-slate-400 text-sm mt-1">History of triggered event actions</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-4">
                <ClipboardList className="size-5 text-slate-400" />
                <div>
                  <h4 className="text-white text-sm font-medium">{log.rule}</h4>
                  <p className="text-slate-400 text-xs">{log.timestamp} • {log.action}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className={cn(
                  log.status === 'success' ? 'border-green-600 bg-green-600/20 text-green-400' : 'border-red-600 bg-red-600/20 text-red-400'
                )}>
                  {log.status === 'success' ? 'Success' : 'Failed'}
                </Badge>
                <p className="text-slate-500 text-xs mt-1">{log.details}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main Events Component
export function Events() {
  const [activeTab, setActiveTab] = useState('rules');

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Event Management</h1>
          <p className="text-slate-400 text-sm">Configure event rules, actions, and view execution logs</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col">
        <TabsList className="bg-slate-800 border border-slate-700 w-fit">
          <TabsTrigger value="rules" className="data-[state=active]:bg-slate-700 text-slate-300">Event Rule</TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-slate-700 text-slate-300">Event Action</TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-slate-700 text-slate-300">Event Action Log</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="flex-1 min-h-0 mt-3 overflow-y-auto">
          <EventRuleTab />
        </TabsContent>

        <TabsContent value="actions" className="flex-1 min-h-0 mt-3 overflow-y-auto">
          <EventActionTab />
        </TabsContent>

        <TabsContent value="logs" className="flex-1 min-h-0 mt-3 overflow-y-auto">
          <EventActionLogTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
