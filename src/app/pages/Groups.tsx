import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CalendarDays,
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
  type: 'user' | 'device' | 'ta' | 'access';
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
  {
    id: '6',
    name: 'Morning Shift',
    type: 'ta',
    description: 'Morning attendance tracking group',
    memberCount: 12,
    createdAt: '2024-02-01',
    members: [
      { id: 'u1', name: 'John Doe', type: 'user' },
      { id: 'u3', name: 'Mike Johnson', type: 'user' },
    ],
    assignedRules: ['Morning Check-in'],
  },
  {
    id: '7',
    name: 'Night Shift',
    type: 'ta',
    description: 'Night attendance tracking group',
    memberCount: 8,
    createdAt: '2024-02-02',
    members: [
      { id: 'u4', name: 'Sarah Wilson', type: 'user' },
      { id: 'u5', name: 'Tom Brown', type: 'user' },
    ],
    assignedRules: ['Night Check-in'],
  },
  {
    id: '8',
    name: 'Full Access Group',
    type: 'access',
    description: 'Employees with full building access',
    memberCount: 6,
    createdAt: '2024-02-10',
    members: [
      { id: 'u6', name: 'CEO Office', type: 'user' },
      { id: 'u7', name: 'CTO Office', type: 'user' },
    ],
    assignedRules: ['24/7 Access', 'All Areas'],
  },
  {
    id: '9',
    name: 'Restricted Access',
    type: 'access',
    description: 'Limited area access group',
    memberCount: 15,
    createdAt: '2024-02-11',
    members: [
      { id: 'u2', name: 'Jane Smith', type: 'user' },
      { id: 'u8', name: 'Lisa Chen', type: 'user' },
    ],
    assignedRules: ['Office Hours Only'],
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

interface GroupListCardProps {
  groups: Group[];
  search: string;
  setSearch: (s: string) => void;
  handleDelete: (id: string) => void;
  getTypeIcon: (type: string) => React.ReactNode;
  getTypeLabel: (type: string) => string;
}

function GroupListCard({ groups, search, setSearch, handleDelete, getTypeIcon, getTypeLabel }: GroupListCardProps) {
  const navigate = useNavigate();
  const filtered = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase()) ||
    group.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <Input placeholder="Search groups..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-slate-800 border-slate-700 text-white" />
          </div>
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
                      onClick={() => navigate(`/groups/${group.id}`)}
                      className="text-white text-sm font-medium hover:text-blue-400 hover:underline"
                    >
                      {group.name}
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Badge className={cn(
                        group.type === 'user' ? 'bg-blue-600' :
                        group.type === 'device' ? 'bg-green-600' :
                        group.type === 'ta' ? 'bg-orange-600' :
                        'bg-purple-600',
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
                        onClick={() => navigate(`/groups/${group.id}`)}
                        className="text-slate-400 hover:text-blue-400"
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
  );
}

export function Groups() {
  const [groups, setGroups] = useLocalStorage<Group[]>('acs_groups', mockGroups);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('user');

  const handleDelete = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
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

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Groups</h1>
          <p className="text-slate-400 text-sm">Manage user groups and device groups</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
          <Plus className="size-4" />
          Add Group
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col">
        <TabsList className="bg-slate-800 border border-slate-700 w-fit">
          <TabsTrigger value="user" className="data-[state=active]:bg-slate-700 text-slate-300">User Group List</TabsTrigger>
          <TabsTrigger value="device" className="data-[state=active]:bg-slate-700 text-slate-300">Device Group List</TabsTrigger>
          <TabsTrigger value="ta" className="data-[state=active]:bg-slate-700 text-slate-300">T&A Group List</TabsTrigger>
          <TabsTrigger value="access" className="data-[state=active]:bg-slate-700 text-slate-300">Access Group List</TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-slate-700 text-slate-300">Schedule List</TabsTrigger>
        </TabsList>

        {/* User Group List Tab */}
        <TabsContent value="user" className="flex-1 min-h-0 mt-3">
          <GroupListCard
            groups={groups.filter(g => g.type === 'user')}
            search={search}
            setSearch={setSearch}
            handleDelete={handleDelete}
            getTypeIcon={getTypeIcon}
            getTypeLabel={getTypeLabel}
          />
        </TabsContent>

        {/* Device Group List Tab */}
        <TabsContent value="device" className="flex-1 min-h-0 mt-3">
          <GroupListCard
            groups={groups.filter(g => g.type === 'device')}
            search={search}
            setSearch={setSearch}
            handleDelete={handleDelete}
            getTypeIcon={getTypeIcon}
            getTypeLabel={getTypeLabel}
          />
        </TabsContent>

        {/* T&A Group List Tab */}
        <TabsContent value="ta" className="flex-1 min-h-0 mt-3">
          <GroupListCard
            groups={groups.filter(g => g.type === 'ta')}
            search={search}
            setSearch={setSearch}
            handleDelete={handleDelete}
            getTypeIcon={getTypeIcon}
            getTypeLabel={getTypeLabel}
          />
        </TabsContent>

        {/* Access Group List Tab */}
        <TabsContent value="access" className="flex-1 min-h-0 mt-3">
          <GroupListCard
            groups={groups.filter(g => g.type === 'access')}
            search={search}
            setSearch={setSearch}
            handleDelete={handleDelete}
            getTypeIcon={getTypeIcon}
            getTypeLabel={getTypeLabel}
          />
        </TabsContent>

        {/* Schedule List Tab */}
        <TabsContent value="schedule" className="flex-1 min-h-0 mt-3">
          <Card className="bg-slate-900 border-slate-800 h-full flex flex-col items-center justify-center">
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <CalendarDays className="size-12 text-slate-500" />
              <div className="text-center">
                <h3 className="text-white text-lg font-medium">Schedule Management</h3>
                <p className="text-slate-400 text-sm mt-1">View and manage time schedules</p>
              </div>
              <Button
                onClick={() => window.location.href = '/schedules'}
                className="gap-2 bg-white text-slate-800 hover:bg-slate-100"
              >
                <CalendarDays className="size-4" />
                Go to Schedules
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Group Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Group</DialogTitle>
            <DialogDescription className="text-slate-400">Create a new user or device group</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-200">Group Name</Label>
              <Input
                placeholder="Enter group name"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-200">Group Type</Label>
              <Select defaultValue="user">
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
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsAddOpen(false)}
              className="bg-slate-700 text-white hover:bg-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsAddOpen(false)}
              className="bg-white text-slate-800 hover:bg-slate-100"
            >
              Add Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
