import type { User, Employee, AccessEvent, Device, Branch, Door, Account, DeviceLog, EmergencyLog, AuthenticationLog, OccupancyLog } from '../types';

// ── Accounts ────────────────────────────────────────────────────
export const accounts: Account[] = [
  { username: 'admin', password: 'admin123', displayName: 'Sol', role: 'Administrator', licensedModules: ['acs', 'vms'] },
];

// ── Branches (5 offices) ────────────────────────────────────────
export const branches: Branch[] = [
  { id: 'BR-001', name: 'Headquarters',    address: '100 Peachtree St NW, Atlanta, GA 30303',           contact: 'John Smith',      phone: '+1 (770) 555-0100', email: 'hq@solcompany.com',          manager: 'John Smith',      employees: 35, deviceCount: 2, devices: 2, status: 'active' },
  { id: 'BR-002', name: 'Cartersville',    address: '15 W Main St, Cartersville, GA 30120',             contact: 'Sarah Johnson',   phone: '+1 (770) 555-0200', email: 'cartersville@solcompany.com', manager: 'Sarah Johnson',   employees: 18, deviceCount: 1, devices: 1, status: 'active' },
  { id: 'BR-003', name: 'Manteca',         address: '220 E Yosemite Ave, Manteca, CA 95336',            contact: 'James Taylor',    phone: '+1 (209) 555-0300', email: 'manteca@solcompany.com',      manager: 'James Taylor',    employees: 14, deviceCount: 1, devices: 1, status: 'active' },
  { id: 'BR-004', name: 'Savannah',        address: '2 E Bryan St, Savannah, GA 31401',                 contact: 'Lisa Anderson',   phone: '+1 (912) 555-0400', email: 'savannah@solcompany.com',     manager: 'Lisa Anderson',   employees: 12, deviceCount: 1, devices: 1, status: 'active' },
  { id: 'BR-005', name: 'Vietnam Office',  address: '29 Le Duan Blvd, District 1, Ho Chi Minh City',    contact: 'Nguyen Van A',    phone: '+84 28 3822-0500',  email: 'vietnam@solcompany.com',     manager: 'Nguyen Van A',    employees: 10, deviceCount: 1, devices: 1, status: 'active' },
];

// ── Employees (distributed across 5 offices) ───────────────────
export const employees: Employee[] = [
  { id: 'EMP-001', name: 'John Smith',          employeeNo: 'E001', branch: 'Headquarters',   image: 'https://i.pravatar.cc/150?u=emp001', validity: 'valid',     lastAuthTime: '2025-01-15T10:30:00Z', registeredAt: '2024-03-10T08:00:00Z' },
  { id: 'EMP-002', name: 'Sarah Johnson',       employeeNo: 'E002', branch: 'Cartersville',   image: 'https://i.pravatar.cc/150?u=emp002', validity: 'valid',     lastAuthTime: '2025-01-15T10:28:00Z', registeredAt: '2024-03-12T09:15:00Z' },
  { id: 'EMP-003', name: 'Michael Brown',       employeeNo: 'E003', branch: 'Headquarters',   image: 'https://i.pravatar.cc/150?u=emp003', validity: 'expired',   lastAuthTime: '2025-01-10T08:05:00Z', registeredAt: '2024-04-01T10:30:00Z' },
  { id: 'EMP-004', name: 'Emily Davis',         employeeNo: 'E004', branch: 'Headquarters',   image: 'https://i.pravatar.cc/150?u=emp004', validity: 'valid',     lastAuthTime: '2025-01-15T10:20:00Z', registeredAt: '2024-04-15T07:45:00Z' },
  { id: 'EMP-005', name: 'David Wilson',        employeeNo: 'E005', branch: 'Manteca',        image: 'https://i.pravatar.cc/150?u=emp005', validity: 'suspended', lastAuthTime: '2025-01-08T17:00:00Z', registeredAt: '2024-05-20T11:00:00Z' },
  { id: 'EMP-006', name: 'Lisa Anderson',       employeeNo: 'E006', branch: 'Savannah',       image: 'https://i.pravatar.cc/150?u=emp006', validity: 'valid',     lastAuthTime: '2025-01-15T10:15:00Z', registeredAt: '2024-06-01T08:30:00Z' },
  { id: 'EMP-007', name: 'James Taylor',        employeeNo: 'E007', branch: 'Manteca',        image: 'https://i.pravatar.cc/150?u=emp007', validity: 'valid',     lastAuthTime: '2025-01-15T10:10:00Z', registeredAt: '2024-06-15T09:00:00Z' },
  { id: 'EMP-008', name: 'Jennifer Martinez',   employeeNo: 'E008', branch: 'Headquarters',   image: 'https://i.pravatar.cc/150?u=emp008', validity: 'valid',     lastAuthTime: '2025-01-15T10:05:00Z', registeredAt: '2024-07-01T08:00:00Z' },
  { id: 'EMP-009', name: 'Robert Thomas',       employeeNo: 'E009', branch: 'Savannah',       image: 'https://i.pravatar.cc/150?u=emp009', validity: 'valid',     lastAuthTime: '2025-01-15T09:55:00Z', registeredAt: '2024-07-20T10:00:00Z' },
  { id: 'EMP-010', name: 'Maria Garcia',        employeeNo: 'E010', branch: 'Vietnam Office', image: 'https://i.pravatar.cc/150?u=emp010', validity: 'valid',     lastAuthTime: '2025-01-15T09:50:00Z', registeredAt: '2024-08-05T08:15:00Z' },
  { id: 'EMP-011', name: 'Nguyen Van A',        employeeNo: 'E011', branch: 'Vietnam Office', image: 'https://i.pravatar.cc/150?u=emp011', validity: 'valid',     lastAuthTime: '2025-01-15T09:45:00Z', registeredAt: '2024-08-20T08:00:00Z' },
  { id: 'EMP-012', name: 'Tran Thi B',          employeeNo: 'E012', branch: 'Cartersville',   image: 'https://i.pravatar.cc/150?u=emp012', validity: 'valid',     lastAuthTime: '2025-01-15T09:40:00Z', registeredAt: '2024-09-01T08:30:00Z' },
];

export const users: User[] = [
  { id: 'USR-001', name: 'John Smith',        email: 'john.smith@solcompany.com',        department: 'Engineering', role: 'admin', status: 'active',   faceRegistered: true },
  { id: 'USR-002', name: 'Sarah Johnson',     email: 'sarah.johnson@solcompany.com',     department: 'Operations', role: 'user',  status: 'active',   faceRegistered: true },
  { id: 'USR-003', name: 'Michael Brown',     email: 'michael.brown@solcompany.com',     department: 'Engineering', role: 'user',  status: 'active',   faceRegistered: false },
  { id: 'USR-004', name: 'Emily Davis',       email: 'emily.davis@solcompany.com',       department: 'HR',         role: 'user',  status: 'active',   faceRegistered: true },
  { id: 'USR-005', name: 'David Wilson',      email: 'david.wilson@solcompany.com',      department: 'Warehouse',  role: 'user',  status: 'inactive', faceRegistered: false },
  { id: 'USR-006', name: 'Lisa Anderson',     email: 'lisa.anderson@solcompany.com',     department: 'Operations', role: 'user',  status: 'active',   faceRegistered: true },
  { id: 'USR-007', name: 'James Taylor',      email: 'james.taylor@solcompany.com',      department: 'Warehouse',  role: 'user',  status: 'active',   faceRegistered: true },
  { id: 'USR-008', name: 'Jennifer Martinez', email: 'jennifer.martinez@solcompany.com', department: 'HR',         role: 'admin', status: 'active',   faceRegistered: true },
  { id: 'USR-009', name: 'Robert Thomas',     email: 'robert.thomas@solcompany.com',     department: 'Operations', role: 'user',  status: 'active',   faceRegistered: true },
  { id: 'USR-010', name: 'Maria Garcia',      email: 'maria.garcia@solcompany.com',      department: 'Engineering', role: 'user',  status: 'active',   faceRegistered: true },
  { id: 'USR-011', name: 'Nguyen Van A',      email: 'nguyenvana@solcompany.com',        department: 'Engineering', role: 'user',  status: 'active',   faceRegistered: true },
  { id: 'USR-012', name: 'Tran Thi B',        email: 'tranthib@solcompany.com',          department: 'Operations', role: 'user',  status: 'active',   faceRegistered: true },
];

// ── Devices (HQ=2, others=1 each → 6 total) ────────────────────
export const devices: Device[] = [
  { id: 'DEV-001', name: 'HQ Main Door Camera',         model: 'FaceID Pro X1',       branch: 'Headquarters',   location: 'Main Lobby Entrance',     status: 'online',  lastSeen: '2025-01-15T10:30:00Z', lastActivity: '2025-01-15T10:30:00Z', ipAddress: '192.168.1.100', firmwareVersion: 'v2.1.0', todayCount: 156 },
  { id: 'DEV-002', name: 'HQ Sub Door Camera',          model: 'FaceID Mini S2',      branch: 'Headquarters',   location: 'Side Entrance / Loading', status: 'online',  lastSeen: '2025-01-15T10:29:00Z', lastActivity: '2025-01-15T10:29:00Z', ipAddress: '192.168.1.101', firmwareVersion: 'v2.1.0', todayCount: 42 },
  { id: 'DEV-003', name: 'Cartersville Door Camera',    model: 'FaceID Pro X1',       branch: 'Cartersville',   location: 'Front Entrance',          status: 'online',  lastSeen: '2025-01-15T10:28:00Z', lastActivity: '2025-01-15T10:28:00Z', ipAddress: '192.168.2.100', firmwareVersion: 'v2.0.5', todayCount: 67 },
  { id: 'DEV-004', name: 'Manteca Door Camera',         model: 'FaceID Pro X1',       branch: 'Manteca',        location: 'Warehouse Entrance',      status: 'online',  lastSeen: '2025-01-15T10:27:00Z', lastActivity: '2025-01-15T10:27:00Z', ipAddress: '192.168.3.100', firmwareVersion: 'v2.1.0', todayCount: 51 },
  { id: 'DEV-005', name: 'Savannah Door Camera',        model: 'FaceID Pro X1',       branch: 'Savannah',       location: 'Office Entrance',         status: 'warning', lastSeen: '2025-01-15T10:20:00Z', lastActivity: '2025-01-15T10:20:00Z', ipAddress: '192.168.4.100', firmwareVersion: 'v1.9.8', todayCount: 38 },
  { id: 'DEV-006', name: 'Vietnam Office Door Camera',  model: 'FaceID Compact C1',   branch: 'Vietnam Office', location: 'Main Entrance',           status: 'online',  lastSeen: '2025-01-15T10:25:00Z', lastActivity: '2025-01-15T10:25:00Z', ipAddress: '10.10.1.100',   firmwareVersion: 'v2.1.0', todayCount: 29 },
];

// ── Doors (HQ=2, others=1 each → 6 total) ──────────────────────
export const doors: Door[] = [
  { id: 'DOOR-001', name: 'HQ Main Door',              branch: 'Headquarters',   deviceId: 'DEV-001', status: 'locked',   type: 'glass-door',  accessLevel: 'all' },
  { id: 'DOOR-002', name: 'HQ Sub Door',               branch: 'Headquarters',   deviceId: 'DEV-002', status: 'locked',   type: 'solid-door',  accessLevel: 'staff-only' },
  { id: 'DOOR-003', name: 'Cartersville Entrance',     branch: 'Cartersville',   deviceId: 'DEV-003', status: 'locked',   type: 'glass-door',  accessLevel: 'all' },
  { id: 'DOOR-004', name: 'Manteca Warehouse Door',    branch: 'Manteca',        deviceId: 'DEV-004', status: 'locked',   type: 'solid-door',  accessLevel: 'all' },
  { id: 'DOOR-005', name: 'Savannah Office Door',      branch: 'Savannah',       deviceId: 'DEV-005', status: 'locked',   type: 'glass-door',  accessLevel: 'all' },
  { id: 'DOOR-006', name: 'Vietnam Office Door',       branch: 'Vietnam Office', deviceId: 'DEV-006', status: 'locked',   type: 'glass-door',  accessLevel: 'all' },
];

// ── Face Photos ─────────────────────────────────────────────────
export const facePhotos: Record<string, string> = {
  'John Smith':         'https://randomuser.me/api/portraits/men/32.jpg',
  'Sarah Johnson':      'https://randomuser.me/api/portraits/women/44.jpg',
  'Michael Brown':      'https://randomuser.me/api/portraits/men/45.jpg',
  'Emily Davis':        'https://randomuser.me/api/portraits/women/67.jpg',
  'David Wilson':       'https://randomuser.me/api/portraits/men/51.jpg',
  'Lisa Anderson':      'https://randomuser.me/api/portraits/women/29.jpg',
  'James Taylor':       'https://randomuser.me/api/portraits/men/22.jpg',
  'Jennifer Martinez':  'https://randomuser.me/api/portraits/women/55.jpg',
  'Robert Thomas':      'https://randomuser.me/api/portraits/men/61.jpg',
  'Maria Garcia':       'https://randomuser.me/api/portraits/women/38.jpg',
  'Nguyen Van A':       'https://randomuser.me/api/portraits/men/76.jpg',
  'Tran Thi B':         'https://randomuser.me/api/portraits/women/12.jpg',
  'Unknown Person':     'https://randomuser.me/api/portraits/lego/1.jpg',
};

// ── Access Logs (dashboard live feed) ───────────────────────────
export const accessLogs: AccessEvent[] = [
  { id: 'LOG-001', userId: 'USR-001', userName: 'John Smith',        deviceId: 'DEV-001', deviceName: 'HQ Main Door Camera',        branch: 'Headquarters',   timestamp: '2025-01-15T10:30:00Z', status: 'granted', method: 'face', confidence: 0.98 },
  { id: 'LOG-002', userId: 'USR-002', userName: 'Sarah Johnson',     deviceId: 'DEV-003', deviceName: 'Cartersville Door Camera',   branch: 'Cartersville',   timestamp: '2025-01-15T10:28:00Z', status: 'granted', method: 'face', confidence: 0.95 },
  { id: 'LOG-003', userId: 'USR-003', userName: 'Michael Brown',     deviceId: 'DEV-001', deviceName: 'HQ Main Door Camera',        branch: 'Headquarters',   timestamp: '2025-01-15T10:25:00Z', status: 'denied',  method: 'face', confidence: 0.45 },
  { id: 'LOG-004', userId: 'USR-004', userName: 'Emily Davis',       deviceId: 'DEV-002', deviceName: 'HQ Sub Door Camera',         branch: 'Headquarters',   timestamp: '2025-01-15T10:20:00Z', status: 'granted', method: 'face', confidence: 0.99 },
  { id: 'LOG-005', userId: 'USR-006', userName: 'Lisa Anderson',     deviceId: 'DEV-005', deviceName: 'Savannah Door Camera',       branch: 'Savannah',       timestamp: '2025-01-15T10:15:00Z', status: 'granted', method: 'face', confidence: 0.97 },
  { id: 'LOG-006', userId: 'USR-007', userName: 'James Taylor',      deviceId: 'DEV-004', deviceName: 'Manteca Door Camera',        branch: 'Manteca',        timestamp: '2025-01-15T10:10:00Z', status: 'granted', method: 'face', confidence: 0.92 },
  { id: 'LOG-007', userId: 'USR-008', userName: 'Jennifer Martinez', deviceId: 'DEV-001', deviceName: 'HQ Main Door Camera',        branch: 'Headquarters',   timestamp: '2025-01-15T10:05:00Z', status: 'granted', method: 'face', confidence: 0.96 },
  { id: 'LOG-008', userId: 'USR-005', userName: 'David Wilson',      deviceId: 'DEV-004', deviceName: 'Manteca Door Camera',        branch: 'Manteca',        timestamp: '2025-01-15T10:00:00Z', status: 'denied',  method: 'face', confidence: 0.30 },
  { id: 'LOG-009', userId: 'USR-009', userName: 'Robert Thomas',     deviceId: 'DEV-005', deviceName: 'Savannah Door Camera',       branch: 'Savannah',       timestamp: '2025-01-15T09:55:00Z', status: 'granted', method: 'face', confidence: 0.94 },
  { id: 'LOG-010', userId: 'USR-010', userName: 'Maria Garcia',      deviceId: 'DEV-006', deviceName: 'Vietnam Office Door Camera', branch: 'Vietnam Office', timestamp: '2025-01-15T09:50:00Z', status: 'granted', method: 'face', confidence: 0.93 },
  { id: 'LOG-011', userId: 'USR-011', userName: 'Nguyen Van A',      deviceId: 'DEV-006', deviceName: 'Vietnam Office Door Camera', branch: 'Vietnam Office', timestamp: '2025-01-15T09:45:00Z', status: 'granted', method: 'face', confidence: 0.96 },
  { id: 'LOG-012', userId: 'USR-012', userName: 'Tran Thi B',        deviceId: 'DEV-003', deviceName: 'Cartersville Door Camera',   branch: 'Cartersville',   timestamp: '2025-01-15T09:40:00Z', status: 'granted', method: 'face', confidence: 0.91 },
];

// ── Device Logs ─────────────────────────────────────────────────
export const deviceLogs: DeviceLog[] = [
  { id: 'DL-001', timestamp: '2025-01-15T10:30:00Z', deviceId: 'DEV-001', deviceName: 'HQ Main Door Camera',        deviceModel: 'FaceID Pro X1',     doorName: 'HQ Main Door',          event: 'connected',        message: 'Device connected successfully' },
  { id: 'DL-002', timestamp: '2025-01-15T10:25:00Z', deviceId: 'DEV-005', deviceName: 'Savannah Door Camera',       deviceModel: 'FaceID Pro X1',     doorName: 'Savannah Office Door',  event: 'disconnected',     message: 'Device lost connection — network timeout' },
  { id: 'DL-003', timestamp: '2025-01-15T09:00:00Z', deviceId: 'DEV-002', deviceName: 'HQ Sub Door Camera',         deviceModel: 'FaceID Mini S2',    doorName: 'HQ Sub Door',           event: 'restarted',        message: 'Device restarted after firmware update' },
  { id: 'DL-004', timestamp: '2025-01-15T08:45:00Z', deviceId: 'DEV-003', deviceName: 'Cartersville Door Camera',   deviceModel: 'FaceID Pro X1',     doorName: 'Cartersville Entrance', event: 'firmware_updated', message: 'Firmware updated to v2.1.0' },
  { id: 'DL-005', timestamp: '2025-01-15T08:30:00Z', deviceId: 'DEV-006', deviceName: 'Vietnam Office Door Camera', deviceModel: 'FaceID Compact C1', doorName: 'Vietnam Office Door',   event: 'connected',        message: 'Device connected successfully' },
  { id: 'DL-006', timestamp: '2025-01-14T23:15:00Z', deviceId: 'DEV-005', deviceName: 'Savannah Door Camera',       deviceModel: 'FaceID Pro X1',     doorName: 'Savannah Office Door',  event: 'disconnected',     message: 'Device powered off — scheduled maintenance' },
  { id: 'DL-007', timestamp: '2025-01-14T18:00:00Z', deviceId: 'DEV-004', deviceName: 'Manteca Door Camera',        deviceModel: 'FaceID Pro X1',     doorName: 'Manteca Warehouse Door',event: 'connected',        message: 'Device reconnected after power cycle' },
  { id: 'DL-008', timestamp: '2025-01-14T17:55:00Z', deviceId: 'DEV-004', deviceName: 'Manteca Door Camera',        deviceModel: 'FaceID Pro X1',     doorName: 'Manteca Warehouse Door',event: 'disconnected',     message: 'Scheduled maintenance shutdown' },
];

// ── Emergency Logs ──────────────────────────────────────────────
export const emergencyLogs: EmergencyLog[] = [
  { id: 'EM-001', timestamp: '2025-01-15T10:15:00Z', deviceId: 'DEV-001', deviceName: 'HQ Main Door Camera',        branch: 'Headquarters',   alarmType: 'door_forced', severity: 'high',     message: 'HQ Main Door forced open without authentication',  resolved: false },
  { id: 'EM-002', timestamp: '2025-01-15T08:30:00Z', deviceId: 'DEV-002', deviceName: 'HQ Sub Door Camera',         branch: 'Headquarters',   alarmType: 'tamper',      severity: 'critical', message: 'Tamper detected on HQ Sub Door device',            resolved: true },
  { id: 'EM-003', timestamp: '2025-01-14T22:00:00Z', deviceId: 'DEV-003', deviceName: 'Cartersville Door Camera',   branch: 'Cartersville',   alarmType: 'intrusion',   severity: 'critical', message: 'Intrusion attempt detected after business hours',   resolved: true },
  { id: 'EM-004', timestamp: '2025-01-14T16:45:00Z', deviceId: 'DEV-001', deviceName: 'HQ Main Door Camera',        branch: 'Headquarters',   alarmType: 'door_held',   severity: 'medium',   message: 'HQ Main Door held open for over 60 seconds',       resolved: true },
  { id: 'EM-005', timestamp: '2025-01-13T09:20:00Z', deviceId: 'DEV-004', deviceName: 'Manteca Door Camera',        branch: 'Manteca',        alarmType: 'door_forced', severity: 'high',     message: 'Manteca warehouse door forced open',               resolved: true },
  { id: 'EM-006', timestamp: '2025-01-12T14:10:00Z', deviceId: 'DEV-005', deviceName: 'Savannah Door Camera',       branch: 'Savannah',       alarmType: 'fire',        severity: 'critical', message: 'Fire alarm triggered — all doors unlocked',         resolved: true },
];

// ── Authentication Logs ─────────────────────────────────────────
export const authenticationLogs: AuthenticationLog[] = [
  { id: 'AL-001', timestamp: '2025-01-15T10:30:00Z', employeeId: 'EMP-001', employeeName: 'John Smith',        employeeNo: 'E001', branch: 'Headquarters',   deviceName: 'HQ Main Door Camera',        doorName: 'HQ Main Door',          direction: 'entry', status: 'granted', method: 'face', confidence: 0.98, captureImage: facePhotos['John Smith'] },
  { id: 'AL-002', timestamp: '2025-01-15T10:28:00Z', employeeId: 'EMP-002', employeeName: 'Sarah Johnson',     employeeNo: 'E002', branch: 'Cartersville',   deviceName: 'Cartersville Door Camera',   doorName: 'Cartersville Entrance', direction: 'entry', status: 'granted', method: 'face', confidence: 0.95, captureImage: facePhotos['Sarah Johnson'] },
  { id: 'AL-003', timestamp: '2025-01-15T10:25:00Z', employeeId: 'EMP-003', employeeName: 'Michael Brown',     employeeNo: 'E003', branch: 'Headquarters',   deviceName: 'HQ Main Door Camera',        doorName: 'HQ Main Door',          direction: 'entry', status: 'denied',  method: 'face', confidence: 0.45, reason: 'Face recognition below threshold — expired validity', captureImage: facePhotos['Michael Brown'] },
  { id: 'AL-004', timestamp: '2025-01-15T10:20:00Z', employeeId: 'EMP-004', employeeName: 'Emily Davis',       employeeNo: 'E004', branch: 'Headquarters',   deviceName: 'HQ Sub Door Camera',         doorName: 'HQ Sub Door',           direction: 'entry', status: 'granted', method: 'face', confidence: 0.99, captureImage: facePhotos['Emily Davis'] },
  { id: 'AL-005', timestamp: '2025-01-15T10:15:00Z', employeeId: 'EMP-006', employeeName: 'Lisa Anderson',     employeeNo: 'E006', branch: 'Savannah',       deviceName: 'Savannah Door Camera',       doorName: 'Savannah Office Door',  direction: 'entry', status: 'granted', method: 'face', confidence: 0.97, captureImage: facePhotos['Lisa Anderson'] },
  { id: 'AL-006', timestamp: '2025-01-15T10:10:00Z', employeeId: 'EMP-007', employeeName: 'James Taylor',      employeeNo: 'E007', branch: 'Manteca',        deviceName: 'Manteca Door Camera',        doorName: 'Manteca Warehouse Door',direction: 'entry', status: 'granted', method: 'face', confidence: 0.92, captureImage: facePhotos['James Taylor'] },
  { id: 'AL-007', timestamp: '2025-01-15T10:05:00Z', employeeId: 'EMP-008', employeeName: 'Jennifer Martinez', employeeNo: 'E008', branch: 'Headquarters',   deviceName: 'HQ Main Door Camera',        doorName: 'HQ Main Door',          direction: 'entry', status: 'granted', method: 'face', confidence: 0.96, captureImage: facePhotos['Jennifer Martinez'] },
  { id: 'AL-008', timestamp: '2025-01-15T10:00:00Z',                        employeeName: 'Unknown Person',                        branch: 'Manteca',        deviceName: 'Manteca Door Camera',        doorName: 'Manteca Warehouse Door',direction: 'entry', status: 'denied',  method: 'face', confidence: 0.20, reason: 'Unregistered face detected', captureImage: facePhotos['Unknown Person'] },
  { id: 'AL-009', timestamp: '2025-01-15T09:55:00Z', employeeId: 'EMP-009', employeeName: 'Robert Thomas',     employeeNo: 'E009', branch: 'Savannah',       deviceName: 'Savannah Door Camera',       doorName: 'Savannah Office Door',  direction: 'entry', status: 'granted', method: 'face', confidence: 0.94, captureImage: facePhotos['Robert Thomas'] },
  { id: 'AL-010', timestamp: '2025-01-15T09:50:00Z', employeeId: 'EMP-010', employeeName: 'Maria Garcia',      employeeNo: 'E010', branch: 'Vietnam Office', deviceName: 'Vietnam Office Door Camera', doorName: 'Vietnam Office Door',   direction: 'entry', status: 'granted', method: 'face', confidence: 0.93, captureImage: facePhotos['Maria Garcia'] },
  { id: 'AL-011', timestamp: '2025-01-15T09:45:00Z', employeeId: 'EMP-011', employeeName: 'Nguyen Van A',      employeeNo: 'E011', branch: 'Vietnam Office', deviceName: 'Vietnam Office Door Camera', doorName: 'Vietnam Office Door',   direction: 'entry', status: 'granted', method: 'face', confidence: 0.96, captureImage: facePhotos['Nguyen Van A'] },
  { id: 'AL-012', timestamp: '2025-01-15T09:40:00Z', employeeId: 'EMP-012', employeeName: 'Tran Thi B',        employeeNo: 'E012', branch: 'Cartersville',   deviceName: 'Cartersville Door Camera',   doorName: 'Cartersville Entrance', direction: 'entry', status: 'granted', method: 'face', confidence: 0.91, captureImage: facePhotos['Tran Thi B'] },
  { id: 'AL-013', timestamp: '2025-01-15T17:35:00Z', employeeId: 'EMP-001', employeeName: 'John Smith',        employeeNo: 'E001', branch: 'Headquarters',   deviceName: 'HQ Main Door Camera',        doorName: 'HQ Main Door',          direction: 'exit',  status: 'granted', method: 'face', confidence: 0.97, captureImage: facePhotos['John Smith'] },
  { id: 'AL-014', timestamp: '2025-01-15T18:05:00Z', employeeId: 'EMP-004', employeeName: 'Emily Davis',       employeeNo: 'E004', branch: 'Headquarters',   deviceName: 'HQ Sub Door Camera',         doorName: 'HQ Sub Door',           direction: 'exit',  status: 'granted', method: 'face', confidence: 0.96, captureImage: facePhotos['Emily Davis'] },
];

// ── Occupancy Logs ──────────────────────────────────────────────
export const occupancyLogs: OccupancyLog[] = [
  { id: 'OC-001', date: '2025-01-15', employeeId: 'EMP-001', employeeName: 'John Smith',        employeeNo: 'E001', branch: 'Headquarters',   firstEntry: '08:02', lastExit: '17:35', totalHours: 9.55 },
  { id: 'OC-002', date: '2025-01-15', employeeId: 'EMP-002', employeeName: 'Sarah Johnson',     employeeNo: 'E002', branch: 'Cartersville',   firstEntry: '08:15', lastExit: '17:10', totalHours: 8.92 },
  { id: 'OC-003', date: '2025-01-15', employeeId: 'EMP-004', employeeName: 'Emily Davis',       employeeNo: 'E004', branch: 'Headquarters',   firstEntry: '07:50', lastExit: '18:05', totalHours: 10.25 },
  { id: 'OC-004', date: '2025-01-15', employeeId: 'EMP-006', employeeName: 'Lisa Anderson',     employeeNo: 'E006', branch: 'Savannah',       firstEntry: '08:30', lastExit: '17:00', totalHours: 8.50 },
  { id: 'OC-005', date: '2025-01-15', employeeId: 'EMP-007', employeeName: 'James Taylor',      employeeNo: 'E007', branch: 'Manteca',        firstEntry: '09:00', lastExit: '18:30', totalHours: 9.50 },
  { id: 'OC-006', date: '2025-01-15', employeeId: 'EMP-008', employeeName: 'Jennifer Martinez', employeeNo: 'E008', branch: 'Headquarters',   firstEntry: '07:45', lastExit: '17:45', totalHours: 10.00 },
  { id: 'OC-007', date: '2025-01-15', employeeId: 'EMP-009', employeeName: 'Robert Thomas',     employeeNo: 'E009', branch: 'Savannah',       firstEntry: '08:10', lastExit: '17:20', totalHours: 9.17 },
  { id: 'OC-008', date: '2025-01-15', employeeId: 'EMP-010', employeeName: 'Maria Garcia',      employeeNo: 'E010', branch: 'Vietnam Office', firstEntry: '08:25', lastExit: '16:50', totalHours: 8.42 },
  { id: 'OC-009', date: '2025-01-15', employeeId: 'EMP-011', employeeName: 'Nguyen Van A',      employeeNo: 'E011', branch: 'Vietnam Office', firstEntry: '08:00', lastExit: '17:30', totalHours: 9.50 },
  { id: 'OC-010', date: '2025-01-15', employeeId: 'EMP-012', employeeName: 'Tran Thi B',        employeeNo: 'E012', branch: 'Cartersville',   firstEntry: '08:20', lastExit: '17:15', totalHours: 8.92 },
  { id: 'OC-011', date: '2025-01-14', employeeId: 'EMP-001', employeeName: 'John Smith',        employeeNo: 'E001', branch: 'Headquarters',   firstEntry: '08:00', lastExit: '17:30', totalHours: 9.50 },
  { id: 'OC-012', date: '2025-01-14', employeeId: 'EMP-004', employeeName: 'Emily Davis',       employeeNo: 'E004', branch: 'Headquarters',   firstEntry: '07:55', lastExit: '18:00', totalHours: 10.08 },
];

// ── Dashboard computed stats ────────────────────────────────────
export const dashboardStats = {
  totalUsers: users.length,
  activeUsers: users.filter(u => u.status === 'active').length,
  totalDevices: devices.length,
  onlineDevices: devices.filter(d => d.status === 'online').length,
  totalBranches: branches.length,
  activeBranches: branches.filter(b => b.status === 'active').length,
  totalAccessEvents: accessLogs.length,
  grantedAccess: accessLogs.filter(l => l.status === 'granted').length,
  deniedAccess: accessLogs.filter(l => l.status === 'denied').length,
  totalDoors: doors.length,
  lockedDoors: doors.filter(d => d.status === 'locked').length,
  unlockedDoors: doors.filter(d => d.status === 'unlocked').length,
};
