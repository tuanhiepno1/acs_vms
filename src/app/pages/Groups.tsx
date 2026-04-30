import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Camera,
  Shield,
  UserPlus,
  Monitor,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocalStorage } from '../lib/use-local-storage';

interface GroupMember {
  id: string;
  name: string;
  type: 'user' | 'device';
}

interface Group {
  id: string;
  name: string;
  type: 'user' | 'device';
  description: string;
  memberCount: number;
  createdAt: string;
  members: GroupMember[];
  assignedRules: string[];
}

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'IT Department',
    type: 'user',
    description: 'All IT staff members',
    memberCount: 8,
    createdAt: '2024-01-15',
    members: [
      { id: 'u1', name: 'John Doe', type: 'user' },
      { id: 'u2', name: 'Jane Smith', type: 'user' },
      { id: 'u3', name: 'Mike Johnson', type: 'user' },
    ],
    assignedRules: ['Server Room Access', 'After Hours Access'],
  },
  {
    id: '2',
    name: 'HR Department',
    type: 'user',
    description: 'Human Resources team',
    memberCount: 5,
    createdAt: '2024-01-16',
    members: [
      { id: 'u4', name: 'Sarah Wilson', type: 'user' },
      { id: 'u5', name: 'Tom Brown', type: 'user' },
    ],
    assignedRules: ['Office Hours Only'],
  },
  {
    id: '3',
    name: 'Main Entrance Devices',
    type: 'device',
    description: 'All entrance control devices',
    memberCount: 4,
    createdAt: '2024-01-17',
    members: [
      { id: 'd1', name: 'Front Door Cam 1', type: 'device' },
      { id: 'd2', name: 'Front Door Cam 2', type: 'device' },
      { id: 'd3', name: 'Side Entrance Cam', type: 'device' },
    ],
    assignedRules: ['Business Hours', 'Visitor Policy'],
  },
  {
    id: '4',
    name: 'Server Room Devices',
    type: 'device',
    description: 'Server room access control',
    memberCount: 2,
    createdAt: '2024-01-18',
    members: [
      { id: 'd4', name: 'Server Room Door', type: 'device' },
      { id: 'd5', name: 'Backup Room Door', type: 'device' },
    ],
    assignedRules: ['IT Staff Only', '24/7 Access'],
  },
  {
    id: '5',
    name: 'Management',
    type: 'user',
    description: 'Management team members',
    memberCount: 3,
    createdAt: '2024-01-19',
    members: [
      { id: 'u6', name: 'CEO Office', type: 'user' },
      { id: 'u7', name: 'CTO Office', type: 'user' },
    ],
    assignedRules: ['Full Access', 'Priority Access'],
  },
];

const availableUsers = [
  { id: 'u1', name: 'John Doe' },
  { id: 'u2', name: 'Jane Smith' },
  { id: 'u3', name: 'Mike Johnson' },
  { id: 'u4', name: 'Sarah Wilson' },
  { id: 'u5', name: 'Tom Brown' },
  { id: 'u6', name: 'Emily Davis' },
  { id: 'u7', name: 'David Lee' },
  { id: 'u8', name: 'Lisa Chen' },
];

const availableDevices = [
  { id: 'd1', name: 'Front Door Cam 1' },
  { id: 'd2', name: 'Front Door Cam 2' },
  { id: 'd3', name: 'Side Entrance Cam' },
  { id: 'd4', name: 'Server Room Door' },
  { id: 'd5', name: 'Backup Room Door' },
  { id: 'd6', name: 'Office A Door' },
  { id: 'd7', name: 'Office B Door' },
];

const availableRules = [
  'Server Room Access',
  'After Hours Access',
  'Office Hours Only',
  'Business Hours',
  'Visitor Policy',
  'IT Staff Only',
  '24/7 Access',
  'Full Access',
  'Priority Access',
];

export function Groups() {
  const [groups, setGroups] = useLocalStorage<Group[]>('acs_groups', mockGroups);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const filtered = groups.filter((group) => {
    const matchSearch = group.name.toLowerCase().includes(search.toLowerCase()) ||
                      group.description.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || group.type === filterType;
    const matchTab = activeTab === 'all' || group.type === activeTab;
    return matchSearch && matchType && matchTab;
  });

  const handleDelete = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
  };

  const getTypeIcon = (type: string) => {
    return type === 'user' ? <Users className="size-4" /> : <Camera className="size-4" />;
  };

  const getTypeLabel = (type: string) => {
    return type === 'user' ? 'User Group' : 'Device Group';
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Groups</h1>
          <p className="text-slate-400 text-sm">Manage user groups and device groups</p>
        </div>
        <Button onClick={() => { setEditingGroup(null); setIsAddOpen(true); }} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <Plus className="size-4" />
          Add Group
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col">
        <TabsList className="bg-slate-800 border border-slate-700 w-fit">
          <TabsTrigger value="all" className="data-[state=active]:bg-slate-700 text-slate-300">All Groups</TabsTrigger>
          <TabsTrigger value="user" className="data-[state=active]:bg-slate-700 text-slate-300">User Groups</TabsTrigger>
          <TabsTrigger value="device" className="data-[state=active]:bg-slate-700 text-slate-300">Device Groups</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="flex-1 min-h-0 mt-3">
          <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                  <Input placeholder="Search groups..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-slate-800 border-slate-700 text-white" />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-white">All Types</SelectItem>
                    <SelectItem value="user" className="text-white">User Groups</SelectItem>
                    <SelectItem value="device" className="text-white">Device Groups</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-auto">
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow className="border-slate-800 bg-slate-800/40 hover:bg-slate-800/40">
                      <TableHead className="text-center text-slate-300 font-semibold">Group Name</TableHead>
                      <TableHead className="text-center text-slate-300 font-semibold">Type</TableHead>
                      <TableHead className="text-center text-slate-300 font-semibold">Description</TableHead>
                      <TableHead className="text-center text-slate-300 font-semibold">Members</TableHead>
                      <TableHead className="text-center text-slate-300 font-semibold">Rules</TableHead>
                      <TableHead className="text-center text-slate-300 font-semibold">Created</TableHead>
                      <TableHead className="text-center text-slate-300 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((group) => (
                      <TableRow key={group.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="text-center">
                          <button
                            onClick={() => setViewingGroup(group)}
                            className="text-white text-sm font-medium hover:text-blue-400 hover:underline"
                          >
                            {group.name}
                          </button>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Badge className={cn(
                              group.type === 'user' ? 'bg-blue-600' : 'bg-green-600',
                              'text-white hover:opacity-80'
                            )}>
                              <span className="flex items-center gap-1">
                                {getTypeIcon(group.type)}
                                {getTypeLabel(group.type)}
                              </span>
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-slate-400 text-sm max-w-xs truncate">{group.description}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-white font-medium">{group.memberCount}</span>
                          <span className="text-slate-500 text-sm ml-1">members</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {group.assignedRules.slice(0, 2).map((rule) => (
                              <Badge key={rule} variant="outline" className="text-slate-300 border-slate-600 text-xs">
                                {rule}
                              </Badge>
                            ))}
                            {group.assignedRules.length > 2 && (
                              <Badge variant="outline" className="text-slate-300 border-slate-600 text-xs">
                                +{group.assignedRules.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-slate-400 text-sm">{group.createdAt}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingGroup(group)}
                              className="text-slate-400 hover:text-white"
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(group.id)}
                              className="text-slate-400 hover:text-red-400"
                            >
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
        </TabsContent>
      </Tabs>

      {/* Add/Edit Group Dialog */}
      <Dialog open={isAddOpen || !!editingGroup} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false);
          setEditingGroup(null);
        }
      }}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingGroup ? 'Edit Group' : 'Add New Group'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingGroup ? 'Update group details and members' : 'Create a new user or device group'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-200">Group Name</Label>
              <Input
                placeholder="Enter group name"
                className="bg-slate-800 border-slate-700 text-white"
                defaultValue={editingGroup?.name}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Group Type</Label>
              <Select defaultValue={editingGroup?.type || 'user'}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="user" className="text-white">User Group</SelectItem>
                  <SelectItem value="device" className="text-white">Device Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Description</Label>
              <Input
                placeholder="Enter group description"
                className="bg-slate-800 border-slate-700 text-white"
                defaultValue={editingGroup?.description}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddOpen(false);
                setEditingGroup(null);
              }}
              className="border-slate-700 text-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsAddOpen(false);
                setEditingGroup(null);
              }}
              className="bg-white text-slate-800 hover:bg-slate-100"
            >
              {editingGroup ? 'Update Group' : 'Add Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Group Details Dialog */}
      <Dialog open={!!viewingGroup} onOpenChange={(open) => {
        if (!open) setViewingGroup(null);
      }}>
        <DialogContent className="max-w-3xl bg-slate-900 border-slate-800">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-white text-xl">{viewingGroup?.name}</DialogTitle>
                <DialogDescription className="text-slate-400">
                  {viewingGroup?.description}
                </DialogDescription>
              </div>
              <Badge className={cn(
                viewingGroup?.type === 'user' ? 'bg-blue-600' : 'bg-green-600',
                'text-white'
              )}>
                <span className="flex items-center gap-1">
                  {viewingGroup && getTypeIcon(viewingGroup.type)}
                  {viewingGroup && getTypeLabel(viewingGroup.type)}
                </span>
              </Badge>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Members Section */}
            <Card className="bg-slate-950 border-slate-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    {viewingGroup?.type === 'user' ? <Users className="size-4" /> : <Monitor className="size-4" />}
                    Members ({viewingGroup?.memberCount})
                  </CardTitle>
                  <Button size="sm" variant="outline" className="border-slate-700 text-slate-200">
                    <UserPlus className="size-3 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {viewingGroup?.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-white text-sm">{member.name}</span>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400 h-6 w-6 p-0">
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assigned Rules Section */}
            <Card className="bg-slate-950 border-slate-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <Shield className="size-4" />
                    Assigned Rules
                  </CardTitle>
                  <Button size="sm" variant="outline" className="border-slate-700 text-slate-200">
                    <Plus className="size-3 mr-1" />
                    Assign
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {viewingGroup?.assignedRules.map((rule) => (
                    <div key={rule} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-white text-sm">{rule}</span>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400 h-6 w-6 p-0">
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setViewingGroup(null)}
              className="bg-white text-slate-800 hover:bg-slate-100"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
