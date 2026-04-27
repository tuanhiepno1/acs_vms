import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  DoorClosed,
  DoorOpen,
  Filter,
  Lock,
  Search,
  Shield,
  Unlock,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { doors as initialDoors } from '../data/staticData';
import type { Door } from '../types';
import { cn } from '../lib/utils';

export default function DoorManagement() {
  const [doors, setDoors] = useState<Door[]>(initialDoors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const branches = useMemo(
    () => ['all', ...Array.from(new Set(doors.map((door) => door.branch)))],
    [doors],
  );

  const toggleDoor = (doorId: string) => {
    setDoors((prev) =>
      prev.map((door) =>
        door.id === doorId
          ? { ...door, status: door.status === 'locked' ? 'unlocked' : 'locked' }
          : door,
      ),
    );
  };

  const setAllDoorStatus = (status: Door['status']) => {
    setDoors((prev) => prev.map((door) => ({ ...door, status })));
  };

  const filteredDoors = doors.filter((door) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      door.name.toLowerCase().includes(q) ||
      door.branch.toLowerCase().includes(q) ||
      door.type.toLowerCase().includes(q);
    const matchesBranch = filterBranch === 'all' || door.branch === filterBranch;
    const matchesStatus = filterStatus === 'all' || door.status === filterStatus;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const stats = {
    total: doors.length,
    locked: doors.filter((door) => door.status === 'locked').length,
    unlocked: doors.filter((door) => door.status === 'unlocked').length,
  };

  const getDoorIcon = (type: Door['type']) => {
    switch (type) {
      case 'glass-door':
        return DoorOpen;
      case 'solid-door':
        return DoorClosed;
      case 'gate':
        return Shield;
      case 'emergency':
        return AlertTriangle;
      case 'turnstile':
        return Building2;
      default:
        return DoorOpen;
    }
  };

  const getStatusClasses = (status: Door['status']) =>
    status === 'locked'
      ? 'border-red-600 bg-red-600/15 text-red-300'
      : 'border-green-600 bg-green-600/15 text-green-300';

  const getAccessLevelClasses = (level: Door['accessLevel']) => {
    switch (level) {
      case 'all':
        return 'border-green-600/50 bg-green-600/15 text-green-300';
      case 'staff-only':
        return 'border-blue-600/50 bg-blue-600/15 text-blue-300';
      case 'restricted':
        return 'border-violet-600/50 bg-violet-600/15 text-violet-300';
      case 'emergency-only':
        return 'border-red-600/50 bg-red-600/15 text-red-300';
      case 'admin-only':
        return 'border-orange-600/50 bg-orange-600/15 text-orange-300';
      default:
        return 'border-slate-600 bg-slate-700/40 text-slate-300';
    }
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex justify-end">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={() => setAllDoorStatus('locked')}
            variant="outline"
            className="gap-2 border-red-700/70 bg-red-950/40 text-red-200 hover:bg-red-900/60 hover:text-white"
          >
            <Lock className="size-4" />
            Lock All
          </Button>
          <Button
            onClick={() => setAllDoorStatus('unlocked')}
            className="gap-2 bg-green-600 text-white hover:bg-green-700"
          >
            <Unlock className="size-4" />
            Unlock All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="px-3 py-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-slate-100 text-sm font-bold whitespace-nowrap">Total Doors</CardTitle>
            <DoorOpen className="size-4 text-slate-400" />
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0">
            <div className="text-white text-2xl font-semibold leading-7">{stats.total}</div>
            <p className="text-slate-500 mt-0.5 text-xs">Configured access points</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="px-3 py-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-slate-100 text-sm font-bold whitespace-nowrap">Locked</CardTitle>
            <Lock className="size-4 text-red-400" />
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0">
            <div className="text-red-300 text-2xl font-semibold leading-7">{stats.locked}</div>
            <p className="text-slate-500 mt-0.5 text-xs">Currently secured</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="px-3 py-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-slate-100 text-sm font-bold whitespace-nowrap">Unlocked</CardTitle>
            <Unlock className="size-4 text-green-400" />
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0">
            <div className="text-green-300 text-2xl font-semibold leading-7">{stats.unlocked}</div>
            <p className="text-slate-500 mt-0.5 text-xs">Open for access</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-3">
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by door, office, or type..."
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Office" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch} className="text-white">
                    {branch === 'all' ? 'All Offices' : branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="locked" className="text-white">Locked</SelectItem>
                <SelectItem value="unlocked" className="text-white">Unlocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <Filter className="size-3.5" />
            <span>
              Showing <span className="text-slate-300">{filteredDoors.length}</span> of{' '}
              <span className="text-slate-300">{doors.length}</span> doors
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {filteredDoors.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 py-10 text-center">
              <DoorClosed className="size-12 text-slate-600" />
              <h3 className="mt-4 text-lg font-medium text-white">No doors found</h3>
              <p className="mt-2 max-w-md text-sm text-slate-400">
                Try changing the keyword or filters to see more access points.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredDoors.map((door) => {
              const DoorIcon = getDoorIcon(door.type);

              return (
                <Card
                  key={door.id}
                  className={cn(
                    'bg-slate-900 border-slate-800 overflow-hidden',
                    door.status === 'locked'
                      ? 'shadow-[0_0_0_1px_rgba(220,38,38,0.12)]'
                      : 'shadow-[0_0_0_1px_rgba(22,163,74,0.12)]',
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={cn(
                          'flex size-12 items-center justify-center rounded-xl border',
                          door.status === 'locked'
                            ? 'border-red-600/40 bg-red-600/10 text-red-300'
                            : 'border-green-600/40 bg-green-600/10 text-green-300',
                        )}
                      >
                        <DoorIcon className="size-6" />
                      </div>
                      <Badge variant="outline" className={getStatusClasses(door.status)}>
                        {door.status === 'locked' ? 'Locked' : 'Unlocked'}
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-base font-semibold text-white">{door.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{door.branch}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className={getAccessLevelClasses(door.accessLevel)}>
                        {door.accessLevel.replace(/-/g, ' ')}
                      </Badge>
                      <Badge variant="outline" className="border-slate-700 bg-slate-800/80 text-slate-300">
                        {door.type.replace(/-/g, ' ')}
                      </Badge>
                    </div>

                    <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-400">
                      Linked device: <span className="text-slate-200">{door.deviceId}</span>
                    </div>

                    <Button
                      onClick={() => toggleDoor(door.id)}
                      className={cn(
                        'mt-4 w-full gap-2',
                        door.status === 'locked'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-red-600 text-white hover:bg-red-700',
                      )}
                    >
                      {door.status === 'locked' ? (
                        <>
                          <Unlock className="size-4" />
                          Unlock Door
                        </>
                      ) : (
                        <>
                          <Lock className="size-4" />
                          Lock Door
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
