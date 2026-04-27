import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Search,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Camera,
  Building2,
  Activity,
  UserCheck,
  UserX,
  ArrowRightLeft,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { accessLogs as staticAccessLogs } from '../data/staticData';
import type { User } from '../types';
import { users as staticUsers } from '../data/staticData';

interface AccessLog {
  id: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  deviceName: string;
  branchName: string;
  action: 'entry' | 'exit';
  status: 'granted' | 'denied';
  timestamp: Date;
  reason?: string;
}

const initialLogs: AccessLog[] = staticAccessLogs.map((log, idx) => {
  const user = staticUsers.find(u => u.id === log.userId);
  return {
    id: log.id,
    userName: log.userName,
    userEmail: user?.email ?? '',
    deviceName: log.deviceName,
    branchName: log.branch,
    action: idx % 3 === 0 ? 'exit' : 'entry',
    status: log.status,
    timestamp: new Date(log.timestamp),
    reason: log.status === 'denied' ? 'Access denied by system' : undefined,
  };
});

export function AccessLogs() {
  const [logs, setLogs] = useState<AccessLog[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.deviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesBranch = filterBranch === 'all' || log.branchName === filterBranch;
    return matchesSearch && matchesStatus && matchesAction && matchesBranch;
  });

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const stats = {
    total: logs.length,
    granted: logs.filter((l) => l.status === 'granted').length,
    denied: logs.filter((l) => l.status === 'denied').length,
    entry: logs.filter((l) => l.action === 'entry').length,
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Access Logs</h1>
          <p className="text-slate-400 text-sm">Track all access events across all locations</p>
        </div>
        <Button className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <Download className="size-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="px-3 py-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-slate-100 text-sm font-bold whitespace-nowrap">Total Events</CardTitle>
            <Activity className="size-3.5 text-slate-500" />
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0">
            <div className="text-white text-2xl font-semibold leading-7 whitespace-nowrap">{stats.total}</div>
            <p className="text-slate-500 mt-0.5 text-xs whitespace-nowrap overflow-hidden">Today</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="px-3 py-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-slate-100 text-sm font-bold whitespace-nowrap">Granted</CardTitle>
            <UserCheck className="size-3.5 text-green-500" />
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0">
            <div className="text-white text-2xl font-semibold leading-7 whitespace-nowrap">{stats.granted}</div>
            <p className="text-slate-500 mt-0.5 text-xs whitespace-nowrap overflow-hidden">{((stats.granted / stats.total) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="px-3 py-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-slate-100 text-sm font-bold whitespace-nowrap">Denied</CardTitle>
            <UserX className="size-3.5 text-red-500" />
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0">
            <div className="text-white text-2xl font-semibold leading-7 whitespace-nowrap">{stats.denied}</div>
            <p className="text-slate-500 mt-0.5 text-xs whitespace-nowrap overflow-hidden">{((stats.denied / stats.total) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="px-3 py-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-slate-100 text-sm font-bold whitespace-nowrap">Entries</CardTitle>
            <ArrowRightLeft className="size-3.5 text-blue-500" />
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0">
            <div className="text-white text-2xl font-semibold leading-7 whitespace-nowrap">{stats.entry}</div>
            <p className="text-slate-500 mt-0.5 text-xs whitespace-nowrap overflow-hidden">Exits: {stats.total - stats.entry}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <div className="flex-1 min-h-0 overflow-y-auto">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="text-white">Access History</CardTitle>
              <CardDescription className="text-slate-400">Showing {filteredLogs.length} events</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 border-slate-700 text-slate-200">
                <Calendar className="size-4" />
                Select Date
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <Input
                placeholder="Search..."
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
                <SelectItem value="granted" className="text-white">Granted</SelectItem>
                <SelectItem value="denied" className="text-white">Denied</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All Actions</SelectItem>
                <SelectItem value="entry" className="text-white">Entry</SelectItem>
                <SelectItem value="exit" className="text-white">Exit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Office" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All Offices</SelectItem>
                <SelectItem value="New York Office" className="text-white">New York</SelectItem>
                <SelectItem value="Los Angeles Office" className="text-white">Los Angeles</SelectItem>
                <SelectItem value="Chicago Office" className="text-white">Chicago</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-200">User</TableHead>
                  <TableHead className="text-slate-200">Device</TableHead>
                  <TableHead className="text-slate-200">Office</TableHead>
                  <TableHead className="text-slate-200">Action</TableHead>
                  <TableHead className="text-slate-200">Status</TableHead>
                  <TableHead className="text-slate-200">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage src={log.userAvatar} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {log.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white">{log.userName}</p>
                          <p className="text-slate-400">{log.userEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Camera className="size-4" />
                        {log.deviceName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Building2 className="size-4" />
                        {log.branchName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          log.action === 'entry'
                            ? 'border-blue-600 bg-blue-600/20 text-blue-400'
                            : 'border-purple-600 bg-purple-600/20 text-purple-400'
                        )}
                      >
                        {log.action === 'entry' ? 'Entry' : 'Exit'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            log.status === 'granted'
                              ? 'border-green-600 bg-green-600/20 text-green-400 w-fit'
                              : 'border-red-600 bg-red-600/20 text-red-400 w-fit'
                          )}
                        >
                          {log.status === 'granted' ? (
                            <CheckCircle2 className="size-3 mr-1" />
                          ) : (
                            <XCircle className="size-3 mr-1" />
                          )}
                          {log.status === 'granted' ? 'Granted' : 'Denied'}
                        </Badge>
                        {log.reason && (
                          <p className="text-red-400 mt-1">{log.reason}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="size-4" />
                        {formatDateTime(log.timestamp)}
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
    </div>
  );
}
