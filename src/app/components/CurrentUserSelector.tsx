import { type User } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface CurrentUserSelectorProps {
  users: User[];
  currentUserId: string;
  onChangeUser: (userId: string) => void;
}

export function CurrentUserSelector({ users, currentUserId, onChangeUser }: CurrentUserSelectorProps) {
  const currentUser = users.find(u => u.id === currentUserId);

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'manager':
        return 'bg-blue-500';
      case 'user':
        return 'bg-green-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <div className="text-slate-900">{currentUser?.name}</div>
        <div className="text-slate-500">{currentUser?.role}</div>
      </div>
      <Select value={currentUserId} onValueChange={onChangeUser}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {users.filter(u => u.status === 'active').map(user => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center gap-2">
                <Badge className={`${getRoleBadgeClass(user.role)} text-white`}>
                  {user.role}
                </Badge>
                <span>{user.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
