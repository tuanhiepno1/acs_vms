import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
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
import { Search, Plus, Edit, Trash2, Shield, Clock, MapPin, Users, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface AccessRule {
  id: string;
  name: string;
  type: 'time' | 'location' | 'user' | 'device';
  description: string;
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
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
  const [rules, setRules] = useState<AccessRule[]>(mockRules);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AccessRule | null>(null);

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
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleDelete = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
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
        <Button onClick={() => setIsAddOpen(true)} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <Plus className="size-4" />
          Add Rule
        </Button>
      </div>

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
                  <TableHead className="text-center text-slate-300 font-semibold">Description</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Priority</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Status</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Created</TableHead>
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
                    <TableCell className="text-center text-slate-400 text-sm max-w-xs truncate">{rule.description}</TableCell>
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
                    <TableCell className="text-center text-slate-400 text-sm">{rule.createdAt}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRule(rule)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(rule.id)}
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

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-200">Rule Name</Label>
              <Input
                placeholder="Enter rule name"
                className="bg-slate-800 border-slate-700 text-white"
                defaultValue={editingRule?.name}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Rule Type</Label>
              <Select defaultValue={editingRule?.type || 'time'}>
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
                defaultValue={editingRule?.description}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Priority</Label>
              <Select defaultValue={editingRule?.priority || 'medium'}>
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
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddOpen(false);
                setEditingRule(null);
              }}
              className="border-slate-700 text-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsAddOpen(false);
                setEditingRule(null);
              }}
              className="bg-white text-slate-800 hover:bg-slate-100"
            >
              {editingRule ? 'Update Rule' : 'Add Rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
