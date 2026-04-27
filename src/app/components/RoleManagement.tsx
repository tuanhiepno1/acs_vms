import { useState } from 'react';
import { type Role, type Permission, type User } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { RequestRoleDialog } from './RequestRoleDialog';

interface RoleManagementProps {
  roles: Role[];
  permissions: Permission[];
  onUpdateRole: (id: string, updates: Partial<Role>) => void;
  onRequestRole?: (request: { requestedBy: string; roleName: string; roleDescription: string; permissions: string[] }) => void;
  canEdit?: boolean;
  canRequest?: boolean;
  currentUser?: User;
}

export function RoleManagement({ roles, permissions, onUpdateRole, onRequestRole, canEdit = true, canRequest = false, currentUser }: RoleManagementProps) {
  const [selectedRole, setSelectedRole] = useState<string>(roles[0]?.id || '');

  const currentRole = roles.find(r => r.id === selectedRole);

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (!currentRole) return;

    const updatedPermissions = checked
      ? [...currentRole.permissions, permissionId]
      : currentRole.permissions.filter(p => p !== permissionId);

    onUpdateRole(currentRole.id, { permissions: updatedPermissions });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900">Roles</h3>
          {canRequest && onRequestRole && currentUser && (
            <RequestRoleDialog
              permissions={permissions}
              currentUser={currentUser}
              onRequestRole={onRequestRole}
            />
          )}
        </div>
        <div className="space-y-2">
          {roles.map(role => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-colors ${
                selectedRole === role.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`size-3 rounded-full ${role.color}`} />
                  <div className="flex-1">
                    <CardTitle className="text-slate-900">{role.name}</CardTitle>
                    <CardDescription className="text-slate-600">
                      {role.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2">
        {currentRole && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentRole.name} Permissions</CardTitle>
                  <CardDescription>
                    {canEdit ? 'Configure what this role can access and do' : 'View what this role can access and do'}
                  </CardDescription>
                </div>
                <Badge className={`${currentRole.color} text-white`}>
                  {currentRole.permissions.length} permissions
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {permissions.map(permission => {
                  const isChecked = currentRole.permissions.includes(permission.id);
                  return (
                    <div key={permission.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`${currentRole.id}-${permission.id}`}
                        checked={isChecked}
                        onCheckedChange={canEdit ? (checked) => 
                          handlePermissionToggle(permission.id, checked as boolean)
                        : undefined}
                        disabled={!canEdit}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`${currentRole.id}-${permission.id}`}
                          className={`text-slate-900 ${canEdit ? 'cursor-pointer' : ''}`}
                        >
                          {permission.name}
                        </Label>
                        <p className="text-slate-600">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}