import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '../components/ui/tabs';
import {
  ArrowLeft, Save, X, Edit3, Camera, Building2, DoorOpen, Lock, Unlock,
  FolderOpen, LogIn, LogOut, ArrowLeftRight, Zap,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocalStorage } from '../lib/use-local-storage';
import { devices as staticDevices, branches as defaultBranches } from '../data/staticData';
import type { Device } from '../types';
import { formatTimeAgo } from '../lib/date';

interface Group {
  id: string;
  name: string;
  type: 'user' | 'device';
}

export function DeviceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [devices, setDevices] = useLocalStorage<Device[]>('acs_devices', staticDevices);
  const [branchList] = useLocalStorage('acs_branches', defaultBranches);
  const [groups] = useLocalStorage<Group[]>('acs_groups', []);

  const device = devices.find((d) => d.id === id);

  const [isEditing, setIsEditing] = useState(true);
  const [form, setForm] = useState<Partial<Device>>({});

  useEffect(() => {
    if (device) {
      setForm({ ...device });
    }
  }, [device]);

  if (!device) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Camera className="size-12 text-slate-500" />
        <h2 className="text-white text-xl font-semibold">Device Not Found</h2>
        <p className="text-slate-400">The device you are looking for does not exist.</p>
        <Button onClick={() => navigate('/devices')} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <ArrowLeft className="size-4" />
          Back to Devices
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    if (!form.name) return;
    setDevices((prev) =>
      prev.map((d) =>
        d.id === device.id
          ? {
              ...d,
              name: form.name!,
              branch: form.branch || d.branch,
              location: form.location || d.location,
              model: form.model || d.model,
              ipAddress: form.ipAddress || d.ipAddress,
              doorType: form.doorType || d.doorType,
              doorStatus: form.doorStatus || d.doorStatus,
              groupIds: form.groupIds || d.groupIds,
            }
          : d
      )
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...device });
    setIsEditing(false);
  };

  const statusConfig = {
    online: { bg: 'bg-green-600/20', text: 'text-green-400', border: 'border-green-600' },
    offline: { bg: 'bg-red-600/20', text: 'text-red-400', border: 'border-red-600' },
    warning: { bg: 'bg-yellow-600/20', text: 'text-yellow-400', border: 'border-yellow-600' },
    disconnected: { bg: 'bg-gray-600/20', text: 'text-gray-400', border: 'border-gray-600' },
    maintenance: { bg: 'bg-orange-600/20', text: 'text-orange-400', border: 'border-orange-600' },
  };

  const currentStatus = device.status;
  const statusCfg = statusConfig[currentStatus];

  const toggleDoor = () => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === device.id ? { ...d, doorStatus: d.doorStatus === 'locked' ? 'unlocked' : 'locked' } : d
      )
    );
    setForm((prev) => ({ ...prev, doorStatus: prev.doorStatus === 'locked' ? 'unlocked' : 'locked' }));
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/devices')} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-white text-xl font-bold">{isEditing ? 'Edit Device' : 'Device Details'}</h1>
            <p className="text-slate-400 text-sm">{device.model} • {device.branch}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                <X className="size-4" /> Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
                <Save className="size-4" /> Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
              <Edit3 className="size-4" /> Edit
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
        {/* Profile Card */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={cn('size-20 rounded-xl flex items-center justify-center shrink-0 shadow-md', statusCfg.bg)}>
                <Camera className={cn('size-10', statusCfg.text)} />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  {isEditing ? (
                    <Input
                      value={form.name || ''}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="text-xl font-bold bg-slate-800 border-slate-700 text-white max-w-sm h-12"
                    />
                  ) : (
                    <h2 className="text-white text-2xl font-bold">{device.name}</h2>
                  )}
                  <Badge variant="outline" className={cn(statusCfg.border, statusCfg.bg, statusCfg.text)}>
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">Model</p>
                    {isEditing ? (
                      <Select value={form.model || ''} onValueChange={(v) => setForm({ ...form, model: v })}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-10 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="FaceID Pro X1" className="text-white">FaceID Pro X1</SelectItem>
                          <SelectItem value="FaceID Pro X2" className="text-white">FaceID Pro X2</SelectItem>
                          <SelectItem value="FaceID Standard" className="text-white">FaceID Standard</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-white text-base">{device.model}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">Office</p>
                    {isEditing ? (
                      <Select value={form.branch || ''} onValueChange={(v) => setForm({ ...form, branch: v })}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-10 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {branchList.map((b: any) => (
                            <SelectItem key={b.id} value={b.name} className="text-white">{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-white text-base">{device.branch}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">Location</p>
                    {isEditing ? (
                      <Input value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} className="bg-slate-800 border-slate-700 text-white h-10 text-base" />
                    ) : (
                      <p className="text-white text-base">{device.location}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">IP Address</p>
                    {isEditing ? (
                      <Input value={form.ipAddress || ''} onChange={(e) => setForm({ ...form, ipAddress: e.target.value })} className="bg-slate-800 border-slate-700 text-white h-10 text-base font-mono" />
                    ) : (
                      <p className="text-white text-base font-mono">{device.ipAddress}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="details" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Details</TabsTrigger>
            <TabsTrigger value="control" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Door Control</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-2 space-y-2">
            {/* Device Settings - merged */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <Zap className="size-4 text-slate-400" />
                  Device Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider text-slate-500">Door Type</Label>
                    {isEditing ? (
                      <Select value={form.doorType || ''} onValueChange={(v) => setForm({ ...form, doorType: v as 'entry' | 'exit' | 'both' })}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1.5 h-10 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="entry" className="text-white"><span className="flex items-center gap-2"><LogIn className="size-4" />Entry Only</span></SelectItem>
                          <SelectItem value="exit" className="text-white"><span className="flex items-center gap-2"><LogOut className="size-4" />Exit Only</span></SelectItem>
                          <SelectItem value="both" className="text-white"><span className="flex items-center gap-2"><ArrowLeftRight className="size-4" />Entry & Exit</span></SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        {device.doorType === 'entry' && <LogIn className="size-4 text-blue-400" />}
                        {device.doorType === 'exit' && <LogOut className="size-4 text-orange-400" />}
                        {device.doorType === 'both' && <ArrowLeftRight className="size-4 text-purple-400" />}
                        <span className="text-white text-base capitalize">{device.doorType}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider text-slate-500">Assigned Groups</Label>
                    {isEditing ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {groups.filter(g => g.type === 'device').length === 0 ? (
                          <span className="text-slate-500 text-sm">No device groups available</span>
                        ) : (
                          groups.filter(g => g.type === 'device').map(g => (
                            <label key={g.id} className="flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded cursor-pointer hover:bg-slate-700">
                              <input
                                type="checkbox"
                                checked={(form.groupIds || []).includes(g.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setForm({ ...form, groupIds: [...(form.groupIds || []), g.id] });
                                  } else {
                                    setForm({ ...form, groupIds: (form.groupIds || []).filter(id => id !== g.id) });
                                  }
                                }}
                                className="size-4 accent-blue-500"
                              />
                              <span className="text-slate-200 text-sm">{g.name}</span>
                            </label>
                          ))
                        )}
                      </div>
                    ) : device.groupIds && device.groupIds.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {device.groupIds.map(gid => {
                          const group = groups.find(g => g.id === gid);
                          return group ? (
                            <Badge key={gid} variant="outline" className="border-green-600/50 bg-green-600/15 text-green-300 text-sm">
                              <FolderOpen className="size-3 mr-1" />{group.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm mt-1">Not assigned to any group</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider text-slate-500">Door Status</Label>
                    {isEditing ? (
                      <Select value={form.doorStatus || ''} onValueChange={(v) => setForm({ ...form, doorStatus: v as 'locked' | 'unlocked' })}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1.5 h-10 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="locked" className="text-white">Locked</SelectItem>
                          <SelectItem value="unlocked" className="text-white">Unlocked</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className={cn(
                        device.doorStatus === 'locked' ? 'border-red-600 bg-red-600/20 text-red-400' : 'border-green-600 bg-green-600/20 text-green-400',
                        'mt-1'
                      )}>
                        {device.doorStatus === 'locked' ? <Lock className="size-3 mr-1" /> : <Unlock className="size-3 mr-1" />}
                        {device.doorStatus === 'locked' ? 'Locked' : 'Unlocked'}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider text-slate-500">Firmware</Label>
                    <p className="text-white text-base mt-1.5">{device.firmwareVersion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-3">
                  <p className="text-slate-500 text-xs">Last Activity</p>
                  <p className="text-white text-sm mt-1">{formatTimeAgo(device.lastActivity)}</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-3">
                  <p className="text-slate-500 text-xs">Today Scans</p>
                  <p className="text-white text-sm mt-1">{device.todayCount || 0} scans</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="control" className="mt-2">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <DoorOpen className="size-4 text-slate-400" />
                  Door Control
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">Current status</p>
                    <p className={cn(
                      'text-xl font-bold mt-1',
                      device.doorStatus === 'locked' ? 'text-red-400' : 'text-green-400'
                    )}>
                      {device.doorStatus === 'locked' ? 'Locked' : 'Unlocked'}
                    </p>
                  </div>
                  <div className={cn(
                    'size-16 rounded-full flex items-center justify-center',
                    device.doorStatus === 'locked' ? 'bg-red-600/20' : 'bg-green-600/20'
                  )}>
                    {device.doorStatus === 'locked' ? (
                      <Lock className="size-8 text-red-500" />
                    ) : (
                      <Unlock className="size-8 text-green-500" />
                    )}
                  </div>
                </div>
                <Button
                  onClick={toggleDoor}
                  className={cn(
                    'w-full gap-2',
                    device.doorStatus === 'locked'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  )}
                >
                  {device.doorStatus === 'locked' ? (
                    <><Unlock className="size-4" /> Unlock Door</>
                  ) : (
                    <><Lock className="size-4" /> Lock Door</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
