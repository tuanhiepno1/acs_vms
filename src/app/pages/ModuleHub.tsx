import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogOut, Plus, ShieldCheck, Trash2, UserCog, Video } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useAuth } from '../contexts/AuthContext';
import type { ModuleId } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface ModuleDef {
  id: ModuleId;
  name: string;
  description: string;
  icon: typeof ShieldCheck;
  href: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  hoverBorder: string;
  shadow: string;
  gradient: string;
}

const modules: ModuleDef[] = [
  {
    id: 'acs',
    name: 'Teampl ACS',
    description:
      'Face recognition access management, door control, user management, and detailed reporting.',
    icon: ShieldCheck,
    href: '/acs',
    iconBg: 'bg-blue-600/15',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-600/30',
    hoverBorder: 'hover:border-blue-500/50',
    shadow: 'shadow-blue-600/20',
    gradient: 'from-blue-600 to-blue-700',
  },
  {
    id: 'vms',
    name: 'Teampl VMS',
    description:
      'Live camera monitoring, video recording playback, event detection, and visual analytics.',
    icon: Video,
    href: '/vms',
    iconBg: 'bg-violet-600/15',
    iconColor: 'text-violet-400',
    borderColor: 'border-violet-600/30',
    hoverBorder: 'hover:border-violet-500/50',
    shadow: 'shadow-violet-600/20',
    gradient: 'from-violet-600 to-violet-700',
  },
];

const EMPTY_FORM = {
  username: '',
  password: '',
  displayName: '',
  role: 'Operator',
  acs: true,
  vms: false,
};

export default function ModuleHub() {
  const {
    user,
    logout,
    hasModule,
    isAdmin,
    accounts,
    addAccount,
    updateAccountModules,
    deleteAccount,
  } = useAuth();
  const navigate = useNavigate();

  // Admin panel state
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const handleAdd = () => {
    const mods: ModuleId[] = [];
    if (form.acs) mods.push('acs');
    if (form.vms) mods.push('vms');

    const result = addAccount({
      username: form.username,
      password: form.password,
      displayName: form.displayName,
      role: form.role,
      licensedModules: mods,
    });

    if (result.success) {
      setAddOpen(false);
      setForm(EMPTY_FORM);
      setFormError('');
    } else {
      setFormError(result.error ?? 'Failed to create account');
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteAccount(deleteTarget);
    setDeleteTarget(null);
  };

  const toggleModule = (username: string, moduleId: ModuleId, currentModules: ModuleId[]) => {
    const has = currentModules.includes(moduleId);
    const updated = has
      ? currentModules.filter((m) => m !== moduleId)
      : [...currentModules, moduleId];
    updateAccountModules(username, updated);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600">
            <ShieldCheck className="size-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-white">Teampl</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-400 sm:inline">
            {user?.displayName}{' '}
            <span className="text-slate-600">·</span>{' '}
            <span className="text-slate-500">{user?.role}</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="gap-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          {/* Module selection */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Select Module</h1>
            <p className="mt-2 text-sm text-slate-400">Choose a module to get started</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {modules.map((mod) => {
              const licensed = hasModule(mod.id);
              const Icon = mod.icon;

              return (
                <button
                  key={mod.id}
                  onClick={() => licensed && navigate(mod.href)}
                  disabled={!licensed}
                  className={cn(
                    'group relative rounded-2xl border bg-slate-900 p-6 text-left transition-all',
                    licensed
                      ? `${mod.borderColor} ${mod.hoverBorder} hover:shadow-lg ${mod.shadow} cursor-pointer`
                      : 'border-slate-800 opacity-50 cursor-not-allowed',
                  )}
                >
                  {!licensed && (
                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                      <Lock className="size-3" />
                      Locked
                    </div>
                  )}

                  <div
                    className={cn(
                      'flex size-12 items-center justify-center rounded-xl',
                      mod.iconBg,
                    )}
                  >
                    <Icon className={cn('size-6', mod.iconColor)} />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-white">{mod.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{mod.description}</p>

                  {licensed && (
                    <div
                      className={cn(
                        'mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium text-white',
                        mod.gradient,
                      )}
                    >
                      Open Module
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Admin: Account Management */}
          {isAdmin && (
            <div className="mt-12">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-amber-600/15">
                    <UserCog className="size-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Account Management</h2>
                    <p className="text-sm text-slate-400">Manage accounts and module permissions</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setForm(EMPTY_FORM);
                    setFormError('');
                    setAddOpen(true);
                  }}
                  className="gap-2 bg-white text-slate-900 hover:bg-slate-100"
                >
                  <Plus className="size-4" />
                  Add Account
                </Button>
              </div>

              <Card className="overflow-hidden bg-slate-900 border-slate-800">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[600px]">
                      <TableHeader>
                        <TableRow className="border-slate-800 bg-slate-800/40 hover:bg-slate-800/40">
                          <TableHead className="text-slate-300 font-semibold">User</TableHead>
                          <TableHead className="text-slate-300 font-semibold">Role</TableHead>
                          <TableHead className="text-center text-slate-300 font-semibold">ACS</TableHead>
                          <TableHead className="text-center text-slate-300 font-semibold">VMS</TableHead>
                          <TableHead className="text-right text-slate-300 font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accounts.map((acc) => {
                          const isSelf = acc.username === user?.username;
                          return (
                            <TableRow key={acc.username} className="border-slate-800 hover:bg-slate-800/30">
                              <TableCell>
                                <div>
                                  <p className="font-medium text-white">{acc.displayName}</p>
                                  <p className="text-sm text-slate-500">@{acc.username}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    acc.role === 'Administrator'
                                      ? 'border-amber-600/50 bg-amber-600/15 text-amber-300'
                                      : acc.role === 'Operator'
                                        ? 'border-blue-600/50 bg-blue-600/15 text-blue-300'
                                        : 'border-slate-600 bg-slate-700/40 text-slate-300',
                                  )}
                                >
                                  {acc.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <Switch
                                  checked={acc.licensedModules.includes('acs')}
                                  onCheckedChange={() =>
                                    toggleModule(acc.username, 'acs', acc.licensedModules)
                                  }
                                  disabled={isSelf}
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Switch
                                  checked={acc.licensedModules.includes('vms')}
                                  onCheckedChange={() =>
                                    toggleModule(acc.username, 'vms', acc.licensedModules)
                                  }
                                  disabled={isSelf}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isSelf}
                                  onClick={() => setDeleteTarget(acc.username)}
                                  className="text-slate-400 hover:text-red-400 hover:bg-slate-800 disabled:opacity-30"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Add Account Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Account</DialogTitle>
            <DialogDescription className="text-slate-400">
              Create a new user account and assign module permissions.
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="rounded-lg border border-red-800/50 bg-red-950/50 px-4 py-3 text-sm text-red-300">
              {formError}
            </div>
          )}

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label className="text-slate-200">Display Name</Label>
              <Input
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                placeholder="Jane Smith"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Username</Label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="jane_smith"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Administrator" className="text-white">Administrator</SelectItem>
                  <SelectItem value="Operator" className="text-white">Operator</SelectItem>
                  <SelectItem value="Viewer" className="text-white">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label className="text-slate-200">Module Access</Label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <Switch
                    checked={form.acs}
                    onCheckedChange={(v) => setForm({ ...form, acs: v })}
                  />
                  ACS
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <Switch
                    checked={form.vms}
                    onCheckedChange={(v) => setForm({ ...form, vms: v })}
                  />
                  VMS
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              className="border-slate-700 text-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.username || !form.password || !form.displayName}
              className="bg-white text-slate-900 hover:bg-slate-100"
            >
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Account</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete{' '}
              <span className="font-medium text-white">
                @{deleteTarget}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="border-slate-700 text-slate-200"
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
