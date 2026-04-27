import { useState, type FormEvent } from 'react';
import { type Permission, type User } from '../types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface RequestRoleDialogProps {
  permissions: Permission[];
  currentUser: User;
  onRequestRole: (request: { requestedBy: string; roleName: string; roleDescription: string; permissions: string[] }) => void;
}

export function RequestRoleDialog({ permissions, currentUser, onRequestRole }: RequestRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    roleName: '',
    roleDescription: '',
    selectedPermissions: [] as string[],
  });

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        selectedPermissions: [...formData.selectedPermissions, permissionId],
      });
    } else {
      setFormData({
        ...formData,
        selectedPermissions: formData.selectedPermissions.filter(p => p !== permissionId),
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.roleName || !formData.roleDescription || formData.selectedPermissions.length === 0) {
      toast.error('Please fill in all fields and select at least one permission');
      return;
    }

    onRequestRole({
      requestedBy: currentUser.name,
      roleName: formData.roleName,
      roleDescription: formData.roleDescription,
      permissions: formData.selectedPermissions,
    });

    toast.success('Role request submitted for admin approval');

    setFormData({
      roleName: '',
      roleDescription: '',
      selectedPermissions: [],
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4 mr-2" />
          Request Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request New Role</DialogTitle>
          <DialogDescription>
            Submit a request to create a new role. An administrator will review your request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              value={formData.roleName}
              onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
              placeholder="e.g., Content Editor"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roleDescription">Description</Label>
            <Textarea
              id="roleDescription"
              value={formData.roleDescription}
              onChange={(e) => setFormData({ ...formData, roleDescription: e.target.value })}
              placeholder="Describe the purpose and scope of this role"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="space-y-3 border rounded-lg p-4">
              {permissions.map(permission => (
                <div key={permission.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={`request-${permission.id}`}
                    checked={formData.selectedPermissions.includes(permission.id)}
                    onCheckedChange={(checked) => 
                      handlePermissionToggle(permission.id, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`request-${permission.id}`}
                      className="text-slate-900 cursor-pointer"
                    >
                      {permission.name}
                    </Label>
                    <p className="text-slate-600">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
