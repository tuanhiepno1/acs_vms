import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import { FaceScanOverlay } from '../components/FaceScanOverlay';
import { StatBar } from '../components/StatBar';
import type { AuthenticationLog } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
// Avatar removed — face captures now use FaceScanOverlay
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import {
  Search, Download, Wifi, WifiOff, RefreshCw, Upload,
  AlertTriangle, ShieldAlert, Clock, CheckCircle2, XCircle,
  Camera, Building2, UserCheck, UserX, CalendarDays, FileDown,
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  deviceLogs as staticDeviceLogs,
  emergencyLogs as staticEmergencyLogs,
  authenticationLogs as staticAuthLogs,
  occupancyLogs as staticOccupancyLogs,
  branches as staticBranches,
} from '../data/staticData';
import * as XLSX from 'xlsx';

const toDateStr = (iso: string) => iso.slice(0, 10);

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(new Date(iso));

const fmtShort = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));

const eventIcon = (event: string) => {
  switch (event) {
    case 'connected': return <Wifi className="size-4 text-green-400" />;
    case 'disconnected': return <WifiOff className="size-4 text-red-400" />;
    case 'restarted': return <RefreshCw className="size-4 text-blue-400" />;
    case 'firmware_updated': return <Upload className="size-4 text-violet-400" />;
    default: return null;
  }
};

const eventBadge = (event: string) => {
  const map: Record<string, string> = {
    connected: 'border-green-600 bg-green-600/20 text-green-400',
    disconnected: 'border-red-600 bg-red-600/20 text-red-400',
    restarted: 'border-blue-600 bg-blue-600/20 text-blue-400',
    firmware_updated: 'border-violet-600 bg-violet-600/20 text-violet-400',
  };
  return map[event] || '';
};

const severityBadge = (s: string) => {
  const map: Record<string, string> = {
    critical: 'border-red-600 bg-red-600/20 text-red-400',
    high: 'border-orange-600 bg-orange-600/20 text-orange-400',
    medium: 'border-yellow-600 bg-yellow-600/20 text-yellow-400',
    low: 'border-slate-600 bg-slate-600/20 text-slate-400',
  };
  return map[s] || '';
};

// ── Device Log Tab ──────────────────────────────────────────────
function DeviceLogTab() {
  const [search, setSearch] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  const filtered = staticDeviceLogs.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = l.deviceName.toLowerCase().includes(q) || l.doorName.toLowerCase().includes(q) || l.message.toLowerCase().includes(q);
    const matchEvent = filterEvent === 'all' || l.event === filterEvent;
    const matchDate = !filterDate || toDateStr(l.timestamp) === filterDate;
    return matchSearch && matchEvent && matchDate;
  });

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <CardTitle className="text-white">Device Log</CardTitle>
            <CardDescription className="text-slate-400">Connection status changes and device events</CardDescription>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <Input placeholder="Search device, door, message..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-slate-800 border-slate-700 text-white" />
          </div>
          <Select value={filterEvent} onValueChange={setFilterEvent}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white">All Events</SelectItem>
              <SelectItem value="connected" className="text-white">Connected</SelectItem>
              <SelectItem value="disconnected" className="text-white">Disconnected</SelectItem>
              <SelectItem value="restarted" className="text-white">Restarted</SelectItem>
              <SelectItem value="firmware_updated" className="text-white">Firmware Updated</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="picker-dark bg-slate-800 border-slate-700 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="border-slate-800 bg-slate-800/40 hover:bg-slate-800/40">
                <TableHead className="text-center text-slate-300 font-semibold">Date & Time</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Device</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Door</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Event</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="text-center text-slate-400 text-sm whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2"><Clock className="size-3.5" />{fmt(log.timestamp)}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div>
                      <p className="text-white text-sm">{log.deviceName}</p>
                      <p className="text-slate-500 text-xs">{log.deviceModel} · {log.deviceId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-slate-400 text-sm">{log.doorName}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn('gap-1', eventBadge(log.event))}>
                      {eventIcon(log.event)}
                      {log.event.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-slate-400 text-sm max-w-[300px] truncate">{log.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Emergency Log Tab ───────────────────────────────────────────
function EmergencyLogTab() {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  const filtered = staticEmergencyLogs.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = l.deviceName.toLowerCase().includes(q) || l.message.toLowerCase().includes(q) || l.branch.toLowerCase().includes(q);
    const matchSeverity = filterSeverity === 'all' || l.severity === filterSeverity;
    const matchDate = !filterDate || toDateStr(l.timestamp) === filterDate;
    return matchSearch && matchSeverity && matchDate;
  });

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <CardTitle className="text-white">Emergency Log</CardTitle>
            <CardDescription className="text-slate-400">Alarm events and security incidents</CardDescription>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <Input placeholder="Search device, branch, message..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-slate-800 border-slate-700 text-white" />
          </div>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white">All Severity</SelectItem>
              <SelectItem value="critical" className="text-white">Critical</SelectItem>
              <SelectItem value="high" className="text-white">High</SelectItem>
              <SelectItem value="medium" className="text-white">Medium</SelectItem>
              <SelectItem value="low" className="text-white">Low</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="picker-dark bg-slate-800 border-slate-700 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <Table className="min-w-[850px]">
            <TableHeader>
              <TableRow className="border-slate-800 bg-slate-800/40 hover:bg-slate-800/40">
                <TableHead className="text-center text-slate-300 font-semibold">Date & Time</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Device</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Branch</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Alarm</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Severity</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Message</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="text-center text-slate-400 text-sm whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2"><Clock className="size-3.5" />{fmt(log.timestamp)}</div>
                  </TableCell>
                  <TableCell className="text-center text-white text-sm">{log.deviceName}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm"><Building2 className="size-3.5" />{log.branch}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="gap-1 border-orange-600 bg-orange-600/20 text-orange-400">
                      <AlertTriangle className="size-3" />
                      {log.alarmType.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={severityBadge(log.severity)}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-slate-400 text-sm max-w-[300px] truncate">{log.message}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={log.resolved ? 'border-green-600 bg-green-600/20 text-green-400' : 'border-red-600 bg-red-600/20 text-red-400'}>
                      {log.resolved ? 'Resolved' : 'Active'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Authentication Log Tab ──────────────────────────────────────
function AuthenticationLogTab() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [previewLog, setPreviewLog] = useState<AuthenticationLog | null>(null);

  // Export date range — default: last 7 days
  const todayIso = new Date().toISOString().slice(0, 10);
  const weekAgoIso = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const [exportFrom, setExportFrom] = useState(weekAgoIso);
  const [exportTo, setExportTo] = useState(todayIso);
  const [exportBranch, setExportBranch] = useState('all');

  const filtered = staticAuthLogs.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = l.employeeName.toLowerCase().includes(q) || (l.employeeNo?.toLowerCase().includes(q) ?? false) || l.deviceName.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    const matchBranch = filterBranch === 'all' || l.branch === filterBranch;
    const matchDate = !filterDate || toDateStr(l.timestamp) === filterDate;
    return matchSearch && matchStatus && matchBranch && matchDate;
  });

  const handleExport = () => {
    const exportData = staticAuthLogs.filter((l) => {
      const d = toDateStr(l.timestamp);
      const matchRange = d >= exportFrom && d <= exportTo;
      const matchBr = exportBranch === 'all' || l.branch === exportBranch;
      return matchRange && matchBr;
    });
    const dataToExport = exportData.length > 0 ? exportData : staticAuthLogs;
    
    const data = dataToExport.map(l => ({
      Date: fmt(l.timestamp),
      Employee: l.employeeName,
      EmployeeNo: l.employeeNo || '',
      Branch: l.branch,
      Device: l.deviceName,
      Door: l.doorName,
      Direction: l.direction,
      Status: l.status,
      Confidence: l.confidence ? `${(l.confidence * 100).toFixed(0)}%` : '',
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Authentication Log');
    
    // Auto-fit columns with minimum width
    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(15, key.length, ...data.map(row => String(row[key as keyof typeof data[0]]).length))
    }));
    ws['!cols'] = colWidths;
    
    // Style header row
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "4472C4" } },
        alignment: { horizontal: "center" }
      };
    }
    
    // Style data rows
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[address]) continue;
        ws[address].s = {
          alignment: { wrapText: true, vertical: "top" }
        };
      }
    }
    
    XLSX.writeFile(wb, `auth-log_${exportFrom}_${exportTo}.xlsx`);
  };

  return (
    <>
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <CardTitle className="text-white">Authentication Log</CardTitle>
            <CardDescription className="text-slate-400">Entry/exit records with face recognition captures</CardDescription>
          </div>
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          <div className="relative col-span-2 sm:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <Input placeholder="Search name, employee no, device..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-slate-800 border-slate-700 text-white" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white">All Status</SelectItem>
              <SelectItem value="granted" className="text-white">Granted</SelectItem>
              <SelectItem value="denied" className="text-white">Denied</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBranch} onValueChange={setFilterBranch}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white">All Branches</SelectItem>
              {staticBranches.map((b) => (
                <SelectItem key={b.id} value={b.name} className="text-white">{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="picker-dark bg-slate-800 border-slate-700 text-white" />
        </div>

        {/* Export range row */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-sm"><FileDown className="size-4" />Export range:</div>
          <Input type="date" value={exportFrom} onChange={(e) => setExportFrom(e.target.value)} className="picker-dark w-[150px] bg-slate-800 border-slate-700 text-white text-sm" />
          <span className="text-slate-500 text-sm">to</span>
          <Input type="date" value={exportTo} onChange={(e) => setExportTo(e.target.value)} className="picker-dark w-[150px] bg-slate-800 border-slate-700 text-white text-sm" />
          <Select value={exportBranch} onValueChange={setExportBranch}>
            <SelectTrigger className="w-[160px] bg-slate-800 border-slate-700 text-white text-sm"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white">All Branches</SelectItem>
              {staticBranches.map((b) => (
                <SelectItem key={b.id} value={b.name} className="text-white">{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="gap-2 bg-white text-slate-800 hover:bg-slate-100 text-sm h-9">
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow className="border-slate-800 bg-slate-800/40 hover:bg-slate-800/40">
                <TableHead className="text-center text-slate-300 font-semibold w-[80px]">Capture</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Date & Time</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Employee</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Branch</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Device / Door</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Direction</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Result</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id} className={cn('border-slate-800 hover:bg-slate-800/50', log.status === 'denied' && 'bg-red-950/20')}>
                  <TableCell className="text-center">
                    {log.captureImage ? (
                      <button type="button" onClick={() => setPreviewLog(log)} className="block rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-colors w-[56px] h-[56px]">
                        <FaceScanOverlay
                          photoUrl={log.captureImage}
                          name={log.employeeName}
                          status={log.status}
                          confidence={log.confidence}
                          className="w-full h-full"
                          compact
                        />
                      </button>
                    ) : (
                      <div className="w-[56px] h-[56px] rounded-lg bg-slate-800 flex items-center justify-center">
                        <Camera className="size-4 text-slate-600" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-slate-400 text-sm whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2"><Clock className="size-3.5" />{fmt(log.timestamp)}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div>
                      <p className="text-white text-sm">{log.employeeName}</p>
                      <p className="text-slate-500 text-xs">{log.employeeNo || 'Unregistered'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm"><Building2 className="size-3.5" />{log.branch}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div>
                      <div className="flex items-center justify-center gap-2 text-slate-300 text-sm"><Camera className="size-3.5" />{log.deviceName}</div>
                      <p className="text-slate-500 text-xs">{log.doorName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={log.direction === 'entry' ? 'border-blue-600 bg-blue-600/20 text-blue-400' : 'border-purple-600 bg-purple-600/20 text-purple-400'}>
                      {log.direction === 'entry' ? 'Entry' : 'Exit'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className={cn('w-fit gap-1', log.status === 'granted' ? 'border-green-600 bg-green-600/20 text-green-400' : 'border-red-600 bg-red-600/20 text-red-400')}>
                        {log.status === 'granted' ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                        {log.status === 'granted' ? 'Granted' : 'Denied'}
                      </Badge>
                      {log.reason && <p className="text-red-400 text-xs mt-0.5">{log.reason}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn('text-sm font-mono', (log.confidence ?? 0) >= 0.8 ? 'text-green-400' : (log.confidence ?? 0) >= 0.5 ? 'text-yellow-400' : 'text-red-400')}>
                      {log.confidence != null ? `${(log.confidence * 100).toFixed(0)}%` : '—'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    {/* Face capture preview dialog */}
    <Dialog open={!!previewLog} onOpenChange={(open) => { if (!open) setPreviewLog(null); }}>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-800 p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-white">Face Capture — {previewLog?.employeeName}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {previewLog?.deviceName} · {previewLog?.doorName} · {previewLog ? fmt(previewLog.timestamp) : ''}
          </DialogDescription>
        </DialogHeader>
        {previewLog?.captureImage && (
          <div className="px-4 pb-4">
            <FaceScanOverlay
              photoUrl={previewLog.captureImage}
              name={previewLog.employeeName}
              status={previewLog.status}
              confidence={previewLog.confidence}
              timestamp={fmt(previewLog.timestamp)}
              deviceName={previewLog.deviceName}
              className="w-full h-[400px] rounded-xl"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}

// ── Occupancy Log Tab ───────────────────────────────────────────
function OccupancyLogTab() {
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  const filtered = staticOccupancyLogs.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = l.employeeName.toLowerCase().includes(q) || l.employeeNo.toLowerCase().includes(q);
    const matchBranch = filterBranch === 'all' || l.branch === filterBranch;
    const matchDate = !filterDate || l.date === filterDate;
    return matchSearch && matchBranch && matchDate;
  });

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <CardTitle className="text-white">Occupancy Log</CardTitle>
            <CardDescription className="text-slate-400">Daily working hours per employee</CardDescription>
          </div>
          <Button className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
            <Download className="size-4" />
            Export
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <Input placeholder="Search name, employee no..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-slate-800 border-slate-700 text-white" />
          </div>
          <Select value={filterBranch} onValueChange={setFilterBranch}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white">All Branches</SelectItem>
              {staticBranches.map((b) => (
                <SelectItem key={b.id} value={b.name} className="text-white">{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="picker-dark bg-slate-800 border-slate-700 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <Table className="min-w-[750px]">
            <TableHeader>
              <TableRow className="border-slate-800 bg-slate-800/40 hover:bg-slate-800/40">
                <TableHead className="text-center text-slate-300 font-semibold">Date</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Employee</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Employee No</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Branch</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">First Entry</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Last Exit</TableHead>
                <TableHead className="text-center text-slate-300 font-semibold">Total Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="text-center text-slate-400 text-sm font-mono">{log.date}</TableCell>
                  <TableCell className="text-center text-white text-sm">{log.employeeName}</TableCell>
                  <TableCell className="text-center text-slate-400 text-sm font-mono">{log.employeeNo}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm"><Building2 className="size-3.5" />{log.branch}</div>
                  </TableCell>
                  <TableCell className="text-center text-slate-400 text-sm">{log.firstEntry || '—'}</TableCell>
                  <TableCell className="text-center text-slate-400 text-sm">{log.lastExit || '—'}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn('text-sm font-semibold', log.totalHours >= 8 ? 'text-green-400' : log.totalHours >= 6 ? 'text-yellow-400' : 'text-red-400')}>
                      {log.totalHours.toFixed(1)}h
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Component ──────────────────────────────────────────────
export function LogManagement() {
  const authDenied = staticAuthLogs.filter(l => l.status === 'denied').length;
  const emergencyActive = staticEmergencyLogs.filter(l => !l.resolved).length;

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Log Management</h1>
          <p className="text-slate-400 text-sm">Device events, security alerts, authentication records, and occupancy tracking</p>
        </div>
      </div>

      <StatBar items={[
        { label: 'Device Events', value: staticDeviceLogs.length },
        { label: 'Emergencies', value: emergencyActive, color: 'red' },
        { label: 'Auth Events', value: `${staticAuthLogs.length} (${authDenied} denied)`, color: 'green' },
        { label: 'Occupancy', value: staticOccupancyLogs.length, color: 'blue' },
      ]} />

      {/* Tabs */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Tabs defaultValue="auth" className="space-y-3">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="device" className="data-[state=active]:bg-slate-700 text-slate-300">Device Log</TabsTrigger>
            <TabsTrigger value="emergency" className="data-[state=active]:bg-slate-700 text-slate-300">Emergency</TabsTrigger>
            <TabsTrigger value="auth" className="data-[state=active]:bg-slate-700 text-slate-300">Authentication</TabsTrigger>
            <TabsTrigger value="occupancy" className="data-[state=active]:bg-slate-700 text-slate-300">Occupancy</TabsTrigger>
          </TabsList>

          <TabsContent value="device"><DeviceLogTab /></TabsContent>
          <TabsContent value="emergency"><EmergencyLogTab /></TabsContent>
          <TabsContent value="auth"><AuthenticationLogTab /></TabsContent>
          <TabsContent value="occupancy"><OccupancyLogTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
