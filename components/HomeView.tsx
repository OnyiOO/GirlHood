import { useState } from 'react';
import { Shield, Phone, Users, Settings, MapPin, Clock, Flower2, User, Network, Menu, X, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DestinationTracker } from './DestinationTracker';
import type { View, EmergencyContact, UserProfile, CallHistory } from '../App';
import { translate, type Language } from '../utils/translations';

interface HomeViewProps {
  onStartCall: () => void;
  onNavigate: (view: View) => void;
  emergencyContacts: EmergencyContact[];
  language: Language;
  userProfile: UserProfile | null;
  callHistory: CallHistory[];
}

export function HomeView({ onStartCall, onNavigate, emergencyContacts, language, userProfile, callHistory }: HomeViewProps) {
  const t = (key: string) => translate(key, language);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCallDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return t('just_now');
    if (minutes < 60) return `${minutes}${t('m_ago')}`;
    if (hours < 24) return `${hours}${t('h_ago')}`;
    if (days === 1) return t('yesterday');
    return date.toLocaleDateString();
  };

  const handleNavigate = (view: View) => {
    setIsMenuOpen(false);
    onNavigate(view);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 via-pink-300 to-rose-300 dark:from-[#36122C] dark:to-[#36122C]/80 text-white p-4 relative overflow-hidden">
        {/* Decorative Flowers */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-30">
          <Flower2 className="w-full h-full text-pink-600 rotate-12" />
        </div>
        <div className="absolute top-2 right-8 w-24 h-24 opacity-25">
          <Flower2 className="w-full h-full text-rose-500 -rotate-45" />
        </div>
        <div className="absolute bottom-0 right-0 w-28 h-28 opacity-20">
          <Flower2 className="w-full h-full text-pink-500 rotate-[25deg]" />
        </div>
        <div className="absolute bottom-4 left-16 w-20 h-20 opacity-25">
          <Flower2 className="w-full h-full text-rose-400 -rotate-12" />
        </div>
        
        {/* Flower Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-soft-light pointer-events-none">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1657008462036-5a85c6ef0266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxvd2VycyUyMHBhdHRlcm58ZW58MXx8fHwxNzU5NjAyMjQ0fDB&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Flower pattern"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/30 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          {userProfile?.isVerified ? (
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-white/40 shadow-lg">
                <AvatarImage src={userProfile.profileImage} alt={userProfile.firstName} />
                <AvatarFallback className="bg-white/30 backdrop-blur-sm text-white">
                  {userProfile.firstName[0]}{userProfile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="drop-shadow-md">Hello, {userProfile.firstName}!</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-white/30 p-2 rounded-xl backdrop-blur-sm border border-white/40 shadow-lg">
                <Shield className="w-5 h-5" />
              </div>
              <h1 className="font-[ADLaM_Display] drop-shadow-md">{t('safeguard_ai')}</h1>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/30 backdrop-blur-sm"
            onClick={() => handleNavigate('settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-background">
        <div className="space-y-4 p-4">
          {/* Identity Verification Prompt */}
          {!userProfile?.isVerified && (
            <Card className="border-2 border-pink-400 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 dark:border-pink-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="bg-pink-500 rounded-full p-2">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-pink-900 dark:text-pink-200 mb-1">
                      {t('verify_identity_title')}
                    </h3>
                    <p className="text-pink-800 dark:text-pink-300 mb-3">
                      {t('verify_identity_message')}
                    </p>
                    <Button
                      onClick={() => handleNavigate('profile')}
                      className="bg-pink-500 hover:bg-pink-600 text-white"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('verify_now')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Destination Tracker */}
          <DestinationTracker />

          {/* Emergency Call Button */}
          <Card className="border-2 border-red-500 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 dark:border-red-900">
            <CardContent className="p-6 text-center">
              <div className="mb-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-3 animate-pulse">
                  <Phone className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="mb-2 text-gray-900 dark:text-[#B593A8]">{t('emergency_ai_call')}</h2>
              <p className="text-muted-foreground mb-4 text-sm">
                {t('start_instant_ai_call')}
              </p>
              <Button 
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white w-full"
                onClick={onStartCall}
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('start_emergency_call')}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t('recent_activity')}</CardTitle>
            </CardHeader>
            <CardContent>
              {callHistory.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('no_recent_safety_calls')}</p>
                  <p className="text-xs mt-1">{t('call_history_appear_here')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {callHistory.slice(0, 5).map((call) => (
                    <div 
                      key={call.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        call.hasAlerts ? 'bg-red-100 dark:bg-red-900/30' : 'bg-pink-100 dark:bg-pink-900/30'
                      }`}>
                        <Phone className={`w-5 h-5 ${
                          call.hasAlerts ? 'text-red-600 dark:text-red-400' : 'text-pink-600 dark:text-pink-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm">{t('call_with')} {call.aiName}</p>
                          {call.hasAlerts && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {t('alert_sent')}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatCallDate(call.date)}</span>
                          <span>•</span>
                          <span>{formatDuration(call.duration)}</span>
                          <span>•</span>
                          <span>{call.messageCount} {t('messages')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sidebar Menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-[300px] p-0 dark:bg-card dark:border-border">
          <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-pink-400 via-pink-300 to-rose-300 dark:from-pink-900 dark:to-rose-900 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/30 p-2 rounded-xl backdrop-blur-sm border border-white/40">
                  <Shield className="w-5 h-5" />
                </div>
                <SheetTitle className="text-white">{t('safeguard_ai')}</SheetTitle>
              </div>
            </div>
            <SheetDescription className="text-white/90 text-sm">
              {t('navigate_to_sections')}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col py-6">
            {/* Menu Items */}
            <button
              onClick={() => handleNavigate('profile')}
              className="flex items-center justify-between px-6 py-4 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-pink-100 dark:bg-pink-900/40 p-2 rounded-lg">
                  <User className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <span className="text-foreground">{t('identity_verification')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              onClick={() => handleNavigate('network')}
              className="flex items-center justify-between px-6 py-4 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-lg">
                  <Network className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-foreground">{t('my_network')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              onClick={() => handleNavigate('contacts')}
              className="flex items-center justify-between px-6 py-4 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-foreground">{t('emergency_contacts')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              onClick={() => handleNavigate('map')}
              className="flex items-center justify-between px-6 py-4 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-foreground">{t('location_sharing')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              onClick={() => handleNavigate('safety')}
              className="flex items-center justify-between px-6 py-4 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-foreground">{t('safety_features')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="border-t border-border my-4" />

            <button
              onClick={() => handleNavigate('settings')}
              className="flex items-center justify-between px-6 py-4 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="text-foreground">{t('settings')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
