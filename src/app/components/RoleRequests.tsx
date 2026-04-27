import { type RoleRequest, type User, type Permission } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Check, X, Clock } from 'lucide-react';

interface RoleRequestsProps {
  requests: RoleRequest[];
  users: User[];
  permissions: Permission[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function RoleRequests({ requests, users, permissions, onApprove, onReject }: RoleRequestsProps) {
  const getPermissionNames = (permissionIds: string[]) => {
    return permissionIds
      .map(id => permissions.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="size-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-slate-900 mb-2">No Role Requests</h3>
        <p className="text-slate-600">
          When managers request new roles, they will appear here for review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-slate-900">Pending Requests</h3>
          {pendingRequests.map(request => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{request.roleName}</CardTitle>
                    <CardDescription>
                      Requested by {request.requestedBy} on {formatDate(request.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="size-3" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-slate-600 mb-2">Description:</p>
                  <p className="text-slate-900">{request.roleDescription}</p>
                </div>
                <div>
                  <p className="text-slate-600 mb-2">Requested Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {request.permissions.map(permId => {
                      const perm = permissions.find(p => p.id === permId);
                      return perm ? (
                        <Badge key={permId} variant="outline">
                          {perm.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => onApprove(request.id)} className="flex-1">
                    <Check className="size-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    onClick={() => onReject(request.id)} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <X className="size-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {processedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-slate-900">Processed Requests</h3>
          {processedRequests.map(request => (
            <Card key={request.id} className="opacity-60">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{request.roleName}</CardTitle>
                    <CardDescription>
                      Requested by {request.requestedBy} on {formatDate(request.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge 
                    className={request.status === 'approved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                  >
                    {request.status === 'approved' ? (
                      <><Check className="size-3 mr-1" /> Approved</>
                    ) : (
                      <><X className="size-3 mr-1" /> Rejected</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-slate-600">{request.roleDescription}</p>
                <div className="flex flex-wrap gap-2">
                  {request.permissions.map(permId => {
                    const perm = permissions.find(p => p.id === permId);
                    return perm ? (
                      <Badge key={permId} variant="outline">
                        {perm.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
