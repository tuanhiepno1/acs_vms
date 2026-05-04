import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { StatBar } from '../components/StatBar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Switch,
} from '../components/ui/switch';
import { Search, Plus, Edit, Trash2, Shield, Clock, MapPin, Users, AlertTriangle, CalendarClock, FolderOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocalStorage } from '../lib/use-local-storage';
import type { TimeSchedule } from '../types';

interface AccessRule {
  id: string;
  name: string;
  type: 'time' | 'location' | 'user' | 'device';
  description: string;
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  // Link to schedule
  scheduleId?: string;
  // Link to groups
  userGroupIds?: string[];
  deviceGroupIds?: string[];
}

interface Group {
  id: string;
  name: string;
  type: 'user' | 'device';
}

const mockRules: AccessRule[] = [
  {
    id: '1',
    name: 'Office Hours Access',
    type: 'time',
    description: 'Allow access only during business hours (8:00 AM - 6:00 PM)',
    enabled: true,
    priority: 'high',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Server Room Restriction',
    type: 'location',
    description: 'Only IT staff can access server room',
    enabled: true,
    priority: 'high',
    createdAt: '2024-01-16',
  },
  {
    id: '3',
    name: 'Weekend Access',
    type: 'time',
    description: 'No access on weekends except for emergency personnel',
    enabled: true,
    priority: 'medium',
    createdAt: '2024-01-17',
  },
  {
    id: '4',
    name: 'Guest Access Policy',
    type: 'user',
    description: 'Guests must be accompanied by authorized personnel',
    enabled: false,
    priority: 'medium',
    createdAt: '2024-01-18',
  },
  {
    id: '5',
    name: 'Device Maintenance Mode',
    type: 'device',
    description: 'Block access when device is in maintenance mode',
    enabled: true,
    priority: 'low',
    createdAt: '2024-01-19',
  },
];

export function Rules() {
  const [rules, setRules] = useLocalStorage<AccessRule[]>('acs_rules', mockRules);
  const [schedules] = useLocalStorage<TimeSchedule[]>('acs_schedules', []);
  const [groups] = useLocalStorage<Group[]>('acs_groups', []);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AccessRule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AccessRule | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'time' as AccessRule['type'],
    priority: 'medium' as AccessRule['priority'],
    scheduleId: '',
    userGroupIds: [] as string[],
    deviceGroupIds: [] as string[],
  });

  const resetForm = () => setForm({
    name: '',
    description: '',
    type: 'time',
    priority: 'medium',
    scheduleId: '',
    userGroupIds: [],
    deviceGroupIds: [],
  });

  const filtered = rules.filter((rule) => {
    const matchSearch = rule.name.toLowerCase().includes(search.toLowerCase()) ||
                      rule.description.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || rule.type === filterType;
    const matchStatus = filterStatus === 'all' ||
                      (filterStatus === 'enabled' && rule.enabled) ||
                      (filterStatus === 'disabled' && !rule.enabled);
    return matchSearch && matchType && matchStatus;
  });

  const handleToggle = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setRules(prev => prev.filter(r => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const openAdd = () => { resetForm(); setEditingRule(null); setIsAddOpen(true); };
  const openEdit = (rule: AccessRule) => {
    setForm({
      name: rule.name,
      description: rule.description,
      type: rule.type,
      priority: rule.priority,
      scheduleId: rule.scheduleId || '',
      userGroupIds: rule.userGroupIds || [],
      deviceGroupIds: rule.deviceGroupIds || [],
    });
    setEditingRule(rule);
  };

  const handleAdd = () => {
    if (!form.name) return;
    const newRule: AccessRule = {
      id: `RULE-${Date.now()}`,
      name: form.name,
      description: form.description,
      type: form.type,
      priority: form.priority,
      enabled: true,
      createdAt: new Date().toISOString().split('T')[0],
      ...(form.scheduleId ? { scheduleId: form.scheduleId } : {}),
      ...(form.userGroupIds.length > 0 ? { userGroupIds: form.userGroupIds } : {}),
      ...(form.deviceGroupIds.length > 0 ? { deviceGroupIds: form.deviceGroupIds } : {}),
    };
    setRules(prev => [newRule, ...prev]);
    setIsAddOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editingRule || !form.name) return;
    setRules(prev => prev.map(r =>
      r.id === editingRule.id ? {
        ...r,
        name: form.name,
        description: form.description,
        type: form.type,
        priority: form.priority,
        scheduleId: form.scheduleId || undefined,
        userGroupIds: form.userGroupIds,
        deviceGroupIds: form.deviceGroupIds,
      } : r
    ));
    setEditingRule(null);
    resetForm();
  };

  const getScheduleName = (id?: string) => {
    if (!id) return null;
    return schedules.find(s => s.id === id)?.name;
  };

  const getGroupNames = (ids?: string[]) => {
    if (!ids || ids.length === 0) return [];
    return ids.map(id => groups.find(g => g.id === id)?.name).filter(Boolean);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'time': return <Clock className="size-4" />;
      case 'location': return <MapPin className="size-4" />;
      case 'user': return <Users className="size-4" />;
      case 'device': return <Shield className="size-4" />;
      default: return <AlertTriangle className="size-4" />;
    }
  };

  const stats = {
    total: rules.length,
    enabled: rules.filter(r => r.enabled).length,
    high: rules.filter(r => r.priority === 'high').length,
    linkedToSchedule: rules.filter(r => r.scheduleId).length,
    linkedToGroups: rules.filter(r => (r.userGroupIds?.length || 0) + (r.deviceGroupIds?.length || 0) > 0).length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Rules & Policies</h1>
          <p className="text-slate-400 text-sm">Manage access control rules and policies</p>
        </div>
        <Button onClick={openAdd} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <Plus className="size-4" />
          Add Rule
        </Button>
      </div>

      <StatBar items={[
        { label: 'Total', value: stats.total },
        { label: 'Enabled', value: stats.enabled, color: 'green' },
        { label: 'High Priority', value: stats.high, color: 'red' },
        { label: 'With Schedule', value: stats.linkedToSchedule, color: 'blue' },
        { label: 'With Groups', value: stats.linkedToGroups, color: 'yellow' },
      ]} />

      <Card className="bg-slate-900 border-slate-800 flex-1 min-h-0">
        <CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <Input placeholder="Search rules..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-slate-800 border-slate-700 text-white" />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All Types</SelectItem>
                <SelectItem value="time" className="text-white">Time-based</SelectItem>
                <SelectItem value="location" className="text-white">Location-based</SelectItem>
                <SelectItem value="user" className="text-white">User-based</SelectItem>
                <SelectItem value="device" className="text-white">Device-based</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="enabled" className="text-white">Enabled</SelectItem>
                <SelectItem value="disabled" className="text-white">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-auto">
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow className="border-slate-800 bg-slate-800/40 hover:bg-slate-800/40">
                  <TableHead className="text-center text-slate-300 font-semibold">Rule Name</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Type</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Schedule</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Groups</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Priority</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Status</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((rule) => (
                  <TableRow key={rule.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-center text-white text-sm font-medium">{rule.name}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                        {getTypeIcon(rule.type)}
                        <span className="capitalize">{rule.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getScheduleName(rule.scheduleId) ? (
                        <Badge variant="outline" className="border-blue-600/50 bg-blue-600/15 text-blue-300 text-xs">
                          <CalendarClock className="size-3 mr-1" />
                          {getScheduleName(rule.scheduleId)}
                        </Badge>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {getGroupNames([...(rule.userGroupIds || []), ...(rule.deviceGroupIds || [])]).map((name, i) => (
                          <Badge key={i} variant="outline" className="border-green-600/50 bg-green-600/15 text-green-300 text-xs">
                            <FolderOpen className="size-3 mr-1" />{name}
                          </Badge>
                        ))}
                        {(rule.userGroupIds?.length || 0) + (rule.deviceGroupIds?.length || 0) === 0 && (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(getPriorityColor(rule.priority), 'text-white hover:opacity-80')}>
                        {rule.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggle(rule.id)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(rule)}
                          className="text-slate-400 hover:text-blue-400"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(rule)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Rule Dialog */}
      <Dialog open={isAddOpen || !!editingRule} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false);
          setEditingRule(null);
          resetForm();
        }
      }}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingRule ? 'Edit Rule' : 'Add New Rule'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingRule ? 'Update the access control rule' : 'Create a new access control rule'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label className="text-slate-200">Rule Name</Label>
              <Input
                placeholder="Enter rule name"
                className="bg-slate-800 border-slate-700 text-white"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Rule Type</Label>
              <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="time" className="text-white">Time-based</SelectItem>
                  <SelectItem value="location" className="text-white">Location-based</SelectItem>
                  <SelectItem value="user" className="text-white">User-based</SelectItem>
                  <SelectItem value="device" className="text-white">Device-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Description</Label>
              <Input
                placeholder="Enter rule description"
                className="bg-slate-800 border-slate-700 text-white"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Priority</Label>
              <Select value={form.priority} onValueChange={(v: any) => setForm({ ...form, priority: v })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="high" className="text-white">High</SelectItem>
                  <SelectItem value="medium" className="text-white">Medium</SelectItem>
                  <SelectItem value="low" className="text-white">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Schedule Selection */}
            <div className="grid gap-2">
              <Label className="text-slate-200 flex items-center gap-2">
                <CalendarClock className="size-4" />
                Time Schedule
              </Label>
              <Select value={form.scheduleId || '__none__'} onValueChange={(v) => setForm({ ...form, scheduleId: v === '__none__' ? '' : v })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select a schedule (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="__none__" className="text-white">No Schedule</SelectItem>
                  {schedules.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-white">{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* User Groups */}
            <div className="grid gap-2">
              <Label className="text-slate-200 flex items-center gap-2">
                <Users className="size-4" />
                User Groups
              </Label>
              <div className="flex flex-wrap gap-2 p-3 border border-slate-700 rounded-md bg-slate-800/50">
                {groups.filter(g => g.type === 'user').length === 0 ? (
                  <span className="text-slate-500 text-sm">No user groups available</span>
                ) : (
                  groups.filter(g => g.type === 'user').map(g => (
                    <label key={g.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded cursor-pointer hover:bg-slate-700">
                      <input
                        type="checkbox"
                        checked={form.userGroupIds.includes(g.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({ ...form, userGroupIds: [...form.userGroupIds, g.id] });
                          } else {
                            setForm({ ...form, userGroupIds: form.userGroupIds.filter(id => id !== g.id) });
                          }
                        }}
                        className="size-4 accent-blue-500"
                      />
                      <span className="text-slate-200 text-sm">{g.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Device Groups */}
            <div className="grid gap-2">
              <Label className="text-slate-200 flex items-center gap-2">
                <Shield className="size-4" />
                Device Groups
              </Label>
              <div className="flex flex-wrap gap-2 p-3 border border-slate-700 rounded-md bg-slate-800/50">
                {groups.filter(g => g.type === 'device').length === 0 ? (
                  <span className="text-slate-500 text-sm">No device groups available</span>
                ) : (
                  groups.filter(g => g.type === 'device').map(g => (
                    <label key={g.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded cursor-pointer hover:bg-slate-700">
                      <input
                        type="checkbox"
                        checked={form.deviceGroupIds.includes(g.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({ ...form, deviceGroupIds: [...form.deviceGroupIds, g.id] });
                          } else {
                            setForm({ ...form, deviceGroupIds: form.deviceGroupIds.filter(id => id !== g.id) });
                          }
                        }}
                        className="size-4 accent-blue-500"
                      />
                      <span className="text-slate-200 text-sm">{g.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddOpen(false);
                setEditingRule(null);
                resetForm();
              }}
              className="bg-slate-700 text-white hover:bg-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={editingRule ? handleEdit : handleAdd}
              disabled={!form.name}
              className="bg-white text-slate-800 hover:bg-slate-100"
            >
              {editingRule ? 'Update Rule' : 'Add Rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Rule</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete <span className="text-white font-medium">{deleteTarget?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} className="bg-slate-700 text-white hover:bg-slate-600">Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
