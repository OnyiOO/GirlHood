import { Shield, Phone, Clock, ArrowLeft, Flower2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { View } from '../App';
import { translate, type Language } from '../utils/translations';

interface SafetyFeaturesViewProps {
  onNavigate: (view: View) => void;
  language: Language;
}

export function SafetyFeaturesView({ onNavigate, language }: SafetyFeaturesViewProps) {
  const t = (key: string) => translate(key, language);
  
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
        
        {/* Flower Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-soft-light pointer-events-none">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1657008462036-5a85c6ef0266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxvd2VycyUyMHBhdHRlcm58ZW58MXx8fHwxNzU5NjAyMjQ0fDB&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Flower pattern"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/30 backdrop-blur-sm"
            onClick={() => onNavigate('home')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="bg-white/30 p-2 rounded-xl backdrop-blur-sm border border-white/40 shadow-lg">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="font-[ADLaM_Display] drop-shadow-md">{t('safety_features')}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-background">
        <div className="space-y-4 p-4">
          {/* Introduction */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t('how_girlhood_protects')}</CardTitle>
              <CardDescription>
                {t('safety_features_intro')}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* AI Safety Companion */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[rgba(235,181,248,0.83)] dark:bg-purple-900/40 p-3 rounded-lg flex-shrink-0">
                  <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">AI Safety Companion</h3>
                  <p className="text-muted-foreground">
                    Our AI stays on the line with you, providing comfort and monitoring your safety in real-time. The AI companion can engage in realistic conversations, making it appear as if you're talking to a friend or family member, which can help deter potential threats.
                  </p>
                  <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <p className="text-sm">
                      <strong>Key Benefits:</strong>
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                      <li>24/7 availability - always there when you need support</li>
                      <li>Human-like conversation to appear natural in public</li>
                      <li>Multilingual support in your preferred language</li>
                      <li>Customizable AI name for personalization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Automatic Check-ins */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 dark:bg-orange-900/40 p-3 rounded-lg flex-shrink-0">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">Automatic Check-ins</h3>
                  <p className="text-muted-foreground">
                    Set up safety timers before entering potentially unsafe situations. If you don't check in within the specified time, your emergency contacts are automatically alerted with your last known location.
                  </p>
                  <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <p className="text-sm">
                      <strong>How it works:</strong>
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                      <li>Set a custom timer before your activity</li>
                      <li>Receive reminders to check in</li>
                      <li>Contacts notified if you don't respond</li>
                      <li>Share your real-time location with trusted network</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discreet Activation */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">Discreet Activation</h3>
                  <p className="text-muted-foreground">
                    Trigger safety features discreetly without drawing attention in dangerous situations. Our interface is designed to look like a normal phone call or messaging app.
                  </p>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-sm">
                      <strong>Discreet Features:</strong>
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                      <li>Quick activation from lock screen</li>
                      <li>Silent alerts to emergency contacts</li>
                      <li>Normal-looking call interface</li>
                      <li>Background location tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Features */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Additional Safety Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-pink-50 dark:bg-pink-950/30 rounded-lg">
                <h4 className="mb-1">Network Safety</h4>
                <p className="text-sm text-muted-foreground">
                  Connect with trusted friends and family to share locations and safety status in real-time.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <h4 className="mb-1">Location Sharing</h4>
                <p className="text-sm text-muted-foreground">
                  Share your live location with your network on an interactive map during your journey.
                </p>
              </div>
              
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <h4 className="mb-1">Identity Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Verify your identity to build trust within your safety network and access premium features.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
