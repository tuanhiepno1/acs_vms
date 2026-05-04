import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
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
  Download,
  Users,
  AlertTriangle,
  Wifi,
  WifiOff,
  ShieldCheck,
  Clock,
  Radio,
  Eye,
  X,
  Camera,
  DoorOpen,
  Building2,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { branches as staticBranches, users as staticUsers, employees as staticEmployees, dashboardStats, devices as staticDevices, doors as staticDoors } from '../data/staticData';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';

const accessDataSets: Record<string, { name: string; granted: number; denied: number }[]> = {
  today: [
    { name: '6 AM', granted: 20, denied: 1 },
    { name: '7 AM', granted: 45, denied: 2 },
    { name: '8 AM', granted: 120, denied: 5 },
    { name: '9 AM', granted: 85, denied: 3 },
    { name: '10 AM', granted: 40, denied: 2 },
    { name: '11 AM', granted: 30, denied: 1 },
    { name: '12 PM', granted: 95, denied: 4 },
    { name: '1 PM', granted: 75, denied: 3 },
    { name: '2 PM', granted: 50, denied: 2 },
    { name: '3 PM', granted: 35, denied: 1 },
    { name: '4 PM', granted: 60, denied: 2 },
    { name: '5 PM', granted: 110, denied: 4 },
    { name: '6 PM', granted: 90, denied: 3 },
  ],
  week: [
    { name: 'Mon', granted: 240, denied: 15 },
    { name: 'Tue', granted: 280, denied: 22 },
    { name: 'Wed', granted: 250, denied: 18 },
    { name: 'Thu', granted: 310, denied: 12 },
    { name: 'Fri', granted: 290, denied: 20 },
    { name: 'Sat', granted: 150, denied: 8 },
    { name: 'Sun', granted: 80, denied: 5 },
  ],
  month: [
    { name: 'Week 1', granted: 1200, denied: 85 },
    { name: 'Week 2', granted: 1350, denied: 72 },
    { name: 'Week 3', granted: 1100, denied: 95 },
    { name: 'Week 4', granted: 1450, denied: 68 },
  ],
  year: [
    { name: 'Jan', granted: 5200, denied: 320 },
    { name: 'Feb', granted: 4800, denied: 280 },
    { name: 'Mar', granted: 6100, denied: 350 },
    { name: 'Apr', granted: 5900, denied: 310 },
    { name: 'May', granted: 5500, denied: 290 },
    { name: 'Jun', granted: 6300, denied: 380 },
    { name: 'Jul', granted: 5800, denied: 340 },
    { name: 'Aug', granted: 6000, denied: 360 },
    { name: 'Sep', granted: 5400, denied: 300 },
    { name: 'Oct', granted: 5700, denied: 330 },
    { name: 'Nov', granted: 6200, denied: 370 },
    { name: 'Dec', granted: 5100, denied: 310 },
  ],
};

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

const recentActivities = [
  { id: 1, user: 'John Doe', action: 'Access Granted', location: 'Main Entrance', time: '2 min ago', status: 'success' },
  { id: 2, user: 'Jane Smith', action: 'Access Denied', location: 'Server Room', time: '5 min ago', status: 'error' },
  { id: 3, user: 'Mike Johnson', action: 'Access Granted', location: 'Main Entrance', time: '8 min ago', status: 'success' },
  { id: 4, user: 'Sarah Wilson', action: 'Access Granted', location: 'Office B', time: '12 min ago', status: 'success' },
  { id: 5, user: 'Tom Brown', action: 'Access Denied', location: 'Server Room', time: '15 min ago', status: 'error' },
];

const alerts = [
  { id: 1, type: 'warning', message: 'Device #3 offline for 5 minutes', time: '5 min ago' },
  { id: 2, type: 'error', message: 'Multiple failed access attempts at Server Room', time: '10 min ago' },
  { id: 3, type: 'info', message: 'System backup completed successfully', time: '1 hour ago' },
];

export function Dashboard() {
  const navigate = useNavigate();
  
  // Drill-down dialog state
  const [chartDetail, setChartDetail] = useState<{type: string, open: boolean}>({type: '', open: false});
  const [period, setPeriod] = useState('week');
  const accessData = accessDataSets[period];

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

  const summaryStats = {
    totalUsers: staticEmployees.length,
    totalDevices: staticDevices.length,
    totalDoors: staticDoors.length,
    totalBranches: staticBranches.length,
  };

  const deviceStatus = {
    online: staticDevices.filter(d => d.status === 'online').length,
    offline: staticDevices.filter(d => d.status === 'offline').length,
    warning: staticDevices.filter(d => d.status === 'warning' || d.status === 'maintenance').length,
    total: staticDevices.length,
  };

  const userStatus = {
    valid: staticEmployees.filter(e => e.validity === 'valid').length,
    expired: staticEmployees.filter(e => e.validity === 'expired').length,
    suspended: staticEmployees.filter(e => e.validity === 'suspended').length,
    total: staticEmployees.length,
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Dashboard</h1>
          <p className="text-slate-400 text-sm">Access control system overview and analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
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
          <Button onClick={exportToCSV} className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Users className="size-6 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Users</p>
              <p className="text-white text-2xl font-bold">{summaryStats.totalUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <Camera className="size-6 text-green-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Devices</p>
              <p className="text-white text-2xl font-bold">{summaryStats.totalDevices}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <DoorOpen className="size-6 text-orange-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Doors</p>
              <p className="text-white text-2xl font-bold">{summaryStats.totalDoors}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <Building2 className="size-6 text-purple-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Branches</p>
              <p className="text-white text-2xl font-bold">{summaryStats.totalBranches}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
        {/* Daily Access Trends */}
        <Card
          className="bg-slate-900 border-slate-800 cursor-pointer hover:border-slate-600 transition-colors group"
          onClick={() => setChartDetail({type: 'access', open: true})}
        >
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
            <div>
              <CardTitle className="text-white text-base">Daily Access Trends</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                {period === 'today' ? 'Today hourly statistics' : period === 'week' ? 'Last 7 days statistics' : period === 'month' ? 'This month weekly statistics' : 'This year monthly statistics'}
              </CardDescription>
            </div>
            <Eye className="size-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={260}>
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

        {/* User Status + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* User Status */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-white text-base">User Status</CardTitle>
              <CardDescription className="text-slate-400 text-xs">Employee validity overview</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="size-5 text-green-500" />
                    <div>
                      <p className="text-white font-medium text-sm">Valid</p>
                      <p className="text-slate-500 text-xs">Active employees</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-400">{userStatus.valid}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Clock className="size-5 text-yellow-500" />
                    <div>
                      <p className="text-white font-medium text-sm">Expired</p>
                      <p className="text-slate-500 text-xs">Expired access</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">{userStatus.expired}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="size-5 text-red-500" />
                    <div>
                      <p className="text-white font-medium text-sm">Suspended</p>
                      <p className="text-slate-500 text-xs">Restricted access</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-400">{userStatus.suspended}</span>
                </div>
                <div className="text-center pt-2 border-t border-slate-800">
                  <p className="text-slate-400 text-sm">Total: <span className="text-white font-semibold">{userStatus.total}</span> employees</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-white text-base">Recent Activity</CardTitle>
                  {/* LIVE Badge */}
                  <Badge className="bg-red-600/20 text-red-400 border-red-600/30 animate-pulse">
                    <Radio className="size-3 mr-1" />
                    LIVE
                  </Badge>
                </div>
                <CardDescription className="text-slate-400 text-xs">Latest access events</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`size-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-white text-sm font-medium">{activity.user}</p>
                        <p className="text-slate-500 text-xs">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">{activity.location}</p>
                      <p className="text-slate-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Status + System Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Device Status */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-white text-base">Device Status</CardTitle>
              <CardDescription className="text-slate-400 text-xs">System health overview</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Wifi className="size-5 text-green-500" />
                    <div>
                      <p className="text-white font-medium text-sm">Online</p>
                      <p className="text-slate-500 text-xs">Active devices</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-400">{deviceStatus.online}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <WifiOff className="size-5 text-red-500" />
                    <div>
                      <p className="text-white font-medium text-sm">Offline</p>
                      <p className="text-slate-500 text-xs">Inactive devices</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-400">{deviceStatus.offline}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="size-5 text-yellow-500" />
                    <div>
                      <p className="text-white font-medium text-sm">Warning</p>
                      <p className="text-slate-500 text-xs">Needs attention</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">{deviceStatus.warning}</span>
                </div>
                <div className="text-center pt-2 border-t border-slate-800">
                  <p className="text-slate-400 text-sm">Total: <span className="text-white font-semibold">{deviceStatus.total}</span> devices</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-white text-base">System Alerts</CardTitle>
              <CardDescription className="text-slate-400 text-xs">Important notifications</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${
                    alert.type === 'error' ? 'bg-red-950/30 border-red-900/40' :
                    alert.type === 'warning' ? 'bg-yellow-950/30 border-yellow-900/40' :
                    'bg-blue-950/30 border-blue-900/40'
                  }`}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`size-4 mt-0.5 ${
                        alert.type === 'error' ? 'text-red-400' :
                        alert.type === 'warning' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm ${
                          alert.type === 'error' ? 'text-red-200' :
                          alert.type === 'warning' ? 'text-yellow-200' :
                          'text-blue-200'
                        }`}>{alert.message}</p>
                        <p className="text-slate-500 text-xs mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Distribution by Office */}
          <Card 
            className="bg-slate-900 border-slate-800 cursor-pointer hover:border-slate-600 transition-colors group"
            onClick={() => setChartDetail({type: 'distribution', open: true})}
          >
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
              <div>
                <CardTitle className="text-white text-base">Distribution by Office</CardTitle>
                <CardDescription className="text-slate-400 text-xs">Access count by location</CardDescription>
              </div>
              <Eye className="size-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={branchData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
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

          {/* Peak Hours */}
          <Card 
            className="bg-slate-900 border-slate-800 cursor-pointer hover:border-slate-600 transition-colors group"
            onClick={() => setChartDetail({type: 'peak', open: true})}
          >
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
              <div>
                <CardTitle className="text-white text-base">Peak Hours</CardTitle>
                <CardDescription className="text-slate-400 text-xs">Access volume by hour</CardDescription>
              </div>
              <Eye className="size-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={250}>
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
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-white text-base">Most Active Users</CardTitle>
            <CardDescription className="text-slate-400 text-xs">Top 5 users with most access attempts</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-3">
              {staticUsers.slice(0, 5).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-slate-800 rounded-lg bg-slate-950">
                  <div className="flex items-center gap-3">
                    <div className="text-white font-bold text-sm">#{index + 1}</div>
                    <div>
                      <p className="text-white text-sm font-medium">{user.name}</p>
                      <p className="text-slate-400 text-xs">{user.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">{Math.floor(Math.random() * 30) + 20} scans</p>
                    <p className="text-slate-400 text-xs">This week</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Detail Dialog */}
      <Dialog open={chartDetail.open} onOpenChange={(open) => setChartDetail({...chartDetail, open})}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {chartDetail.type === 'access' && 'Daily Access Trends - Detailed View'}
              {chartDetail.type === 'distribution' && 'Distribution by Office - Detailed View'}
              {chartDetail.type === 'peak' && 'Peak Hours - Detailed View'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {chartDetail.type === 'access' && 'Complete access statistics with hourly breakdown'}
              {chartDetail.type === 'distribution' && 'Detailed breakdown by office location'}
              {chartDetail.type === 'peak' && 'Hourly access volume analysis'}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {chartDetail.type === 'access' && (
              <div className="space-y-4">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-800">
                    <p className="text-slate-400 text-sm">Total Granted</p>
                    <p className="text-green-400 text-xl font-bold">{accessData.reduce((a, b) => a + b.granted, 0).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800">
                    <p className="text-slate-400 text-sm">Total Denied</p>
                    <p className="text-red-400 text-xl font-bold">{accessData.reduce((a, b) => a + b.denied, 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
            {chartDetail.type === 'distribution' && (
              <div className="space-y-4">
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
                <div className="grid grid-cols-2 gap-2">
                  {branchData.map((branch, i) => (
                    <div key={branch.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                        <span className="text-slate-300 text-sm">{branch.name}</span>
                      </div>
                      <span className="text-white font-medium">{branch.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {chartDetail.type === 'peak' && (
              <div className="space-y-4">
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
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Access Count" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-800">
                    <p className="text-slate-400 text-sm">Peak Hour</p>
                    <p className="text-blue-400 text-xl font-bold">8 AM</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800">
                    <p className="text-slate-400 text-sm">Total Access</p>
                    <p className="text-white text-xl font-bold">{peakHoursData.reduce((a, b) => a + b.count, 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
