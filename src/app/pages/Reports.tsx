import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  Activity,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { branches as staticBranches, users as staticUsers, dashboardStats } from '../data/staticData';

const accessData = [
  { name: 'Mon', granted: 240, denied: 15 },
  { name: 'Tue', granted: 280, denied: 22 },
  { name: 'Wed', granted: 250, denied: 18 },
  { name: 'Thu', granted: 310, denied: 12 },
  { name: 'Fri', granted: 290, denied: 20 },
  { name: 'Sat', granted: 150, denied: 8 },
  { name: 'Sun', granted: 80, denied: 5 },
];

const branchData = staticBranches.map(b => ({
  name: b.name.replace(' Office', ''),
  value: Math.floor(Math.random() * 300) + 100,
}));

const peakHoursData = [
  { hour: '6 AM', count: 20 },
  { hour: '7 AM', count: 45 },
  { hour: '8 AM', count: 120 },
  { hour: '9 AM', count: 85 },
  { hour: '10 AM', count: 40 },
  { hour: '11 AM', count: 30 },
  { hour: '12 PM', count: 95 },
  { hour: '1 PM', count: 75 },
  { hour: '2 PM', count: 50 },
  { hour: '3 PM', count: 35 },
  { hour: '4 PM', count: 60 },
  { hour: '5 PM', count: 110 },
  { hour: '6 PM', count: 90 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function Reports() {
  const exportToCSV = () => {
    const headers = ['Date,Granted,Denied,Total,Active Users'];
    const rows = [
      '2024-01-15,245,12,257,42',
      '2024-01-16,238,15,253,40',
      '2024-01-17,252,8,260,45',
      '2024-01-18,220,18,238,38',
      '2024-01-19,260,10,270,48',
      '2024-01-20,235,14,249,41',
      '2024-01-21,255,11,266,44',
    ];
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `access_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const stats = {
    total: dashboardStats.totalAccessEvents,
    granted: dashboardStats.grantedAccess,
    denied: dashboardStats.deniedAccess,
    activeUsers: staticUsers.length,
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Reports & Analytics</h1>
          <p className="text-slate-400 text-sm">Access data statistics and analysis</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="week">
            <SelectTrigger className="w-[150px] bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="today" className="text-white">Today</SelectItem>
              <SelectItem value="week" className="text-white">This Week</SelectItem>
              <SelectItem value="month" className="text-white">This Month</SelectItem>
              <SelectItem value="year" className="text-white">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-white text-slate-800 hover:bg-slate-100 border-0">
            <Calendar className="size-4" />
            Custom
          </Button>
          <Button onClick={exportToCSV} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
            <Download className="size-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="px-3 py-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-slate-100 text-sm font-bold whitespace-nowrap">Total Access</CardTitle>
            <Activity className="size-3.5 text-slate-500" />
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0">
            <div className="text-white text-2xl font-semibold leading-7 whitespace-nowrap">{stats.total.toLocaleString()}</div>
            <p className="text-slate-500 flex items-center gap-1 mt-0.5 text-xs whitespace-nowrap overflow-hidden">
              <TrendingUp className="size-3 text-green-500" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-slate-600">from last week</span>
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="px-3 py-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-slate-100 text-sm font-bold whitespace-nowrap">Granted</CardTitle>
            <UserCheck className="size-3.5 text-green-500" />
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0">
            <div className="text-white text-2xl font-semibold leading-7 whitespace-nowrap">{stats.granted.toLocaleString()}</div>
            <p className="text-slate-500 mt-0.5 text-xs whitespace-nowrap overflow-hidden">{stats.total > 0 ? ((stats.granted / stats.total) * 100).toFixed(1) : 0}% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="px-3 py-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-slate-100 text-sm font-bold whitespace-nowrap">Denied</CardTitle>
            <UserX className="size-3.5 text-red-500" />
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0">
            <div className="text-white text-2xl font-semibold leading-7 whitespace-nowrap">{stats.denied.toLocaleString()}</div>
            <p className="text-slate-500 mt-0.5 text-xs whitespace-nowrap overflow-hidden">{stats.total > 0 ? ((stats.denied / stats.total) * 100).toFixed(1) : 0}% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="px-3 py-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-slate-100 text-sm font-bold whitespace-nowrap">Active Users</CardTitle>
            <Users className="size-3.5 text-blue-500" />
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0">
            <div className="text-white text-2xl font-semibold leading-7 whitespace-nowrap">{stats.activeUsers}</div>
            <p className="text-slate-500 mt-0.5 text-xs whitespace-nowrap overflow-hidden">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Daily Access</CardTitle>
            <CardDescription className="text-slate-400">Last 7 days statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
                <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                <Bar dataKey="granted" fill="#10b981" name="Granted" />
                <Bar dataKey="denied" fill="#ef4444" name="Denied" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Distribution by Office</CardTitle>
            <CardDescription className="text-slate-400">Access count by location</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={branchData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {branchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Peak Hours</CardTitle>
            <CardDescription className="text-slate-400">Access volume by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
                <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Access Count" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Users */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Most Active Users</CardTitle>
          <CardDescription className="text-slate-400">Top 5 users with most access attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staticUsers.slice(0, 5).map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-950">
                <div className="flex items-center gap-3">
                  <div className="text-white font-bold">#{index + 1}</div>
                  <div>
                    <p className="text-white">{user.name}</p>
                    <p className="text-slate-400">{user.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white">{Math.floor(Math.random() * 30) + 20} scans</p>
                  <p className="text-slate-400">This week</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
