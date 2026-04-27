import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { accounts as defaultAccounts } from '../data/staticData';

export type ModuleId = 'acs' | 'vms';

export interface User {
  username: string;
  displayName: string;
  role: string;
  avatarInitials: string;
  licensedModules: ModuleId[];
}

interface UserRecord extends User {
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasModule: (moduleId: ModuleId) => boolean;
  // Admin account management
  accounts: User[];
  addAccount: (data: {
    username: string;
    password: string;
    displayName: string;
    role: string;
    licensedModules: ModuleId[];
  }) => { success: boolean; error?: string };
  updateAccountModules: (username: string, modules: ModuleId[]) => void;
  deleteAccount: (username: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = 'secure_access_auth';
const ACCOUNTS_KEY = 'secure_access_accounts';
const ACCOUNTS_HASH_KEY = 'secure_access_accounts_hash';

function getInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  );
}

// Simple hash to detect when staticData changes
function hashCode(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

// Build default accounts from staticData — edit accounts in src/app/data/staticData.ts
const DEFAULT_ACCOUNTS: UserRecord[] = defaultAccounts.map((acc) => ({
  ...acc,
  avatarInitials: getInitials(acc.displayName),
}));

const SOURCE_HASH = hashCode(JSON.stringify(defaultAccounts));

function loadAccounts(): UserRecord[] {
  // If staticData changed since last cache, reset localStorage
  if (localStorage.getItem(ACCOUNTS_HASH_KEY) !== SOURCE_HASH) {
    localStorage.removeItem(ACCOUNTS_KEY);
    localStorage.setItem(ACCOUNTS_HASH_KEY, SOURCE_HASH);
    return DEFAULT_ACCOUNTS;
  }
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return DEFAULT_ACCOUNTS;
}

function stripPassword(record: UserRecord): User {
  const { password: _, ...user } = record;
  return user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<UserRecord[]>(loadAccounts);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'Administrator';

  // Persist accounts
  useEffect(() => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(records));
  }, [records]);

  // Persist auth session
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const login = useCallback(
    async (username: string, password: string) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const record = records.find(
        (r) => r.username.toLowerCase() === username.toLowerCase(),
      );
      if (!record || record.password !== password) {
        return { success: false, error: 'Invalid username or password' };
      }

      setUser(stripPassword(record));
      return { success: true };
    },
    [records],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const hasModule = useCallback(
    (moduleId: ModuleId) => user?.licensedModules.includes(moduleId) ?? false,
    [user],
  );

  // Admin: account list (passwords stripped)
  const accounts = useMemo(() => records.map(stripPassword), [records]);

  const addAccount = useCallback(
    (data: {
      username: string;
      password: string;
      displayName: string;
      role: string;
      licensedModules: ModuleId[];
    }) => {
      const username = data.username.toLowerCase().trim();
      if (!username) return { success: false, error: 'Username is required' };
      if (!data.password) return { success: false, error: 'Password is required' };
      if (!data.displayName.trim()) return { success: false, error: 'Display name is required' };
      if (records.some((r) => r.username === username)) {
        return { success: false, error: 'Username already exists' };
      }

      const newRecord: UserRecord = {
        username,
        password: data.password,
        displayName: data.displayName.trim(),
        role: data.role,
        avatarInitials: getInitials(data.displayName),
        licensedModules: data.licensedModules,
      };
      setRecords((prev) => [...prev, newRecord]);
      return { success: true };
    },
    [records],
  );

  const updateAccountModules = useCallback(
    (username: string, modules: ModuleId[]) => {
      setRecords((prev) =>
        prev.map((r) => (r.username === username ? { ...r, licensedModules: modules } : r)),
      );
    },
    [],
  );

  const deleteAccount = useCallback(
    (username: string) => {
      if (username === user?.username) {
        return { success: false, error: 'Cannot delete your own account' };
      }
      setRecords((prev) => prev.filter((r) => r.username !== username));
      return { success: true };
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAdmin,
        login,
        logout,
        hasModule,
        accounts,
        addAccount,
        updateAccountModules,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
