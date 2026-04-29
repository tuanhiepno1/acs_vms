import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
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
import { Search, Download, Building2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { occupancyLogs, branches } from '../data/staticData';

export function Occupancy() {
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  const filtered = occupancyLogs.filter((l: any) => {
    const q = search.toLowerCase();
    const matchSearch = l.employeeName.toLowerCase().includes(q) || l.employeeNo.toLowerCase().includes(q);
    const matchBranch = filterBranch === 'all' || l.branch === filterBranch;
    const matchDate = !filterDate || l.date === filterDate;
    return matchSearch && matchBranch && matchDate;
  });

  const handleExport = () => {
    const headers = ['Date,Employee,Employee No,Branch,First Entry,Last Exit,Total Hours'];
    const rows = filtered.map((log: any) =>
      `${log.date},${log.employeeName},${log.employeeNo},${log.branch},${log.firstEntry || '—'},${log.lastExit || '—'},${log.totalHours.toFixed(1)}h`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `occupancy_log_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Occupancy Log</h1>
          <p className="text-slate-400 text-sm">Daily working hours per employee</p>
        </div>
        <Button onClick={handleExport} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <Download className="size-4" />
          Export
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800 flex-1 min-h-0">
        <CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <Input placeholder="Search name, employee no..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-slate-800 border-slate-700 text-white" />
            </div>
            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All Branches</SelectItem>
                {branches.map((b: any) => (
                  <SelectItem key={b.id} value={b.name} className="text-white">{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="picker-dark bg-slate-800 border-slate-700 text-white" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-auto">
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
                {filtered.map((log: any) => (
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
    </div>
  );
}
