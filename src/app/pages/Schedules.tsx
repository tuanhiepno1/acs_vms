import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { StatBar } from '../components/StatBar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
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
  Search,
  Plus,
  Edit,
  Trash2,
  Clock,
  Calendar,
  Sun,
  Moon,
  CalendarDays,
  Check,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocalStorage } from '../lib/use-local-storage';
import type { TimeSchedule } from '../types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const defaultTimeRanges = Array.from({ length: 7 }, (_, i) => ({
  day: i,
  startTime: '08:00',
  endTime: '18:00',
  enabled: i !== 0 && i !== 6, // Mon-Fri enabled, Sat-Sun disabled
}));

const mockSchedules: TimeSchedule[] = [
  {
    id: 'SCH-001',
    name: 'Business Hours',
    description: 'Standard 9-5 business hours Monday-Friday',
    type: 'weekly',
    enabled: true,
    timeRanges: defaultTimeRanges,
    createdAt: '2024-01-15',
  },
  {
    id: 'SCH-002',
    name: 'Extended Hours',
    description: '7 AM - 7 PM Monday-Saturday',
    type: 'weekly',
    enabled: true,
    timeRanges: [
      { day: 0, startTime: '00:00', endTime: '00:00', enabled: false },
      { day: 1, startTime: '07:00', endTime: '19:00', enabled: true },
      { day: 2, startTime: '07:00', endTime: '19:00', enabled: true },
      { day: 3, startTime: '07:00', endTime: '19:00', enabled: true },
      { day: 4, startTime: '07:00', endTime: '19:00', enabled: true },
      { day: 5, startTime: '07:00', endTime: '19:00', enabled: true },
      { day: 6, startTime: '07:00', endTime: '19:00', enabled: true },
    ],
    createdAt: '2024-01-16',
  },
  {
    id: 'SCH-003',
    name: '24/7 Access',
    description: 'Full access all days and times',
    type: 'weekly',
    enabled: true,
    timeRanges: Array.from({ length: 7 }, (_, i) => ({
      day: i,
      startTime: '00:00',
      endTime: '23:59',
      enabled: true,
    })),
    createdAt: '2024-01-17',
  },
  {
    id: 'SCH-004',
    name: 'Holiday 2024',
    description: 'Special holiday schedule - no access',
    type: 'holiday',
    enabled: false,
    timeRanges: [],
    holidayDates: ['2024-12-25', '2024-12-26', '2024-01-01'],
    createdAt: '2024-01-18',
  },
];

export function Schedules() {
  const [schedules, setSchedules] = useLocalStorage<TimeSchedule[]>('acs_schedules', mockSchedules);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TimeSchedule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TimeSchedule | null>(null);

  const [form, setForm] = useState<{
    name: string;
    description: string;
    type: 'daily' | 'weekly' | 'holiday';
    timeRanges: typeof defaultTimeRanges;
    holidayDates: string;
  }>({
    name: '',
    description: '',
    type: 'weekly',
    timeRanges: defaultTimeRanges,
    holidayDates: '',
  });

  const resetForm = () => setForm({
    name: '',
    description: '',
    type: 'weekly',
    timeRanges: defaultTimeRanges,
    holidayDates: '',
  });

  const openAdd = () => { resetForm(); setEditingSchedule(null); setIsAddOpen(true); };
  const openEdit = (s: TimeSchedule) => {
    setForm({
      name: s.name,
      description: s.description || '',
      type: s.type,
      timeRanges: s.timeRanges.length > 0 ? s.timeRanges : defaultTimeRanges,
      holidayDates: s.holidayDates?.join('\n') || '',
    });
    setEditingSchedule(s);
  };

  const filtered = schedules.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                       s.description?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || s.type === filterType;
    const matchStatus = filterStatus === 'all' ||
                       (filterStatus === 'enabled' && s.enabled) ||
                       (filterStatus === 'disabled' && !s.enabled);
    return matchSearch && matchType && matchStatus;
  });

  const stats = {
    total: schedules.length,
    enabled: schedules.filter(s => s.enabled).length,
    weekly: schedules.filter(s => s.type === 'weekly').length,
    holiday: schedules.filter(s => s.type === 'holiday').length,
  };

  const handleAdd = () => {
    if (!form.name) return;
    const newSchedule: TimeSchedule = {
      id: `SCH-${Date.now()}`,
      name: form.name,
      description: form.description,
      type: form.type,
      enabled: true,
      timeRanges: form.type === 'holiday' ? [] : form.timeRanges,
      holidayDates: form.type === 'holiday' ? form.holidayDates.split('\n').filter(d => d.trim()) : undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSchedules(prev => [newSchedule, ...prev]);
    setIsAddOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editingSchedule || !form.name) return;
    setSchedules(prev => prev.map(s =>
      s.id === editingSchedule.id ? {
        ...s,
        name: form.name,
        description: form.description,
        type: form.type,
        timeRanges: form.type === 'holiday' ? [] : form.timeRanges,
        holidayDates: form.type === 'holiday' ? form.holidayDates.split('\n').filter(d => d.trim()) : undefined,
      } : s
    ));
    setEditingSchedule(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setSchedules(prev => prev.filter(s => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Clock className="size-4" />;
      case 'weekly': return <CalendarDays className="size-4" />;
      case 'holiday': return <Calendar className="size-4" />;
      default: return <Clock className="size-4" />;
    }
  };

  const formatTimeRanges = (ranges: TimeSchedule['timeRanges']) => {
    if (ranges.length === 0) return 'No time restrictions';
    const enabled = ranges.filter(r => r.enabled);
    if (enabled.length === 0) return 'No active days';
    if (enabled.length === 7 && enabled.every(r => r.startTime === '00:00' && r.endTime === '23:59')) {
      return '24/7 All days';
    }
    const days = enabled.map(r => DAYS[r.day].slice(0, 3));
    const time = enabled[2]?.startTime || '08:00';
    return `${days.join(', ')} (${enabled[0]?.startTime}-${enabled[0]?.endTime})`;
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Time Schedules</h1>
          <p className="text-slate-400 text-sm">Manage access time schedules for rules and policies</p>
        </div>
        <Button onClick={openAdd} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <Plus className="size-4" />
          Add Schedule
        </Button>
      </div>

      <StatBar items={[
        { label: 'Total', value: stats.total },
        { label: 'Enabled', value: stats.enabled, color: 'green' },
        { label: 'Weekly', value: stats.weekly, color: 'blue' },
        { label: 'Holiday', value: stats.holiday, color: 'yellow' },
      ]} />

      {/* Main Table */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-white">Schedule List</CardTitle>
                <CardDescription className="text-slate-400">Showing {filtered.length} schedules</CardDescription>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <Input placeholder="Search schedules..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-slate-800 border-slate-700 text-white" />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Types</SelectItem>
                  <SelectItem value="daily" className="text-white">Daily</SelectItem>
                  <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                  <SelectItem value="holiday" className="text-white">Holiday</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Status</SelectItem>
                  <SelectItem value="enabled" className="text-white">Enabled</SelectItem>
                  <SelectItem value="disabled" className="text-white">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 bg-slate-800/40 hover:bg-slate-800/40">
                    <TableHead className="text-slate-300 font-semibold">Name</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Type</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Schedule</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Description</TableHead>
                    <TableHead className="text-center text-slate-300 font-semibold">Status</TableHead>
                    <TableHead className="text-center text-slate-300 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((schedule) => (
                    <TableRow key={schedule.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-white">{schedule.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "p-1.5 rounded",
                            schedule.type === 'daily' && "bg-blue-600/20 text-blue-400",
                            schedule.type === 'weekly' && "bg-green-600/20 text-green-400",
                            schedule.type === 'holiday' && "bg-yellow-600/20 text-yellow-400",
                          )}>
                            {getTypeIcon(schedule.type)}
                          </span>
                          <span className="text-slate-300 capitalize">{schedule.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm max-w-[200px] truncate">
                        {schedule.type === 'holiday' && schedule.holidayDates
                          ? `${schedule.holidayDates.length} dates`
                          : formatTimeRanges(schedule.timeRanges)
                        }
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm max-w-[250px] truncate">
                        {schedule.description || '—'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={schedule.enabled}
                          onCheckedChange={() => toggleSchedule(schedule.id)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-400 hover:bg-slate-800" onClick={() => openEdit(schedule)}>
                            <Edit className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400 hover:bg-slate-800" onClick={() => setDeleteTarget(schedule)}>
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
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddOpen || !!editingSchedule} onOpenChange={(open) => {
        if (!open) { setIsAddOpen(false); setEditingSchedule(null); resetForm(); }
      }}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{editingSchedule ? 'Edit Schedule' : 'Add Time Schedule'}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingSchedule ? 'Update time schedule settings' : 'Create a new access time schedule'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-200">Schedule Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Business Hours" className="bg-slate-800 border-slate-700 text-white" />
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-200">Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" className="bg-slate-800 border-slate-700 text-white" />
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-200">Schedule Type</Label>
              <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="weekly" className="text-white">Weekly (Mon-Sun)</SelectItem>
                  <SelectItem value="daily" className="text-white">Daily (Same every day)</SelectItem>
                  <SelectItem value="holiday" className="text-white">Holiday (Specific dates)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.type !== 'holiday' ? (
              <div className="grid gap-3">
                <Label className="text-slate-200">Time Ranges</Label>
                <div className="border border-slate-700 rounded-lg p-4 bg-slate-800/50">
                  <div className="grid gap-3">
                    {form.timeRanges.map((range, idx) => (
                      <div key={range.day} className="flex items-center gap-3">
                        <Switch
                          checked={range.enabled}
                          onCheckedChange={(checked) => {
                            const newRanges = [...form.timeRanges];
                            newRanges[idx] = { ...range, enabled: checked };
                            setForm({ ...form, timeRanges: newRanges });
                          }}
                        />
                        <span className={cn(
                          "w-12 text-sm",
                          range.enabled ? "text-slate-200" : "text-slate-500"
                        )}>{DAYS[range.day]}</span>
                        <Input
                          type="time"
                          value={range.startTime}
                          onChange={(e) => {
                            const newRanges = [...form.timeRanges];
                            newRanges[idx] = { ...range, startTime: e.target.value };
                            setForm({ ...form, timeRanges: newRanges });
                          }}
                          disabled={!range.enabled}
                          className="w-32 bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                        />
                        <span className="text-slate-400">to</span>
                        <Input
                          type="time"
                          value={range.endTime}
                          onChange={(e) => {
                            const newRanges = [...form.timeRanges];
                            newRanges[idx] = { ...range, endTime: e.target.value };
                            setForm({ ...form, timeRanges: newRanges });
                          }}
                          disabled={!range.enabled}
                          className="w-32 bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label className="text-slate-200">Holiday Dates (one per line, YYYY-MM-DD)</Label>
                <textarea
                  value={form.holidayDates}
                  onChange={(e) => setForm({ ...form, holidayDates: e.target.value })}
                  placeholder="2024-12-25&#10;2024-12-26&#10;2025-01-01"
                  rows={5}
                  className="bg-slate-800 border border-slate-700 rounded-md p-3 text-white text-sm font-mono"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditingSchedule(null); resetForm(); }} className="border-slate-700 text-slate-200">Cancel</Button>
            <Button onClick={editingSchedule ? handleEdit : handleAdd} disabled={!form.name} className="bg-white text-slate-800 hover:bg-slate-100">
              {editingSchedule ? 'Save Changes' : 'Create Schedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Schedule</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete <span className="text-white font-medium">{deleteTarget?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="border-slate-700 text-slate-200">Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
