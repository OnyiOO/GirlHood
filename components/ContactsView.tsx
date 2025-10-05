import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Phone, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import type { View, EmergencyContact } from '../App';

interface ContactsViewProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  onDeleteContact: (id: string) => void;
  onNavigate: (view: View) => void;
}

export function ContactsView({ contacts, onAddContact, onDeleteContact, onNavigate }: ContactsViewProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      toast.error('Please fill in all fields');
      return;
    }

    onAddContact(newContact);
    setNewContact({ name: '', phone: '', relationship: '' });
    setIsAddDialogOpen(false);
    toast.success('Emergency contact added successfully');
  };

  const handleDeleteContact = (id: string, name: string) => {
    onDeleteContact(id);
    toast.success(`${name} removed from emergency contacts`);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1>Emergency Contacts</h1>
          </div>
          <p className="text-white/90 ml-14">Manage people who can be alerted in emergencies</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Add Contact Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Emergency Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emergency Contact</DialogTitle>
                <DialogDescription>
                  Add someone who can be notified during emergencies
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    placeholder="Friend, Family, etc."
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddContact} className="bg-blue-600 hover:bg-blue-700">
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Contacts List */}
          {contacts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="mb-2">No Emergency Contacts</h3>
                <p className="text-muted-foreground mb-4">
                  Add trusted contacts who can be alerted during emergencies
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle>{contact.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {contact.relationship}
                          </CardDescription>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{contact.phone}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteContact(contact.id, contact.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="mb-2 text-blue-900">How Emergency Contacts Work</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Contacts are notified when you trigger an emergency alert</li>
                <li>• They receive your real-time location and status updates</li>
                <li>• You can add up to 5 emergency contacts</li>
                <li>• All contact information is stored securely</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
