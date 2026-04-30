import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { StatBar } from '../components/StatBar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
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
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Search, Edit, Trash2, Plus, Camera, Building2, DoorOpen, LogIn, LogOut, ArrowLeftRight, Lock, Unlock, FolderOpen,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocalStorage } from '../lib/use-local-storage';
import { devices as staticDevices, branches as defaultBranches } from '../data/staticData';
import type { Device } from '../types';

interface Group {
  id: string;
  name: string;
  type: 'user' | 'device';
}

import { formatTimeAgo } from '../lib/date';

export function Devices() {
  const [devices, setDevices] = useLocalStorage<Device[]>('acs_devices', staticDevices);
  const [branchList] = useLocalStorage('acs_branches', defaultBranches);
  const [groups] = useLocalStorage<Group[]>('acs_groups', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);
  const [deleteDevice, setDeleteDevice] = useState<Device | null>(null);
  const [viewDevice, setViewDevice] = useState<Device | null>(null);
  const [form, setForm] = useState({ name: '', branch: '', location: '', model: '', doorType: 'both' as 'entry' | 'exit' | 'both', doorStatus: 'locked' as 'locked' | 'unlocked', ipAddress: '', groupIds: [] as string[] });

  const resetForm = () => setForm({ name: '', branch: '', location: '', model: '', doorType: 'both', doorStatus: 'locked', ipAddress: '', groupIds: [] });
  const openAdd = () => { resetForm(); setIsAddDialogOpen(true); };
  const openEdit = (d: Device) => { setForm({ name: d.name, branch: d.branch, location: d.location, model: d.model, doorType: d.doorType || 'both', doorStatus: d.doorStatus || 'locked', ipAddress: d.ipAddress, groupIds: d.groupIds || [] }); setEditDevice(d); };

  const handleAdd = () => {
    if (!form.name) return;
    setDevices(prev => [{ id: Date.now().toString(), name: form.name, branch: form.branch || 'Headquarters', location: form.location, doorType: form.doorType, doorStatus: form.doorStatus, status: 'online' as const, lastSeen: new Date().toISOString(), lastActivity: new Date().toISOString(), ipAddress: form.ipAddress, firmwareVersion: 'v2.1.0', todayCount: 0, model: form.model || 'FaceID Pro X1', ...(form.groupIds.length > 0 ? { groupIds: form.groupIds } : {}) }, ...prev]);
    setIsAddDialogOpen(false); resetForm();
  };
  const handleEdit = () => {
    if (!editDevice || !form.name) return;
    setDevices(prev => prev.map(d => d.id === editDevice.id ? { ...d, name: form.name, branch: form.branch || d.branch, location: form.location, model: form.model || d.model, doorType: form.doorType, doorStatus: form.doorStatus, ipAddress: form.ipAddress, groupIds: form.groupIds } : d));
    setEditDevice(null); resetForm();
  };
  const handleDelete = () => {
    if (!deleteDevice) return;
    setDevices(prev => prev.filter(d => d.id !== deleteDevice.id));
    setDeleteDevice(null);
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || device.status === filterStatus;
    const matchesBranch = filterBranch === 'all' || device.branch === filterBranch;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  const stats = {
    total: devices.length,
    online: devices.filter((d) => d.status === 'online').length,
    offline: devices.filter((d) => d.status === 'offline').length,
    warning: devices.filter((d) => d.status === 'warning').length,
    disconnected: devices.filter((d) => d.status === 'disconnected').length,
    maintenance: devices.filter((d) => d.status === 'maintenance').length,
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Device Management</h1>
          <p className="text-slate-400 text-sm">Manage face recognition terminals and door controllers</p>
        </div>
        <Button onClick={openAdd} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <Plus className="size-4" />
          Add Device
        </Button>
      </div>

      <StatBar items={[
        { label: 'Total', value: stats.total },
        { label: 'Online', value: stats.online, color: 'green' },
        { label: 'Offline', value: stats.offline, color: 'red' },
        { label: 'Warning', value: stats.warning, color: 'yellow' },
        { label: 'Disconnected', value: stats.disconnected, color: 'gray' },
        { label: 'Maintenance', value: stats.maintenance, color: 'orange' },
      ]} />

      {/* Main Table */}
      <div className="flex-1 min-h-0 overflow-y-auto">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="text-white">Device List</CardTitle>
              <CardDescription className="text-slate-400">Showing {filteredDevices.length} devices</CardDescription>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <Input
                placeholder="Search devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="online" className="text-white">Online</SelectItem>
                <SelectItem value="offline" className="text-white">Offline</SelectItem>
                <SelectItem value="warning" className="text-white">Warning</SelectItem>
                <SelectItem value="disconnected" className="text-white">Disconnected</SelectItem>
                <SelectItem value="maintenance" className="text-white">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Office" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All Offices</SelectItem>
                {branchList.map(b => (
                  <SelectItem key={b.id} value={b.name} className="text-white">{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDevices.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-slate-800 px-6 py-10 text-center">
              <Camera className="size-12 text-slate-600" />
              <h3 className="mt-4 text-lg font-medium text-white">No devices found</h3>
              <p className="mt-2 max-w-md text-sm text-slate-400">
                Try changing the keyword or filters to see more devices.
              </p>
            </div>
          ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow className="border-slate-800 bg-slate-800/40 hover:bg-slate-800/40">
                  <TableHead className="text-center text-slate-300 font-semibold">Status</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Device</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Location</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Door Type</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Groups</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-center">
                      <div
                        className={cn(
                          'size-10 rounded-lg flex items-center justify-center mx-auto cursor-pointer',
                          device.status === 'online' && 'bg-green-600/20',
                          device.status === 'offline' && 'bg-red-600/20',
                          device.status === 'warning' && 'bg-yellow-600/20',
                          device.status === 'disconnected' && 'bg-gray-600/20',
                          device.status === 'maintenance' && 'bg-orange-600/20'
                        )}
                        onClick={() => setViewDevice(device)}
                      >
                        <Camera
                          className={cn(
                            'size-5',
                            device.status === 'online' && 'text-green-500',
                            device.status === 'offline' && 'text-red-500',
                            device.status === 'warning' && 'text-yellow-500',
                            device.status === 'disconnected' && 'text-gray-500',
                            device.status === 'maintenance' && 'text-orange-500'
                          )}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => setViewDevice(device)} className="text-white font-medium hover:text-blue-400 hover:underline cursor-pointer">
                        {device.name}
                      </button>
                    </TableCell>
                    <TableCell className="text-center text-slate-400">{device.location}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          device.doorType === 'entry' && 'border-blue-500 text-blue-400',
                          device.doorType === 'exit' && 'border-orange-500 text-orange-400',
                          device.doorType === 'both' && 'border-purple-500 text-purple-400'
                        )}
                      >
                        {device.doorType === 'entry' && <><LogIn className="size-3 mr-1" />Entry</>}
                        {device.doorType === 'exit' && <><LogOut className="size-3 mr-1" />Exit</>}
                        {device.doorType === 'both' && <><ArrowLeftRight className="size-3 mr-1" />Both</>}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {device.groupIds && device.groupIds.length > 0 ? (
                          device.groupIds.map(gid => {
                            const group = groups.find(g => g.id === gid);
                            return group ? (
                              <Badge key={gid} variant="outline" className="border-green-600/50 bg-green-600/15 text-green-300 text-xs">
                                <FolderOpen className="size-3 mr-1" />{group.name}
                              </Badge>
                            ) : null;
                          })
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-400 hover:bg-slate-800" onClick={() => openEdit(device)}>
                          <Edit className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400 hover:bg-slate-800" onClick={() => setDeleteDevice(device)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader><DialogTitle className="text-white">Add New Device</DialogTitle><DialogDescription className="text-slate-400">Enter device information</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label className="text-slate-200">Device Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Main Entrance" className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Office</Label><Select value={form.branch} onValueChange={v => setForm({...form, branch: v})}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select office" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700">{branchList.map(branch => <SelectItem key={branch.id} value={branch.name} className="text-white">{branch.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid gap-2"><Label className="text-slate-200">Location</Label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Ground Floor" className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Model</Label><Select value={form.model} onValueChange={v => setForm({...form, model: v})}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select model" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="FaceID Pro X1" className="text-white">FaceID Pro X1</SelectItem><SelectItem value="FaceID Pro X2" className="text-white">FaceID Pro X2</SelectItem><SelectItem value="FaceID Standard" className="text-white">FaceID Standard</SelectItem></SelectContent></Select></div>
            <div className="grid gap-2"><Label className="text-slate-200">IP Address</Label><Input value={form.ipAddress} onChange={e => setForm({...form, ipAddress: e.target.value})} placeholder="192.168.1.101" className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Door Type</Label><Select value={form.doorType} onValueChange={v => setForm({...form, doorType: v as 'entry' | 'exit' | 'both'})}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="entry" className="text-white">Entry Only</SelectItem><SelectItem value="exit" className="text-white">Exit Only</SelectItem><SelectItem value="both" className="text-white">Entry & Exit</SelectItem></SelectContent></Select></div>
            <div className="grid gap-2"><Label className="text-slate-200">Initial Door Status</Label><Select value={form.doorStatus} onValueChange={v => setForm({...form, doorStatus: v as 'locked' | 'unlocked'})}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="locked" className="text-white">Locked</SelectItem><SelectItem value="unlocked" className="text-white">Unlocked</SelectItem></SelectContent></Select></div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Groups</Label>
              <div className="flex flex-wrap gap-2 p-3 border border-slate-700 rounded-md bg-slate-800/50">
                {groups.filter(g => g.type === 'device').length === 0 ? (
                  <span className="text-slate-500 text-sm">No device groups available</span>
                ) : (
                  groups.filter(g => g.type === 'device').map(g => (
                    <label key={g.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded cursor-pointer hover:bg-slate-700">
                      <input
                        type="checkbox"
                        checked={form.groupIds.includes(g.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({ ...form, groupIds: [...form.groupIds, g.id] });
                          } else {
                            setForm({ ...form, groupIds: form.groupIds.filter(id => id !== g.id) });
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
          <DialogFooter><Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-slate-700 text-slate-200">Cancel</Button><Button onClick={handleAdd} className="bg-white text-slate-800 hover:bg-slate-100">Add Device</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDevice} onOpenChange={open => { if (!open) setEditDevice(null); }}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader><DialogTitle className="text-white">Edit Device</DialogTitle><DialogDescription className="text-slate-400">Update device information</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label className="text-slate-200">Device Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Office</Label><Select value={form.branch} onValueChange={v => setForm({...form, branch: v})}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700">{branchList.map(branch => <SelectItem key={branch.id} value={branch.name} className="text-white">{branch.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid gap-2"><Label className="text-slate-200">Location</Label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Model</Label><Select value={form.model} onValueChange={v => setForm({...form, model: v})}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="FaceID Pro X1" className="text-white">FaceID Pro X1</SelectItem><SelectItem value="FaceID Pro X2" className="text-white">FaceID Pro X2</SelectItem><SelectItem value="FaceID Standard" className="text-white">FaceID Standard</SelectItem></SelectContent></Select></div>
            <div className="grid gap-2"><Label className="text-slate-200">IP Address</Label><Input value={form.ipAddress} onChange={e => setForm({...form, ipAddress: e.target.value})} className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Door Status</Label><Select value={form.doorStatus} onValueChange={v => setForm({...form, doorStatus: v as 'locked' | 'unlocked'})}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="locked" className="text-white">Locked</SelectItem><SelectItem value="unlocked" className="text-white">Unlocked</SelectItem></SelectContent></Select></div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Groups</Label>
              <div className="flex flex-wrap gap-2 p-3 border border-slate-700 rounded-md bg-slate-800/50">
                {groups.filter(g => g.type === 'device').length === 0 ? (
                  <span className="text-slate-500 text-sm">No device groups available</span>
                ) : (
                  groups.filter(g => g.type === 'device').map(g => (
                    <label key={g.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded cursor-pointer hover:bg-slate-700">
                      <input type="checkbox" checked={form.groupIds.includes(g.id)} onChange={(e) => { if (e.target.checked) { setForm({ ...form, groupIds: [...form.groupIds, g.id] }); } else { setForm({ ...form, groupIds: form.groupIds.filter(id => id !== g.id) }); } }} className="size-4 accent-blue-500" />
                      <span className="text-slate-200 text-sm">{g.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditDevice(null)} className="border-slate-700 text-slate-200">Cancel</Button><Button onClick={handleEdit} className="bg-white text-slate-800 hover:bg-slate-100">Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteDevice} onOpenChange={open => { if (!open) setDeleteDevice(null); }}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader><DialogTitle className="text-white">Delete Device</DialogTitle><DialogDescription className="text-slate-400">Are you sure you want to delete <span className="text-white font-medium">{deleteDevice?.name}</span>? This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteDevice(null)} className="border-slate-700 text-slate-200">Cancel</Button><Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Device Detail */}
      <Dialog open={!!viewDevice} onOpenChange={open => { if (!open) setViewDevice(null); }}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Camera className="size-5" />
              {viewDevice?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400">Device details and door control</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <Label className="text-slate-500 text-xs">Model</Label>
                <p className="text-white font-medium">{viewDevice?.model}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <Label className="text-slate-500 text-xs">Office</Label>
                <p className="text-white font-medium">{viewDevice?.branch}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <Label className="text-slate-500 text-xs">Location</Label>
                <p className="text-white font-medium">{viewDevice?.location}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <Label className="text-slate-500 text-xs">IP Address</Label>
                <p className="text-white font-medium">{viewDevice?.ipAddress}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <Label className="text-slate-500 text-xs">Door Type</Label>
                <p className="text-white font-medium capitalize">{viewDevice?.doorType}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <Label className="text-slate-500 text-xs">Status</Label>
                <Badge variant="outline" className={cn(
                  viewDevice?.status === 'online' && 'border-green-600 bg-green-600/20 text-green-400',
                  viewDevice?.status === 'offline' && 'border-red-600 bg-red-600/20 text-red-400',
                  viewDevice?.status === 'warning' && 'border-yellow-600 bg-yellow-600/20 text-yellow-400',
                  viewDevice?.status === 'disconnected' && 'border-gray-600 bg-gray-600/20 text-gray-400',
                  viewDevice?.status === 'maintenance' && 'border-orange-600 bg-orange-600/20 text-orange-400'
                )}>
                  {viewDevice?.status}
                </Badge>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <Label className="text-slate-500 text-xs">Last Activity</Label>
                <p className="text-white font-medium">{viewDevice ? formatTimeAgo(viewDevice.lastActivity) : '-'}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <Label className="text-slate-500 text-xs">Today Scans</Label>
                <p className="text-white font-medium">{viewDevice?.todayCount || 0} scans</p>
              </div>
            </div>

            {/* Door Lock Control */}
            <div className="border border-slate-700 rounded-lg p-4 bg-slate-800/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label className="text-slate-200 text-base flex items-center gap-2">
                    <DoorOpen className="size-4" />
                    Door Control
                  </Label>
                  <p className="text-slate-400 text-sm mt-1">
                    Current status: <span className={cn(
                      'font-medium',
                      viewDevice?.doorStatus === 'locked' ? 'text-red-400' : 'text-green-400'
                    )}>{viewDevice?.doorStatus === 'locked' ? 'Locked' : 'Unlocked'}</span>
                  </p>
                </div>
                <div className={cn(
                  'size-12 rounded-full flex items-center justify-center',
                  viewDevice?.doorStatus === 'locked' ? 'bg-red-600/20' : 'bg-green-600/20'
                )}>
                  {viewDevice?.doorStatus === 'locked' ? (
                    <Lock className="size-6 text-red-500" />
                  ) : (
                    <Unlock className="size-6 text-green-500" />
                  )}
                </div>
              </div>
              <Button
                onClick={() => {
                  if (viewDevice) {
                    setDevices(prev => prev.map(d => d.id === viewDevice.id ? { ...d, doorStatus: d.doorStatus === 'locked' ? 'unlocked' : 'locked' } : d));
                    setViewDevice({ ...viewDevice, doorStatus: viewDevice.doorStatus === 'locked' ? 'unlocked' : 'locked' });
                  }
                }}
                className={cn(
                  'w-full gap-2',
                  viewDevice?.doorStatus === 'locked'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                )}
              >
                {viewDevice?.doorStatus === 'locked' ? (
                  <><Unlock className="size-4" /> Unlock Door</>
                ) : (
                  <><Lock className="size-4" /> Lock Door</>
                )}
              </Button>
            </div>

            {/* Groups */}
            {viewDevice?.groupIds && viewDevice.groupIds.length > 0 && (
              <div>
                <Label className="text-slate-500 text-xs mb-2 block">Groups</Label>
                <div className="flex flex-wrap gap-1">
                  {viewDevice.groupIds.map(gid => {
                    const group = groups.find(g => g.id === gid);
                    return group ? (
                      <Badge key={gid} variant="outline" className="border-green-600/50 bg-green-600/15 text-green-300 text-xs">
                        <FolderOpen className="size-3 mr-1" />{group.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDevice(null)} className="border-slate-700 text-slate-200">Close</Button>
            <Button onClick={() => { setViewDevice(null); if (viewDevice) openEdit(viewDevice); }} className="bg-white text-slate-800 hover:bg-slate-100">Edit Device</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
