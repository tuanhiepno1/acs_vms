import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { StatBar } from '../components/StatBar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Users,
  Camera,
  Edit,
  Trash2,
  Phone,
  Mail,
  Activity,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';
import { useLocalStorage } from '../lib/use-local-storage';
import { branches as staticBranches } from '../data/staticData';
import type { Branch } from '../types';

export function Branches() {
  const [branches, setBranches] = useLocalStorage<Branch[]>('acs_branches', staticBranches);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [deleteBranch, setDeleteBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '', manager: '' });

  const resetForm = () => setForm({ name: '', address: '', phone: '', email: '', manager: '' });
  const openAdd = () => { resetForm(); setIsAddDialogOpen(true); };
  const openEdit = (b: Branch) => { setForm({ name: b.name, address: b.address, phone: b.phone, email: b.email, manager: b.manager }); setEditBranch(b); };

  const handleAdd = () => {
    if (!form.name) return;
    setBranches(prev => [{ id: Date.now().toString(), name: form.name, address: form.address, contact: form.manager, phone: form.phone, email: form.email, manager: form.manager, employees: 0, deviceCount: 0, devices: 0, status: 'active' as const }, ...prev]);
    setIsAddDialogOpen(false); resetForm();
  };
  const handleEdit = () => {
    if (!editBranch || !form.name) return;
    setBranches(prev => prev.map(b => b.id === editBranch.id ? { ...b, name: form.name, address: form.address, phone: form.phone, email: form.email, manager: form.manager } : b));
    setEditBranch(null); resetForm();
  };
  const handleDelete = () => {
    if (!deleteBranch) return;
    setBranches(prev => prev.filter(b => b.id !== deleteBranch.id));
    setDeleteBranch(null);
  };

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: branches.length,
    active: branches.filter((b) => b.status === 'active').length,
    employees: branches.reduce((acc, b) => acc + b.employees, 0),
    devices: branches.reduce((acc, b) => acc + b.devices, 0),
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Office Management</h1>
          <p className="text-slate-400 text-sm">Manage company office locations</p>
        </div>
        <Button onClick={openAdd} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <Plus className="size-4" />
          Add Office
        </Button>
      </div>

      <StatBar items={[
        { label: 'Offices', value: `${stats.total} (${stats.active} active)` },
        { label: 'Employees', value: stats.employees, color: 'blue' },
        { label: 'Devices', value: stats.devices, color: 'blue' },
        { label: 'Avg/Office', value: Math.round(stats.employees / stats.total) },
      ]} />

      {/* Search */}
      <div className="flex-1 min-h-0 overflow-y-auto">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="text-white">Office List</CardTitle>
              <CardDescription className="text-slate-400">Showing {filteredBranches.length} offices</CardDescription>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <Input
              placeholder="Search offices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBranches.map((branch) => (
              <Card key={branch.id} className="bg-slate-950 border-slate-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="size-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                        <Building2 className="size-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{branch.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              branch.status === 'active'
                                ? 'border-green-600 bg-green-600/20 text-green-400'
                                : 'border-red-600 bg-red-600/20 text-red-400'
                            )}
                          >
                            {branch.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="default" size="sm" className="gap-1.5 bg-slate-800 text-white hover:bg-slate-700 border border-slate-700" onClick={() => openEdit(branch)}>
                        <Edit className="size-3.5" />
                        Edit
                      </Button>
                      <Button variant="default" size="sm" className="gap-1.5 bg-slate-800 text-white hover:bg-red-900/50 hover:text-red-400 border border-slate-700" onClick={() => setDeleteBranch(branch)}>
                        <Trash2 className="size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-slate-400">
                    <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="size-4" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="size-4" />
                    <span>{branch.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="size-4" />
                    <span>Manager: {branch.manager}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                    <div>
                      <p className="text-slate-500">Employees</p>
                      <p className="text-white">{branch.employees}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Devices</p>
                      <p className="text-white">{branch.devices}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader><DialogTitle className="text-white">Add New Office</DialogTitle><DialogDescription className="text-slate-400">Enter new office information</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label className="text-slate-200">Office Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="New York Office" className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Address</Label><Textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Enter address" className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Phone</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 (212) 555-0123" className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Email</Label><Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" placeholder="office@company.com" className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Manager</Label><Input value={form.manager} onChange={e => setForm({...form, manager: e.target.value})} placeholder="John Doe" className="bg-slate-800 border-slate-700 text-white" /></div>
          </div>
          <DialogFooter><Button variant="secondary" onClick={() => setIsAddDialogOpen(false)} className="bg-slate-700 text-white hover:bg-slate-600">Cancel</Button><Button onClick={handleAdd} className="bg-white text-slate-800 hover:bg-slate-100">Add Office</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editBranch} onOpenChange={open => { if (!open) setEditBranch(null); }}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader><DialogTitle className="text-white">Edit Office</DialogTitle><DialogDescription className="text-slate-400">Update office information</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label className="text-slate-200">Office Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Address</Label><Textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Phone</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Email</Label><Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-slate-800 border-slate-700 text-white" /></div>
            <div className="grid gap-2"><Label className="text-slate-200">Manager</Label><Input value={form.manager} onChange={e => setForm({...form, manager: e.target.value})} className="bg-slate-800 border-slate-700 text-white" /></div>
          </div>
          <DialogFooter><Button variant="secondary" onClick={() => setEditBranch(null)} className="bg-slate-700 text-white hover:bg-slate-600">Cancel</Button><Button onClick={handleEdit} className="bg-white text-slate-800 hover:bg-slate-100">Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteBranch} onOpenChange={open => { if (!open) setDeleteBranch(null); }}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader><DialogTitle className="text-white">Delete Office</DialogTitle><DialogDescription className="text-slate-400">Are you sure you want to delete <span className="text-white font-medium">{deleteBranch?.name}</span>? This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="secondary" onClick={() => setDeleteBranch(null)} className="bg-slate-700 text-white hover:bg-slate-600">Cancel</Button><Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
