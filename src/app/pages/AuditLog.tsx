import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
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
import { Search, Download, Filter, User, Settings, Shield, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import * as XLSX from 'xlsx';

interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  category: 'user' | 'device' | 'system' | 'security';
  details: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
}

const staticAuditLogs: AuditEvent[] = [
  { id: 'AUD-001', timestamp: '2025-01-15T10:30:00Z', userId: 'USR-001', userName: 'John Smith', action: 'User Login', category: 'security', details: 'Successful login from IP 192.168.1.100', ipAddress: '192.168.1.100', status: 'success' },
  { id: 'AUD-002', timestamp: '2025-01-15T10:28:00Z', userId: 'USR-001', userName: 'John Smith', action: 'User Created', category: 'user', details: 'Created new user account for Emily Davis', ipAddress: '192.168.1.100', status: 'success' },
  { id: 'AUD-003', timestamp: '2025-01-15T10:25:00Z', userId: 'USR-002', userName: 'Sarah Johnson', action: 'Device Updated', category: 'device', details: 'Updated device settings for HQ Main Door Camera', ipAddress: '192.168.1.101', status: 'success' },
  { id: 'AUD-004', timestamp: '2025-01-15T10:20:00Z', userId: 'USR-001', userName: 'John Smith', action: 'Failed Login Attempt', category: 'security', details: 'Invalid password attempt for user admin', ipAddress: '192.168.1.200', status: 'failed' },
  { id: 'AUD-005', timestamp: '2025-01-15T10:15:00Z', userId: 'USR-003', userName: 'Michael Brown', action: 'User Deleted', category: 'user', details: 'Deleted user account for David Wilson', ipAddress: '192.168.1.102', status: 'success' },
  { id: 'AUD-006', timestamp: '2025-01-15T10:10:00Z', userId: 'SYS-001', userName: 'System', action: 'Device Offline', category: 'device', details: 'Savannah Door Camera went offline', ipAddress: 'N/A', status: 'warning' },
  { id: 'AUD-007', timestamp: '2025-01-15T10:05:00Z', userId: 'USR-002', userName: 'Sarah Johnson', action: 'Settings Changed', category: 'system', details: 'Modified system configuration for timeout settings', ipAddress: '192.168.1.101', status: 'success' },
  { id: 'AUD-008', timestamp: '2025-01-15T10:00:00Z', userId: 'USR-001', userName: 'John Smith', action: 'Branch Created', category: 'system', details: 'Created new branch Vietnam Office', ipAddress: '192.168.1.100', status: 'success' },
  { id: 'AUD-009', timestamp: '2025-01-15T09:55:00Z', userId: 'USR-004', userName: 'Emily Davis', action: 'User Login', category: 'security', details: 'Successful login from IP 192.168.1.103', ipAddress: '192.168.1.103', status: 'success' },
  { id: 'AUD-010', timestamp: '2025-01-15T09:50:00Z', userId: 'SYS-001', userName: 'System', action: 'Auto Backup', category: 'system', details: 'Scheduled database backup completed', ipAddress: 'N/A', status: 'success' },
  { id: 'AUD-011', timestamp: '2025-01-15T09:45:00Z', userId: 'USR-005', userName: 'David Wilson', action: 'Access Denied', category: 'security', details: 'Attempted to access restricted settings without permission', ipAddress: '192.168.1.104', status: 'failed' },
  { id: 'AUD-012', timestamp: '2025-01-15T09:40:00Z', userId: 'USR-002', userName: 'Sarah Johnson', action: 'Device Added', category: 'device', details: 'Added new device Cartersville Door Camera', ipAddress: '192.168.1.101', status: 'success' },
];

export function AuditLog() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = staticAuditLogs.filter((log) => {
    const q = search.toLowerCase();
    const matchSearch = 
      log.userName.toLowerCase().includes(q) || 
      log.action.toLowerCase().includes(q) || 
      log.details.toLowerCase().includes(q);
    const matchCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user': return User;
      case 'device': return Settings;
      case 'system': return Shield;
      case 'security': return AlertTriangle;
      default: return Settings;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="gap-1 border-green-600 bg-green-600/20 text-green-400"><CheckCircle2 className="size-3" />Success</Badge>;
      case 'failed':
        return <Badge className="gap-1 border-red-600 bg-red-600/20 text-red-400"><XCircle className="size-3" />Failed</Badge>;
      case 'warning':
        return <Badge className="gap-1 border-yellow-600 bg-yellow-600/20 text-yellow-400"><AlertTriangle className="size-3" />Warning</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'user':
        return <Badge variant="outline" className="border-blue-600 bg-blue-600/20 text-blue-400">User</Badge>;
      case 'device':
        return <Badge variant="outline" className="border-purple-600 bg-purple-600/20 text-purple-400">Device</Badge>;
      case 'system':
        return <Badge variant="outline" className="border-cyan-600 bg-cyan-600/20 text-cyan-400">System</Badge>;
      case 'security':
        return <Badge variant="outline" className="border-orange-600 bg-orange-600/20 text-orange-400">Security</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  const exportToCSV = () => {
    const data = staticAuditLogs.map(log => ({
      ID: log.id,
      Timestamp: formatTime(log.timestamp),
      User: log.userName,
      Action: log.action,
      Category: log.category,
      Details: log.details,
      IPAddress: log.ipAddress,
      Status: log.status,
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Audit Log');
    
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
    
    XLSX.writeFile(wb, `audit_log_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Audit Log</h1>
          <p className="text-slate-400 text-sm">System-wide activity tracking and security events</p>
        </div>
        <Button onClick={exportToCSV} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <Input
                placeholder="Search user, action, details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Categories</SelectItem>
                  <SelectItem value="user" className="text-white">User</SelectItem>
                  <SelectItem value="device" className="text-white">Device</SelectItem>
                  <SelectItem value="system" className="text-white">System</SelectItem>
                  <SelectItem value="security" className="text-white">Security</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[120px] bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Status</SelectItem>
                  <SelectItem value="success" className="text-white">Success</SelectItem>
                  <SelectItem value="failed" className="text-white">Failed</SelectItem>
                  <SelectItem value="warning" className="text-white">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow className="border-slate-800 bg-slate-800/40 hover:bg-slate-800/40">
                  <TableHead className="text-center text-slate-300 font-semibold">Timestamp</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">User</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Action</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Category</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Details</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">IP Address</TableHead>
                  <TableHead className="text-center text-slate-300 font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                      No audit logs found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((log) => {
                    const CategoryIcon = getCategoryIcon(log.category);
                    return (
                      <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="text-center text-slate-400 text-sm font-mono whitespace-nowrap">
                          {formatTime(log.timestamp)}
                        </TableCell>
                        <TableCell className="text-center text-white font-medium">{log.userName}</TableCell>
                        <TableCell className="text-center text-slate-300">{log.action}</TableCell>
                        <TableCell className="text-center">{getCategoryBadge(log.category)}</TableCell>
                        <TableCell className="text-center text-slate-400 text-sm max-w-[300px] truncate">{log.details}</TableCell>
                        <TableCell className="text-center text-slate-400 text-sm font-mono">{log.ipAddress}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(log.status)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
