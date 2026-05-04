import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Label } from '../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  ArrowLeft, Save, X, Edit3, ImagePlus, Fingerprint, ScanFace, KeyRound,
  Briefcase, User, HardHat, Clock, Shield, CheckCircle, AlertCircle,
  FolderOpen, LogIn, Lock, Unlock,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocalStorage } from '../lib/use-local-storage';
import { employees as staticEmployees, branches as defaultBranches } from '../data/staticData';
import type { Employee } from '../types';

interface Group {
  id: string;
  name: string;
  type: 'user' | 'device';
}

const fmt = (iso?: string) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
};

const fmtDate = (iso?: string) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(iso));
};

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [list, setList] = useLocalStorage<Employee[]>('acs_employees', staticEmployees);
  const [branchList] = useLocalStorage('acs_branches', defaultBranches);
  const [groups] = useLocalStorage<Group[]>('acs_groups', []);

  const user = list.find((e) => e.id === id);

  const [isEditing, setIsEditing] = useState(true);
  const [form, setForm] = useState<Partial<Employee>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setForm({ ...user });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <AlertCircle className="size-12 text-slate-500" />
        <h2 className="text-white text-xl font-semibold">User Not Found</h2>
        <p className="text-slate-400">The user you are looking for does not exist.</p>
        <Button onClick={() => navigate('/users')} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <ArrowLeft className="size-4" />
          Back to Users
        </Button>
      </div>
    );
  }

  const computeValidity = (from?: string, until?: string): 'valid' | 'expired' | 'suspended' => {
    const now = new Date();
    const start = from ? new Date(from) : null;
    const end = until ? new Date(until) : null;
    if (start && now < start) return 'suspended';
    if (end && now > end) return 'expired';
    return 'valid';
  };

  const handleSave = () => {
    if (!form.name || !form.employeeNo) return;
    const validity = computeValidity(form.validFrom, form.validUntil);
    setList((prev) =>
      prev.map((e) =>
        e.id === user.id
          ? {
              ...e,
              name: form.name!,
              employeeNo: form.employeeNo!,
              branch: form.branch || e.branch,
              image: form.authMethod === 'face' ? (form.image || e.image) : e.image,
              role: form.role || e.role,
              validity,
              validFrom: form.validFrom,
              validUntil: form.validUntil || e.validUntil,
              authMethod: form.authMethod || e.authMethod,
              authData: form.authMethod === 'passcode' ? (form.authData || e.authData) : e.authData,
              groupIds: form.groupIds || e.groupIds,
            }
          : e
      )
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...user });
    setIsEditing(false);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const roleConfig = {
    employee: { icon: Briefcase, color: 'blue', bg: 'bg-blue-600/20', text: 'text-blue-400', border: 'border-blue-600' },
    visitor: { icon: User, color: 'purple', bg: 'bg-purple-600/20', text: 'text-purple-400', border: 'border-purple-600' },
    contractor: { icon: HardHat, color: 'orange', bg: 'bg-orange-600/20', text: 'text-orange-400', border: 'border-orange-600' },
  };

  const validityConfig = {
    valid: { icon: CheckCircle, color: 'green', bg: 'bg-green-600/20', text: 'text-green-400', border: 'border-green-600' },
    expired: { icon: AlertCircle, color: 'red', bg: 'bg-red-600/20', text: 'text-red-400', border: 'border-red-600' },
    suspended: { icon: Clock, color: 'yellow', bg: 'bg-yellow-600/20', text: 'text-yellow-400', border: 'border-yellow-600' },
  };

  const currentRole = form.role || user.role;
  const currentValidity = form.validity || user.validity;
  const roleCfg = roleConfig[currentRole];
  const valCfg = validityConfig[currentValidity];
  const RoleIcon = roleCfg.icon;
  const ValidIcon = valCfg.icon;

  return (
    <div className="h-full overflow-hidden flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/users')} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-white text-xl font-bold">{isEditing ? 'Edit User' : 'User Details'}</h1>
            <p className="text-slate-400 text-sm">{user.employeeNo} • {user.branch}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                <X className="size-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
                <Save className="size-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
              <Edit3 className="size-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
        {/* Profile Card */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="size-28 border-3 border-slate-500 shadow-lg">
                  <AvatarImage src={isEditing ? (form.image || undefined) : user.image} />
                  <AvatarFallback className="bg-blue-600 text-white text-3xl font-bold">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 size-8 rounded-full bg-slate-800 border border-slate-500 text-slate-200 flex items-center justify-center hover:bg-slate-700 hover:text-white shadow-md transition-colors"
                    title="Change photo"
                  >
                    <ImagePlus className="size-4" />
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  {isEditing ? (
                    <Input
                      value={form.name || ''}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="text-xl font-bold bg-slate-800 border-slate-700 text-white max-w-sm"
                    />
                  ) : (
                    <h2 className="text-white text-2xl font-bold">{user.name}</h2>
                  )}
                  <Badge variant="outline" className={cn('gap-1', valCfg.border, valCfg.bg, valCfg.text)}>
                    <ValidIcon className="size-3" />
                    {currentValidity.charAt(0).toUpperCase() + currentValidity.slice(1)}
                  </Badge>
                  <Badge variant="outline" className={cn('gap-1', roleCfg.border, roleCfg.bg, roleCfg.text)}>
                    <RoleIcon className="size-3" />
                    {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">User No</p>
                    {isEditing ? (
                      <Input value={form.employeeNo || ''} onChange={(e) => setForm({ ...form, employeeNo: e.target.value })} className="bg-slate-800 border-slate-700 text-white h-10 text-base" />
                    ) : (
                      <p className="text-white font-mono text-base">{user.employeeNo}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">Branch</p>
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
                      <p className="text-white text-base">{user.branch}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">Valid From</p>
                    {isEditing ? (
                      <Input type="date" value={form.validFrom || ''} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} className="bg-slate-800 border-slate-700 text-white h-10 text-base" />
                    ) : (
                      <p className="text-white text-base">{fmtDate(user.validFrom)}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">Valid Until</p>
                    {isEditing ? (
                      <Input type="date" value={form.validUntil || ''} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="bg-slate-800 border-slate-700 text-white h-10 text-base" />
                    ) : (
                      <p className="text-white text-base">{fmtDate(user.validUntil) || 'Permanent'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="details" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Details</TabsTrigger>
            <TabsTrigger value="access" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Access History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-2 space-y-2">
            {/* Access Settings - merged */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <Shield className="size-4 text-slate-400" />
                  Access Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider text-slate-500">Auth Method</Label>
                    {isEditing ? (
                      <Select value={form.authMethod || 'placeholder'} onValueChange={(v) => setForm({ ...form, authMethod: v === 'placeholder' ? undefined : v as 'face' | 'fingerprint' | 'passcode' })}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1.5 h-10 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="placeholder" disabled className="text-slate-500">Select method</SelectItem>
                          <SelectItem value="face" className="text-white"><span className="flex items-center gap-2"><ScanFace className="size-4" />Face Scan</span></SelectItem>
                          <SelectItem value="fingerprint" className="text-white"><span className="flex items-center gap-2"><Fingerprint className="size-4" />Fingerprint</span></SelectItem>
                          <SelectItem value="passcode" className="text-white"><span className="flex items-center gap-2"><KeyRound className="size-4" />Passcode</span></SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 mt-1.5">
                        {user.authMethod === 'face' && <ScanFace className="size-5 text-blue-400" />}
                        {user.authMethod === 'fingerprint' && <Fingerprint className="size-5 text-blue-400" />}
                        {user.authMethod === 'passcode' && <KeyRound className="size-5 text-blue-400" />}
                        <span className="text-white text-base capitalize">{user.authMethod || 'None'}</span>
                      </div>
                    )}
                  </div>
                  {user.authMethod === 'passcode' && (
                    <div>
                      <Label className="text-xs font-medium uppercase tracking-wider text-slate-500">Passcode</Label>
                      {isEditing ? (
                        <Input value={form.authData || ''} onChange={(e) => setForm({ ...form, authData: e.target.value })} type="password" maxLength={6} className="bg-slate-800 border-slate-700 text-white mt-1.5 h-10 text-base" />
                      ) : (
                        <p className="text-white font-mono mt-1.5 text-base">••••••</p>
                      )}
                    </div>
                  )}
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider text-slate-500">Role</Label>
                    {isEditing ? (
                      <Select value={form.role || ''} onValueChange={(v) => setForm({ ...form, role: v as 'employee' | 'visitor' | 'contractor' })}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1.5 h-10 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="employee" className="text-white"><span className="flex items-center gap-2"><Briefcase className="size-4" />Employee</span></SelectItem>
                          <SelectItem value="visitor" className="text-white"><span className="flex items-center gap-2"><User className="size-4" />Visitor</span></SelectItem>
                          <SelectItem value="contractor" className="text-white"><span className="flex items-center gap-2"><HardHat className="size-4" />Contractor</span></SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 mt-1.5">
                        <RoleIcon className={cn('size-5', roleCfg.text)} />
                        <span className="text-white text-base capitalize">{currentRole}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Groups */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <FolderOpen className="size-4 text-slate-400" />
                  Assigned Groups
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {groups.filter((g) => g.type === 'user').length === 0 ? (
                      <span className="text-slate-500 text-sm">No user groups available</span>
                    ) : (
                      groups
                        .filter((g) => g.type === 'user')
                        .map((g) => (
                          <label key={g.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded cursor-pointer hover:bg-slate-700">
                            <input
                              type="checkbox"
                              checked={(form.groupIds || []).includes(g.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setForm({ ...form, groupIds: [...(form.groupIds || []), g.id] });
                                } else {
                                  setForm({ ...form, groupIds: (form.groupIds || []).filter((id) => id !== g.id) });
                                }
                              }}
                              className="size-4 accent-blue-500"
                            />
                            <span className="text-slate-200 text-sm">{g.name}</span>
                          </label>
                        ))
                    )}
                  </div>
                ) : user.groupIds && user.groupIds.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.groupIds.map((gid) => {
                      const group = groups.find((g) => g.id === gid);
                      return group ? (
                        <Badge key={gid} variant="outline" className="border-blue-600/50 bg-blue-600/15 text-blue-300 text-sm">
                          <FolderOpen className="size-3 mr-1" />
                          {group.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Not assigned to any group</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="mt-2">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <LogIn className="size-4 text-slate-400" />
                  Recent Access Events
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  {user.lastAuthTime ? (
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="size-10 rounded-full bg-green-600/20 flex items-center justify-center">
                        <CheckCircle className="size-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">Access Granted</p>
                        <p className="text-slate-400 text-xs">{fmt(user.lastAuthTime)}</p>
                      </div>
                      <Badge variant="outline" className="border-green-600 bg-green-600/10 text-green-400">
                        Granted
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="size-10 rounded-full bg-slate-700/50 flex items-center justify-center">
                        <Clock className="size-5 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">No access recorded</p>
                        <p className="text-slate-400 text-xs">User has not used any access points yet</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
