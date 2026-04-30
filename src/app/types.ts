// ── Employees (User Management in ACS) ──────────────────────────
export interface Employee {
  id: string;
  name: string;
  employeeNo: string;
  branch: string;
  image?: string;
  validity: 'valid' | 'expired' | 'suspended';
  lastAuthTime?: string;
  registeredAt: string;
  authMethod?: 'face' | 'fingerprint' | 'passcode';
  authData?: string;
  groupIds?: string[];
}

// ── Legacy User type (kept for backward compat) ──────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  faceRegistered?: boolean;
  lastActive?: string;
}

// ── Devices ──────────────────────────────────────────────────────
export interface Device {
  id: string;
  name: string;
  model: string;
  branch: string;
  location: string;
  doorType: 'entry' | 'exit' | 'both';
  doorStatus: 'locked' | 'unlocked';
  status: 'online' | 'offline' | 'maintenance' | 'warning' | 'disconnected';
  lastSeen: string;
  lastActivity: string;
  ipAddress: string;
  firmwareVersion: string;
  todayCount: number;
  groupIds?: string[];
}

// ── Branches ─────────────────────────────────────────────────────
export interface Branch {
  id: string;
  name: string;
  address: string;
  contact: string;
  phone: string;
  email: string;
  manager: string;
  employees: number;
  deviceCount: number;
  devices: number;
  status: 'active' | 'inactive';
}

// ── Doors ────────────────────────────────────────────────────────
export interface Door {
  id: string;
  name: string;
  branch: string;
  deviceId: string;
  status: 'locked' | 'unlocked';
  type: 'glass-door' | 'solid-door' | 'gate' | 'emergency' | 'turnstile';
  accessLevel: 'all' | 'staff-only' | 'restricted' | 'emergency-only' | 'admin-only';
}

// ── Access Events (legacy, kept for dashboard) ───────────────────
export interface AccessEvent {
  id: string;
  userId: string;
  userName: string;
  deviceId: string;
  deviceName: string;
  branch: string;
  timestamp: string;
  status: 'granted' | 'denied';
  method: 'face' | 'card' | 'pin';
  confidence?: number;
}

// ── Log types ────────────────────────────────────────────────────
export interface DeviceLog {
  id: string;
  timestamp: string;
  deviceId: string;
  deviceName: string;
  deviceModel: string;
  doorName: string;
  event: 'connected' | 'disconnected' | 'restarted' | 'firmware_updated';
  message: string;
}

export interface EmergencyLog {
  id: string;
  timestamp: string;
  deviceId: string;
  deviceName: string;
  branch: string;
  alarmType: 'intrusion' | 'door_forced' | 'door_held' | 'tamper' | 'fire';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  resolved: boolean;
}

export interface AuthenticationLog {
  id: string;
  timestamp: string;
  employeeId?: string;
  employeeName: string;
  employeeNo?: string;
  branch: string;
  deviceName: string;
  doorName: string;
  direction: 'entry' | 'exit';
  status: 'granted' | 'denied';
  method: 'face';
  confidence?: number;
  captureImage?: string;
  reason?: string;
}

export interface OccupancyLog {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  employeeNo: string;
  branch: string;
  firstEntry?: string;
  lastExit?: string;
  totalHours: number;
}

// ── Time Schedules for Access Control ──────────────────────────
export interface TimeSchedule {
  id: string;
  name: string;
  description?: string;
  type: 'daily' | 'weekly' | 'holiday';
  enabled: boolean;
  // Time ranges for each day (0-6 = Sun-Sat)
  timeRanges: {
    day: number; // 0-6
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    enabled: boolean;
  }[];
  // For holiday type
  holidayDates?: string[]; // YYYY-MM-DD format
  createdAt: string;
}

// ── Accounts (platform login) ────────────────────────────────────
export interface Account {
  username: string;
  password: string;
  displayName: string;
  role: 'Administrator' | 'Operator' | 'Viewer';
  licensedModules: ('acs' | 'vms')[];
}
