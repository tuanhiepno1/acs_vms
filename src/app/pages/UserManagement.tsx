import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { StatBar } from '../components/StatBar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import {
  Search, Edit, Trash2, UserPlus, ImagePlus,
  Download, Users, UserCheck, UserX, ShieldAlert,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { employees as staticEmployees, branches as staticBranches } from '../data/staticData';
import type { Employee } from '../types';

const fmt = (iso?: string) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
};

const emptyForm = { name: '', employeeNo: '', branch: '', image: '', validity: 'valid' as 'valid' | 'expired' | 'suspended' };

export function UserManagement() {
  const [list, setList] = useState<Employee[]>(staticEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValidity, setFilterValidity] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = list.filter((e) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = e.name.toLowerCase().includes(q) || e.employeeNo.toLowerCase().includes(q) || e.branch.toLowerCase().includes(q);
    const matchesValidity = filterValidity === 'all' || e.validity === filterValidity;
    const matchesBranch = filterBranch === 'all' || e.branch === filterBranch;
    return matchesSearch && matchesValidity && matchesBranch;
  });

  const stats = {
    total: list.length,
    valid: list.filter((e) => e.validity === 'valid').length,
    expired: list.filter((e) => e.validity === 'expired').length,
    suspended: list.filter((e) => e.validity === 'suspended').length,
  };

  const openAdd = () => { setForm(emptyForm); setIsAddOpen(true); };
  const openEdit = (e: Employee) => { setForm({ name: e.name, employeeNo: e.employeeNo, branch: e.branch, image: e.image || '', validity: e.validity }); setEditTarget(e); };

  const handleAdd = () => {
    if (!form.name || !form.employeeNo) return;
    const emp: Employee = {
      id: `EMP-${Date.now()}`,
      name: form.name,
      employeeNo: form.employeeNo,
      branch: form.branch || staticBranches[0]?.name || '',
      image: form.image || undefined,
      validity: form.validity,
      registeredAt: new Date().toISOString(),
    };
    setList((prev) => [emp, ...prev]);
    setIsAddOpen(false);
    setForm(emptyForm);
  };

  const handleEdit = () => {
    if (!editTarget || !form.name) return;
    setList((prev) => prev.map((e) =>
      e.id === editTarget.id ? { ...e, name: form.name, employeeNo: form.employeeNo || e.employeeNo, branch: form.branch || e.branch, image: form.image || e.image, validity: form.validity } : e
    ));
    setEditTarget(null);
    setForm(emptyForm);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setList((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const formFields = (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label className="text-slate-200">Photo</Label>
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border-2 border-slate-700">
            <AvatarImage src={form.image} />
            <AvatarFallback className="bg-slate-800 text-slate-400"><ImagePlus className="size-6" /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <Button type="button" variant="outline" size="sm" className="border-slate-700 text-slate-200" onClick={() => fileInputRef.current?.click()}>Choose Image</Button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
            <p className="text-slate-500 text-xs">JPG, PNG up to 2MB</p>
          </div>
        </div>
      </div>
      <div className="grid gap-2">
        <Label className="text-slate-200">Employee Name</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="bg-slate-800 border-slate-700 text-white" />
      </div>
      <div className="grid gap-2">
        <Label className="text-slate-200">Employee No</Label>
        <Input value={form.employeeNo} onChange={(e) => setForm({ ...form, employeeNo: e.target.value })} placeholder="E011" className="bg-slate-800 border-slate-700 text-white" />
      </div>
      <div className="grid gap-2">
        <Label className="text-slate-200">Branch</Label>
        <Select value={form.branch} onValueChange={(v) => setForm({ ...form, branch: v })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select branch" /></SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {staticBranches.map((b) => (
              <SelectItem key={b.id} value={b.name} className="text-white">{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label className="text-slate-200">Validity</Label>
        <Select value={form.validity} onValueChange={(v) => setForm({ ...form, validity: v as 'valid' | 'expired' | 'suspended' })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select validity" /></SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="valid" className="text-white">Valid</SelectItem>
            <SelectItem value="expired" className="text-white">Expired</SelectItem>
            <SelectItem value="suspended" className="text-white">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">User Management</h1>
          <p className="text-slate-400 text-sm">Manage employee registration and access validity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-white text-slate-800 hover:bg-slate-100 border-0">
            <Download className="size-4" />
            Export
          </Button>
          <Button onClick={openAdd} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
            <UserPlus className="size-4" />
            Add User
          </Button>
        </div>
      </div>

      <StatBar items={[
        { label: 'Total', value: stats.total },
        { label: 'Valid', value: stats.valid, color: 'green' },
        { label: 'Expired', value: stats.expired, color: 'red' },
        { label: 'Suspended', value: stats.suspended, color: 'yellow' },
      ]} />

      {/* Main Table */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-white">Employee List</CardTitle>
                <CardDescription className="text-slate-400">Showing {filtered.length} employees</CardDescription>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <Input placeholder="Search name, employee no, branch..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-slate-800 border-slate-700 text-white" />
              </div>
              <Select value={filterValidity} onValueChange={setFilterValidity}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Validity" /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Status</SelectItem>
                  <SelectItem value="valid" className="text-white">Valid</SelectItem>
                  <SelectItem value="expired" className="text-white">Expired</SelectItem>
                  <SelectItem value="suspended" className="text-white">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterBranch} onValueChange={setFilterBranch}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Branch" /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Branches</SelectItem>
                  {staticBranches.map((b) => (
                    <SelectItem key={b.id} value={b.name} className="text-white">{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow className="border-slate-800 bg-slate-800/40 hover:bg-slate-800/40">
                    <TableHead className="text-center text-slate-300 font-semibold">Photo</TableHead>
                    <TableHead className="text-center text-slate-300 font-semibold">Employee</TableHead>
                    <TableHead className="text-center text-slate-300 font-semibold">Employee No</TableHead>
                    <TableHead className="text-center text-slate-300 font-semibold">Branch</TableHead>
                    <TableHead className="text-center text-slate-300 font-semibold">Validity</TableHead>
                    <TableHead className="text-center text-slate-300 font-semibold">Last Auth</TableHead>
                    <TableHead className="text-center text-slate-300 font-semibold">Registered</TableHead>
                    <TableHead className="text-center text-slate-300 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((emp) => (
                    <TableRow key={emp.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="text-center">
                        <Avatar className="size-10 mx-auto">
                          <AvatarImage src={emp.image} />
                          <AvatarFallback className="bg-blue-600 text-white">{emp.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="text-center text-white font-medium">{emp.name}</TableCell>
                      <TableCell className="text-center text-slate-400 font-mono">{emp.employeeNo}</TableCell>
                      <TableCell className="text-center text-slate-400">{emp.branch}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn(
                          emp.validity === 'valid' && 'border-green-600 bg-green-600/20 text-green-400',
                          emp.validity === 'expired' && 'border-red-600 bg-red-600/20 text-red-400',
                          emp.validity === 'suspended' && 'border-yellow-600 bg-yellow-600/20 text-yellow-400',
                        )}>
                          {emp.validity.charAt(0).toUpperCase() + emp.validity.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-slate-400 text-sm">{fmt(emp.lastAuthTime)}</TableCell>
                      <TableCell className="text-center text-slate-400 text-sm">{fmt(emp.registeredAt)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-400 hover:bg-slate-800" onClick={() => openEdit(emp)}>
                            <Edit className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400 hover:bg-slate-800" onClick={() => setDeleteTarget(emp)}>
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

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Employee</DialogTitle>
            <DialogDescription className="text-slate-400">Register a new employee for face access</DialogDescription>
          </DialogHeader>
          {formFields}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="border-slate-700 text-slate-200">Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name || !form.employeeNo} className="bg-white text-slate-800 hover:bg-slate-100">Register</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null); }}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Employee</DialogTitle>
            <DialogDescription className="text-slate-400">Update employee information</DialogDescription>
          </DialogHeader>
          {formFields}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)} className="border-slate-700 text-slate-200">Cancel</Button>
            <Button onClick={handleEdit} className="bg-white text-slate-800 hover:bg-slate-100">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Employee</DialogTitle>
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
