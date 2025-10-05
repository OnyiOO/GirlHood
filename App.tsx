import { useState, useEffect } from 'react';
import { HomeView } from './components/HomeView';
import { CallView } from './components/CallView';
import { ContactsView } from './components/ContactsView';
import { SettingsView } from './components/SettingsView';
import { ProfileView } from './components/ProfileView';
import { NetworkView } from './components/NetworkView';
import { MapView } from './components/MapView';
import { SafetyFeaturesView } from './components/SafetyFeaturesView';
import { Toaster } from './components/ui/sonner';
import type { Language } from './utils/translations';

export type View = 'home' | 'call' | 'contacts' | 'settings' | 'profile' | 'network' | 'map' | 'safety';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface NetworkUser {
  id: string;
  name: string;
  username: string;
  phone: string;
  status: 'online' | 'offline';
  locationSharing: boolean;
  lastSeen?: string;
  avatar?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

export interface ConnectionRequest {
  id: string;
  userId: string;
  name: string;
  username: string;
  phone: string;
  status: 'pending' | 'accepted' | 'rejected';
  direction: 'sent' | 'received';
  timestamp: string;
}

export type ColorScheme = 'pink' | 'blue' | 'purple' | 'green' | 'orange';

export interface UserProfile {
  firstName: string;
  lastName: string;
  profileImage: string;
  isVerified: boolean;
}

export interface CallHistory {
  id: string;
  date: Date;
  duration: number;
  messageCount: number;
  aiName: string;
  hasAlerts: boolean;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isInCall, setIsInCall] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [aiName, setAiName] = useState('Alex');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('pink');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [callHistory, setCallHistory] = useState<CallHistory[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Mom', phone: '+1 (555) 123-4567', relationship: 'Mother' },
    { id: '2', name: 'Best Friend', phone: '+1 (555) 987-6543', relationship: 'Friend' },
  ]);
  
  const [networkUsers, setNetworkUsers] = useState<NetworkUser[]>([
    { 
      id: '1', 
      name: 'Sarah Johnson', 
      username: '@sarahj', 
      phone: '+1 (555) 234-5678',
      status: 'online',
      locationSharing: true,
      avatar: '👩‍💼',
      location: {
        lat: 40.7589,
        lng: -73.9851,
        address: 'Times Square, New York, NY'
      }
    },
    { 
      id: '2', 
      name: 'Emily Chen', 
      username: '@emilyc', 
      phone: '+1 (555) 876-5432',
      status: 'offline',
      locationSharing: false,
      lastSeen: '2 hours ago',
      avatar: '👩'
    },
    { 
      id: '3', 
      name: 'Michael Torres', 
      username: '@mtorres', 
      phone: '+1 (555) 345-1234',
      status: 'online',
      locationSharing: true,
      avatar: '👨',
      location: {
        lat: 40.7614,
        lng: -73.9776,
        address: 'Central Park West, New York, NY'
      }
    },
    { 
      id: '4', 
      name: 'Jessica Lee', 
      username: '@jlee', 
      phone: '+1 (555) 876-9012',
      status: 'offline',
      locationSharing: true,
      lastSeen: '15 min ago',
      avatar: '👩‍🦰',
      location: {
        lat: 40.7484,
        lng: -73.9857,
        address: 'Empire State Building, New York, NY'
      }
    },
  ]);
  
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([
    {
      id: '1',
      userId: '3',
      name: 'Jessica Williams',
      username: '@jessicaw',
      phone: '+1 (555) 345-6789',
      status: 'pending',
      direction: 'received',
      timestamp: '2 min ago'
    },
  ]);

  const handleStartCall = () => {
    setIsInCall(true);
    setCurrentView('call');
  };

  const handleEndCall = (callData?: { duration: number; messageCount: number; hasAlerts: boolean }) => {
    setIsInCall(false);
    setCurrentView('home');
    
    // Save call to history if call data is provided
    if (callData) {
      const newCall: CallHistory = {
        id: Date.now().toString(),
        date: new Date(),
        duration: callData.duration,
        messageCount: callData.messageCount,
        aiName: aiName,
        hasAlerts: callData.hasAlerts,
      };
      setCallHistory([newCall, ...callHistory]);
    }
  };

  const addContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
  };

  const deleteContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(c => c.id !== id));
  };

  const addNetworkUser = (user: Omit<NetworkUser, 'id'>) => {
    const newUser = {
      ...user,
      id: Date.now().toString(),
    };
    setNetworkUsers([...networkUsers, newUser]);
  };

  const removeNetworkUser = (id: string) => {
    setNetworkUsers(networkUsers.filter(u => u.id !== id));
  };

  const toggleLocationSharing = (id: string) => {
    setNetworkUsers(networkUsers.map(u => 
      u.id === id ? { ...u, locationSharing: !u.locationSharing } : u
    ));
  };

  const handleConnectionRequest = (requestId: string, action: 'accept' | 'reject') => {
    const request = connectionRequests.find(r => r.id === requestId);
    if (request && action === 'accept') {
      // Add to network users
      addNetworkUser({
        name: request.name,
        username: request.username,
        phone: request.phone,
        status: 'offline',
        locationSharing: false,
        avatar: '👤'
      });
    }
    // Remove from requests
    setConnectionRequests(connectionRequests.filter(r => r.id !== requestId));
  };

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  // Apply dark mode class to document element so portals (like Sheet) inherit it
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="size-full bg-background">
      {currentView === 'home' && (
        <HomeView 
          onStartCall={handleStartCall}
          onNavigate={setCurrentView}
          emergencyContacts={emergencyContacts}
          language={language}
          userProfile={userProfile}
          callHistory={callHistory}
        />
      )}
      {currentView === 'call' && (
        <CallView 
          onEndCall={handleEndCall}
          isInCall={isInCall}
          emergencyContacts={emergencyContacts}
          language={language}
          aiName={aiName}
        />
      )}
      {currentView === 'contacts' && (
        <ContactsView 
          contacts={emergencyContacts}
          onAddContact={addContact}
          onDeleteContact={deleteContact}
          onNavigate={setCurrentView}
          language={language}
        />
      )}
      {currentView === 'settings' && (
        <SettingsView 
          onNavigate={setCurrentView}
          isDarkMode={isDarkMode}
          onToggleDarkMode={setIsDarkMode}
          language={language}
          onLanguageChange={setLanguage}
          aiName={aiName}
          onAiNameChange={setAiName}
          colorScheme={colorScheme}
          onColorSchemeChange={setColorScheme}
        />
      )}
      {currentView === 'profile' && (
        <ProfileView 
          onNavigate={setCurrentView} 
          language={language}
          onSaveProfile={handleSaveProfile}
          savedProfile={userProfile}
        />
      )}
      {currentView === 'network' && (
        <NetworkView 
          networkUsers={networkUsers}
          connectionRequests={connectionRequests}
          onAddUser={addNetworkUser}
          onRemoveUser={removeNetworkUser}
          onToggleLocationSharing={toggleLocationSharing}
          onHandleRequest={handleConnectionRequest}
          onNavigate={setCurrentView}
          language={language}
        />
      )}
      {currentView === 'map' && (
        <MapView 
          networkUsers={networkUsers}
          onNavigate={setCurrentView}
          language={language}
        />
      )}
      {currentView === 'safety' && (
        <SafetyFeaturesView 
          onNavigate={setCurrentView}
          language={language}
        />
      )}
      <Toaster />
    </div>
  );
}
