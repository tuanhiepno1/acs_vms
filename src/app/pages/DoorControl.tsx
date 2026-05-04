import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { StatBar } from '../components/StatBar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  DoorOpen,
  Lock,
  Unlock,
  AlertTriangle,
  History,
  Shield,
  Search,
  Clock,
  User,
  Key,
  LogIn,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Door {
  id: string;
  name: string;
  location: string;
  status: 'locked' | 'unlocked' | 'alarm';
  mode: 'auto' | 'manual';
  lastAccess?: string;
  lastUser?: string;
}

interface AccessEvent {
  id: string;
  door: string;
  user: string;
  type: 'entry' | 'exit' | 'denied';
  timestamp: string;
  method: 'card' | 'face' | 'fingerprint' | 'manual';
}

// Mock data
const mockDoors: Door[] = [
  { id: '1', name: 'Main Entrance', location: 'Building A - Floor 1', status: 'locked', mode: 'auto', lastAccess: '2024-01-20 14:30:00', lastUser: 'John Doe' },
  { id: '2', name: 'Server Room', location: 'Building A - Basement', status: 'locked', mode: 'manual', lastAccess: '2024-01-20 13:15:00', lastUser: 'IT Admin' },
  { id: '3', name: 'Conference Room', location: 'Building A - Floor 2', status: 'unlocked', mode: 'auto', lastAccess: '2024-01-20 12:00:00', lastUser: 'Jane Smith' },
  { id: '4', name: 'Executive Floor', location: 'Building A - Floor 5', status: 'locked', mode: 'manual', lastAccess: '2024-01-20 10:30:00', lastUser: 'CEO Office' },
  { id: '5', name: 'Back Exit', location: 'Building A - Floor 1', status: 'locked', mode: 'auto', lastAccess: '2024-01-20 11:45:00', lastUser: 'Mike Johnson' },
  { id: '6', name: 'Storage Room', location: 'Building B - Floor 1', status: 'alarm', mode: 'manual', lastAccess: '2024-01-20 09:15:00', lastUser: 'Maintenance' },
];

const mockEvents: AccessEvent[] = [
  { id: '1', door: 'Main Entrance', user: 'John Doe', type: 'entry', timestamp: '2024-01-20 14:30:00', method: 'face' },
  { id: '2', door: 'Server Room', user: 'IT Admin', type: 'entry', timestamp: '2024-01-20 13:15:00', method: 'card' },
  { id: '3', door: 'Main Entrance', user: 'Unknown', type: 'denied', timestamp: '2024-01-20 13:00:00', method: 'card' },
  { id: '4', door: 'Conference Room', user: 'Jane Smith', type: 'exit', timestamp: '2024-01-20 12:00:00', method: 'face' },
  { id: '5', door: 'Back Exit', user: 'Mike Johnson', type: 'exit', timestamp: '2024-01-20 11:45:00', method: 'fingerprint' },
];

// Door Status Card Component
function DoorStatusCard({ door, onToggle }: { door: Door; onToggle: (id: string) => void }) {
  const isLocked = door.status === 'locked';
  const isUnlocked = door.status === 'unlocked';
  const isAlarm = door.status === 'alarm';

  // Card border color based on status
  const cardBorderClass = isAlarm 
    ? 'border-red-600/50 shadow-red-900/20' 
    : isUnlocked 
      ? 'border-emerald-600/50 shadow-emerald-900/20' 
      : 'border-slate-700';

  // Status indicator color
  const statusDotClass = isAlarm 
    ? 'bg-red-500 animate-pulse' 
    : isUnlocked 
      ? 'bg-emerald-500' 
      : 'bg-blue-500';

  return (
    <div className={cn(
      'relative p-4 rounded-xl border bg-slate-900 transition-all overflow-hidden',
      cardBorderClass,
      isAlarm && 'shadow-lg shadow-red-900/10'
    )}>
      {/* Status indicator line at top */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-1',
        isAlarm ? 'bg-red-500' : isUnlocked ? 'bg-emerald-500' : 'bg-blue-500'
      )} />
      
      {/* Header with icon and mode badge */}
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          'size-11 rounded-lg flex items-center justify-center border',
          isLocked && 'bg-blue-950/50 border-blue-800',
          isUnlocked && 'bg-emerald-950/50 border-emerald-800',
          isAlarm && 'bg-red-950/50 border-red-800'
        )}>
          <DoorOpen className={cn(
            'size-5',
            isLocked && 'text-blue-400',
            isUnlocked && 'text-emerald-400',
            isAlarm && 'text-red-400'
          )} />
        </div>
        <div className="flex items-center gap-2">
          {/* Status dot */}
          <div className={cn('size-2 rounded-full', statusDotClass)} />
          <Badge variant="outline" className={cn(
            'text-xs',
            door.mode === 'auto' 
              ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' 
              : 'border-orange-500/50 bg-orange-500/10 text-orange-400'
          )}>
            {door.mode === 'auto' ? 'Auto' : 'Manual'}
          </Badge>
        </div>
      </div>
      
      {/* Door info */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-white font-semibold">{door.name}</h3>
          {isAlarm && (
            <Badge className="bg-red-600 text-white border-0 text-xs">
              ALARM
            </Badge>
          )}
        </div>
        <p className="text-slate-500 text-sm">{door.location}</p>
      </div>
      
      {/* Last access info - fixed height */}
      <div className="mb-4 bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/50 h-[72px]">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
          <Clock className="size-3 text-slate-500" />
          <span>Last Access</span>
        </div>
        {door.lastAccess ? (
          <div>
            <div className="text-slate-200 text-xs font-medium truncate">{door.lastAccess}</div>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
              <User className="size-3 shrink-0" />
              <span className="truncate">{door.lastUser || '-'}</span>
            </div>
          </div>
        ) : (
          <div className="text-slate-600 text-xs italic">No recent access</div>
        )}
      </div>
      
      {/* Control buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => onToggle(door.id)}
          className={cn(
            'flex-1 gap-1.5 h-9 text-sm font-medium transition-all',
            isLocked 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/30' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 hover:border-slate-600'
          )}
        >
          <Lock className={cn('size-3.5', isLocked && 'fill-current')} />
          Locked
        </Button>
        <Button
          size="sm"
          onClick={() => onToggle(door.id)}
          className={cn(
            'flex-1 gap-1.5 h-9 text-sm font-medium transition-all',
            isUnlocked 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/30' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 hover:border-slate-600'
          )}
        >
          <Unlock className={cn('size-3.5', isUnlocked && 'fill-current')} />
          Unlocked
        </Button>
      </div>
    </div>
  );
}

// Door Control Tab
function DoorControlTab() {
  const [doors, setDoors] = useState(mockDoors);
  const [search, setSearch] = useState('');

  const filteredDoors = doors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id: string) => {
    setDoors(prev => prev.map(d => 
      d.id === id 
        ? { ...d, status: d.status === 'locked' ? 'unlocked' : 'locked' as 'locked' | 'unlocked' }
        : d
    ));
  };

  const stats = {
    total: doors.length,
    locked: doors.filter(d => d.status === 'locked').length,
    unlocked: doors.filter(d => d.status === 'unlocked').length,
    alarm: doors.filter(d => d.status === 'alarm').length,
  };

  return (
    <div className="space-y-3">
      {/* Stats - Using StatBar like other pages */}
      <StatBar items={[
        { label: 'Total', value: stats.total },
        { label: 'Locked', value: stats.locked, color: 'blue' },
        { label: 'Unlocked', value: stats.unlocked, color: 'green' },
        { label: 'Alarm', value: stats.alarm, color: 'red' },
      ]} />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
        <Input 
          placeholder="Search doors..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-10 bg-slate-800 border-slate-700 text-white" 
        />
      </div>

      {/* Door Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredDoors.map((door) => (
          <DoorStatusCard key={door.id} door={door} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}

// Access Log Tab
function AccessLogTab() {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'entry': return <LogIn className="size-4 text-green-400" />;
      case 'exit': return <DoorOpen className="size-4 text-blue-400" />;
      case 'denied': return <Shield className="size-4 text-red-400" />;
      default: return <DoorOpen className="size-4 text-slate-400" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <Key className="size-3 text-slate-400" />;
      case 'face': return <User className="size-3 text-slate-400" />;
      case 'fingerprint': return <Lock className="size-3 text-slate-400" />;
      default: return <Key className="size-3 text-slate-400" />;
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <History className="size-5 text-slate-400" />
          Access History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {mockEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-3">
                {getEventIcon(event.type)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{event.user}</span>
                    <Badge variant="outline" className={cn(
                      event.type === 'entry' && 'border-green-600 text-green-400',
                      event.type === 'exit' && 'border-blue-600 text-blue-400',
                      event.type === 'denied' && 'border-red-600 text-red-400'
                    )}>
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-xs">{event.door} • {event.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                {getMethodIcon(event.method)}
                <span className="text-xs capitalize">{event.method}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Emergency Tab
function EmergencyTab() {
  return (
    <div className="space-y-4">
      <Card className="bg-red-900/20 border-red-800">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="size-5" />
            Emergency Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300 text-sm">
            Use these controls only in emergency situations. All actions will be logged.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 gap-2 bg-red-600 text-white hover:bg-red-700 h-12">
              <Lock className="size-5" />
              Lock All Doors
            </Button>
            <Button className="flex-1 gap-2 bg-orange-600 text-white hover:bg-orange-700 h-12">
              <Unlock className="size-5" />
              Unlock All Doors
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-slate-400" />
                <div>
                  <p className="text-white text-sm">Security Team</p>
                  <p className="text-slate-400 text-xs"> ext. 1001</p>
                </div>
              </div>
              <Badge variant="outline" className="border-green-600 text-green-400">Available</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <User className="size-5 text-slate-400" />
                <div>
                  <p className="text-white text-sm">Facility Manager</p>
                  <p className="text-slate-400 text-xs"> ext. 2001</p>
                </div>
              </div>
              <Badge variant="outline" className="border-green-600 text-green-400">Available</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Door Control Component
export function DoorControl() {
  const [activeTab, setActiveTab] = useState('doors');

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Door Control</h1>
          <p className="text-slate-400 text-sm">Manage door locks, monitor access, and emergency controls</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col">
        <TabsList className="bg-slate-800 border border-slate-700 w-fit">
          <TabsTrigger value="doors" className="data-[state=active]:bg-slate-700 text-slate-300">Door Status</TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-slate-700 text-slate-300">Access Log</TabsTrigger>
          <TabsTrigger value="emergency" className="data-[state=active]:bg-slate-700 text-slate-300">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="doors" className="flex-1 min-h-0 mt-3 overflow-y-auto">
          <DoorControlTab />
        </TabsContent>

        <TabsContent value="logs" className="flex-1 min-h-0 mt-3 overflow-y-auto">
          <AccessLogTab />
        </TabsContent>

        <TabsContent value="emergency" className="flex-1 min-h-0 mt-3 overflow-y-auto">
          <EmergencyTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
