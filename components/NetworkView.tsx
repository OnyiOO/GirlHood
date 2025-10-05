import { useState } from 'react';
import { ArrowLeft, Users, UserPlus, MapPin, Phone, Search, Check, X, Flower2, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import type { View } from '../App';
import type { NetworkUser, ConnectionRequest } from '../App';

interface NetworkViewProps {
  networkUsers: NetworkUser[];
  connectionRequests: ConnectionRequest[];
  onAddUser: (user: Omit<NetworkUser, 'id'>) => void;
  onRemoveUser: (id: string) => void;
  onToggleLocationSharing: (id: string) => void;
  onHandleRequest: (requestId: string, action: 'accept' | 'reject') => void;
  onNavigate: (view: View) => void;
}

export function NetworkView({ 
  networkUsers, 
  connectionRequests,
  onAddUser, 
  onRemoveUser,
  onToggleLocationSharing,
  onHandleRequest,
  onNavigate 
}: NetworkViewProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    phone: '',
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.username || !newUser.phone) {
      toast.error('Please fill in all fields');
      return;
    }

    onAddUser({
      ...newUser,
      status: 'offline',
      locationSharing: false,
      avatar: '👤'
    });

    toast.success(`Connection request sent to ${newUser.name}`);
    setNewUser({ name: '', username: '', phone: '' });
    setIsAddDialogOpen(false);
  };

  const handleCall = (user: NetworkUser) => {
    toast.success(`Calling ${user.name}...`);
  };

  const handleShareLocation = (user: NetworkUser) => {
    if (user.locationSharing) {
      toast.success(`Location sharing stopped with ${user.name}`);
    } else {
      toast.success(`Now sharing location with ${user.name}`);
    }
    onToggleLocationSharing(user.id);
  };

  const handleAcceptRequest = (request: ConnectionRequest) => {
    onHandleRequest(request.id, 'accept');
    toast.success(`You are now connected with ${request.name}`);
  };

  const handleRejectRequest = (request: ConnectionRequest) => {
    onHandleRequest(request.id, 'reject');
    toast.info(`Connection request from ${request.name} rejected`);
  };

  const filteredUsers = networkUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const receivedRequests = connectionRequests.filter(r => r.direction === 'received' && r.status === 'pending');
  const sentRequests = connectionRequests.filter(r => r.direction === 'sent' && r.status === 'pending');

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 via-pink-300 to-rose-300 text-white p-6 relative overflow-hidden">
        {/* Decorative Flowers */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-30">
          <Flower2 className="w-full h-full text-pink-600 rotate-12" />
        </div>
        <div className="absolute bottom-0 right-0 w-40 h-40 opacity-20">
          <Flower2 className="w-full h-full text-rose-600 -rotate-45" />
        </div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 opacity-25">
          <Flower2 className="w-full h-full text-pink-500 rotate-90" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('home')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8" />
              <div>
                <h1 className="text-2xl">My Network</h1>
                <p className="text-sm text-white/90">
                  {networkUsers.length} connections
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="connections">
              My Connections
              {networkUsers.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {networkUsers.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {receivedRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {receivedRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-4">
            {/* Search and Add */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search connections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-pink-500 hover:bg-pink-600">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Connection</DialogTitle>
                    <DialogDescription>
                      Send a connection request to another GirlHood user
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="@username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser} className="bg-pink-500 hover:bg-pink-600">
                      Send Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Connections List */}
            {filteredUsers.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">
                    {searchQuery ? 'No connections found' : 'No connections yet'}
                  </p>
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    {searchQuery ? 'Try a different search term' : 'Add users to start building your safety network'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="text-4xl">{user.avatar}</div>
                        
                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{user.name}</h3>
                            <div className="flex items-center gap-1">
                              <Circle 
                                className={`h-2 w-2 ${
                                  user.status === 'online' 
                                    ? 'fill-green-500 text-green-500' 
                                    : 'fill-gray-400 text-gray-400'
                                }`} 
                              />
                              <span className={`text-xs ${
                                user.status === 'online' 
                                  ? 'text-green-600' 
                                  : 'text-muted-foreground'
                              }`}>
                                {user.status === 'online' ? 'Online' : user.lastSeen || 'Offline'}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{user.username}</p>
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                          
                          {/* Location Sharing Toggle */}
                          <div className="flex items-center gap-2 mt-3 p-2 bg-muted/50 rounded-lg">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor={`location-${user.id}`} className="text-sm flex-1 cursor-pointer">
                              Share Location
                            </Label>
                            <Switch
                              id={`location-${user.id}`}
                              checked={user.locationSharing}
                              onCheckedChange={() => handleShareLocation(user)}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleCall(user)}
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              onRemoveUser(user.id);
                              toast.info(`Removed ${user.name} from your network`);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {/* Received Requests */}
            {receivedRequests.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Received Requests</h3>
                {receivedRequests.map((request) => (
                  <Card key={request.id} className="border-pink-200 bg-pink-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">👤</div>
                        <div className="flex-1">
                          <h3 className="font-medium">{request.name}</h3>
                          <p className="text-sm text-muted-foreground">{request.username}</p>
                          <p className="text-sm text-muted-foreground">{request.phone}</p>
                          <p className="text-xs text-muted-foreground mt-1">{request.timestamp}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(request)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRequest(request)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Sent Requests */}
            {sentRequests.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Sent Requests</h3>
                {sentRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">👤</div>
                        <div className="flex-1">
                          <h3 className="font-medium">{request.name}</h3>
                          <p className="text-sm text-muted-foreground">{request.username}</p>
                          <p className="text-sm text-muted-foreground">{request.phone}</p>
                          <Badge variant="secondary" className="mt-2">Pending</Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectRequest(request)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {receivedRequests.length === 0 && sentRequests.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">
                    No pending requests
                  </p>
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    Connection requests will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
