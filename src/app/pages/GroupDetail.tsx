import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '../components/ui/tabs';
import {
  ArrowLeft, Save, X, Edit3, Users, Camera, Shield, CalendarDays, Monitor, Plus, X as XIcon,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocalStorage } from '../lib/use-local-storage';
import type { Employee } from '../types';
import { employees as defaultEmployees } from '../data/staticData';

interface GroupMember {
  id: string;
  name: string;
  type: 'user' | 'device';
}

interface Group {
  id: string;
  name: string;
  type: 'user' | 'device' | 'ta' | 'access';
  description: string;
  memberCount: number;
  createdAt: string;
  members: GroupMember[];
  assignedRules: string[];
}

const mockGroups: Group[] = [
  { id: '1', name: 'IT Department', type: 'user', description: 'All IT staff members', memberCount: 8, createdAt: '2024-01-15', members: [{ id: 'u1', name: 'John Doe', type: 'user' }, { id: 'u2', name: 'Jane Smith', type: 'user' }], assignedRules: ['Server Room Access'] },
  { id: '2', name: 'HR Department', type: 'user', description: 'Human Resources team', memberCount: 5, createdAt: '2024-01-16', members: [{ id: 'u4', name: 'Sarah Wilson', type: 'user' }], assignedRules: ['Office Hours Only'] },
  { id: '3', name: 'Main Entrance Devices', type: 'device', description: 'All entrance control devices', memberCount: 4, createdAt: '2024-01-17', members: [{ id: 'd1', name: 'Front Door Cam 1', type: 'device' }, { id: 'd2', name: 'Front Door Cam 2', type: 'device' }], assignedRules: ['Business Hours'] },
  { id: '4', name: 'Server Room Devices', type: 'device', description: 'Server room access control', memberCount: 2, createdAt: '2024-01-18', members: [{ id: 'd4', name: 'Server Room Door', type: 'device' }], assignedRules: ['IT Staff Only'] },
  { id: '5', name: 'Management', type: 'user', description: 'Management team members', memberCount: 3, createdAt: '2024-01-19', members: [{ id: 'u6', name: 'CEO Office', type: 'user' }], assignedRules: ['Full Access'] },
  { id: '6', name: 'Morning Shift', type: 'ta', description: 'Morning attendance tracking group', memberCount: 12, createdAt: '2024-02-01', members: [{ id: 'u1', name: 'John Doe', type: 'user' }], assignedRules: ['Morning Check-in'] },
  { id: '7', name: 'Night Shift', type: 'ta', description: 'Night attendance tracking group', memberCount: 8, createdAt: '2024-02-02', members: [{ id: 'u4', name: 'Sarah Wilson', type: 'user' }], assignedRules: ['Night Check-in'] },
  { id: '8', name: 'Full Access Group', type: 'access', description: 'Employees with full building access', memberCount: 6, createdAt: '2024-02-10', members: [{ id: 'u6', name: 'CEO Office', type: 'user' }], assignedRules: ['24/7 Access'] },
  { id: '9', name: 'Restricted Access', type: 'access', description: 'Limited area access group', memberCount: 15, createdAt: '2024-02-11', members: [{ id: 'u2', name: 'Jane Smith', type: 'user' }], assignedRules: ['Office Hours Only'] },
];

export function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [groups, setGroups] = useLocalStorage<Group[]>('acs_groups', mockGroups);
  const [employees] = useLocalStorage<Employee[]>('acs_employees', defaultEmployees);

  const group = groups.find((g) => g.id === id);

  const [isEditing, setIsEditing] = useState(true);
  const [form, setForm] = useState<Partial<Group>>({});

  useEffect(() => {
    if (group) {
      setForm({ ...group });
    }
  }, [group]);

  if (!group) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Shield className="size-12 text-slate-500" />
        <h2 className="text-white text-xl font-semibold">Group Not Found</h2>
        <p className="text-slate-400">The group you are looking for does not exist.</p>
        <Button onClick={() => navigate('/groups')} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <ArrowLeft className="size-4" />
          Back to Groups
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    if (!form.name) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === group.id
          ? { ...g, name: form.name!, description: form.description || g.description, type: form.type || g.type }
          : g
      )
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...group });
    setIsEditing(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="size-4" />;
      case 'device': return <Camera className="size-4" />;
      case 'ta': return <CalendarDays className="size-4" />;
      case 'access': return <Shield className="size-4" />;
      default: return <Users className="size-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'user': return 'User Group';
      case 'device': return 'Device Group';
      case 'ta': return 'T&A Group';
      case 'access': return 'Access Group';
      default: return 'Group';
    }
  };

  const typeColor = {
    user: 'bg-blue-600',
    device: 'bg-green-600',
    ta: 'bg-orange-600',
    access: 'bg-purple-600',
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/groups')} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-white text-xl font-bold">{isEditing ? 'Edit Group' : 'Group Details'}</h1>
            <p className="text-slate-400 text-sm">{group.type === 'user' ? 'User Group' : 'Device Group'} • {group.memberCount} members</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                <X className="size-4" /> Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
                <Save className="size-4" /> Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
              <Edit3 className="size-4" /> Edit
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
        {/* Profile Card */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={cn('size-14 rounded-lg flex items-center justify-center shrink-0', typeColor[group.type])}>
                {getTypeIcon(group.type)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  {isEditing ? (
                    <Input
                      value={form.name || ''}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="text-xl font-bold bg-slate-800 border-slate-700 text-white max-w-sm"
                    />
                  ) : (
                    <h2 className="text-white text-2xl font-bold">{group.name}</h2>
                  )}
                  <Badge className={cn(typeColor[group.type], 'text-white')}>
                    <span className="flex items-center gap-1">{getTypeIcon(group.type)} {getTypeLabel(group.type)}</span>
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Description</p>
                    {isEditing ? (
                      <Input value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-slate-800 border-slate-700 text-white h-10 text-base" />
                    ) : (
                      <p className="text-white text-sm">{group.description}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Type</p>
                    {isEditing ? (
                      <Select value={form.type || ''} onValueChange={(v) => setForm({ ...form, type: v as any })}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-10 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="user" className="text-white">User Group</SelectItem>
                          <SelectItem value="device" className="text-white">Device Group</SelectItem>
                          <SelectItem value="ta" className="text-white">T&A Group</SelectItem>
                          <SelectItem value="access" className="text-white">Access Group</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-white text-sm">{getTypeLabel(group.type)}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Members</p>
                    <p className="text-white text-sm">{group.memberCount}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Created</p>
                    <p className="text-white text-sm">{group.createdAt}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="members" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Members</TabsTrigger>
            <TabsTrigger value="rules" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">Assigned Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-2">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  {group.type === 'user' ? <Users className="size-4 text-slate-400" /> : <Monitor className="size-4 text-slate-400" />}
                  Members ({group.members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {group.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className={cn('size-8 rounded-full flex items-center justify-center',
                          member.type === 'user' ? 'bg-blue-600/20' : 'bg-green-600/20')}
                        >
                          {member.type === 'user' ? <Users className="size-4 text-blue-400" /> : <Camera className="size-4 text-green-400" />}
                        </div>
                        <span className="text-white text-sm">{member.name}</span>
                        <Badge variant="outline" className="text-slate-300 border-slate-600 text-xs">
                          {member.type === 'user' ? 'User' : 'Device'}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-500 hover:text-red-400">
                        <XIcon className="size-3" />
                      </Button>
                    </div>
                  ))}
                  {group.members.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-4">No members in this group</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="mt-2">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <Shield className="size-4 text-slate-400" />
                  Assigned Rules ({group.assignedRules.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {group.assignedRules.map((rule) => (
                    <div key={rule} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-800">
                      <span className="text-white text-sm">{rule}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-500 hover:text-red-400">
                        <XIcon className="size-3" />
                      </Button>
                    </div>
                  ))}
                  {group.assignedRules.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-4">No rules assigned</p>
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
