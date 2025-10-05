import { ArrowLeft, Bell, MapPin, Shield, Moon, Globe, Flower2, User, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { View, ColorScheme } from '../App';
import { translate, languages, type Language } from '../utils/translations';

interface SettingsViewProps {
  onNavigate: (view: View) => void;
  isDarkMode: boolean;
  onToggleDarkMode: (enabled: boolean) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  aiName: string;
  onAiNameChange: (name: string) => void;
  colorScheme: ColorScheme;
  onColorSchemeChange: (scheme: ColorScheme) => void;
}

export function SettingsView({ onNavigate, isDarkMode, onToggleDarkMode, language, onLanguageChange, aiName, onAiNameChange, colorScheme, onColorSchemeChange }: SettingsViewProps) {
  const t = (key: string) => translate(key, language);
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 via-pink-300 to-rose-300 text-white p-6 relative overflow-hidden">
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
            src="https://images.unsplash.com/photo-1657008462036-5a85c6ef0266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxvd2VycyUyMHBhdHRlcm58ZW58MXx8fHwxNzU5NjAyMjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Flower pattern"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/30 backdrop-blur-sm"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="drop-shadow-md">{t('settings')}</h1>
          </div>
          <p className="text-white/95 ml-14 drop-shadow">Customize your safety preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile & Verification Link */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow border-pink-200 dark:border-pink-800 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/40"
            onClick={() => onNavigate('profile')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-500 dark:bg-pink-600 p-2 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-pink-900 dark:text-pink-200">{t('profile')} & {t('identity_verification')}</h3>
                    <p className="text-sm text-pink-700 dark:text-pink-300">
                      {t('verify_identity')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
            </CardContent>
          </Card>
          
          {/* Notifications */}
          <Card className="dark:bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>{t('notifications')}</CardTitle>
                  <CardDescription className="dark:text-muted-foreground">Manage how you receive alerts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts on your device
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Emergency Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about nearby emergencies
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Check-in Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders for scheduled safety check-ins
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="dark:bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle>{t('location_services')}</CardTitle>
                  <CardDescription className="dark:text-muted-foreground">Control location tracking</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Always Allow Location</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable continuous location tracking
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share with Emergency Contacts</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically share location during calls
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Location History</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep a log of your locations
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="dark:bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription className="dark:text-muted-foreground">Protect your data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>End-to-End Encryption</Label>
                  <p className="text-sm text-muted-foreground">
                    Encrypt all communications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Biometric Lock</Label>
                  <p className="text-sm text-muted-foreground">
                    Require fingerprint or face ID
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Delete Call Records</Label>
                  <p className="text-sm text-muted-foreground">
                    Delete call history after 30 days
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="dark:bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <CardTitle>{t('appearance')}</CardTitle>
                  <CardDescription className="dark:text-muted-foreground">Customize app appearance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('dark_mode')}</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme
                  </p>
                </div>
                <Switch 
                  checked={isDarkMode}
                  onCheckedChange={onToggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="dark:bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 dark:bg-orange-900/40 p-2 rounded-lg">
                  <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle>{t('language')}</CardTitle>
                  <CardDescription className="dark:text-muted-foreground">{t('select_language')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>{t('language')}</Label>
                <Select value={language} onValueChange={(value) => onLanguageChange(value as Language)}>
                  <SelectTrigger className="dark:bg-input-background dark:border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-popover dark:border-border">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  AI will translate all content to your selected language
                </p>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 dark:border-purple-800/30">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-pink-600 dark:to-purple-600 text-white p-3 rounded-xl w-fit mx-auto mb-4 shadow-lg">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="mb-2 text-gray-800 dark:text-pink-300">{t('safeguard_ai')}</h3>
                <p className="text-sm text-gray-600 dark:text-pink-200/80 mb-4">{t('version')}</p>
                <p className="text-sm text-muted-foreground dark:text-pink-200/60">
                  {t('trusted_companion')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
