import { useState, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle, Clock, AlertCircle, X, Flower2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';

interface Journey {
  destination: string;
  startTime: Date;
  estimatedArrival: Date;
  distance: number; // in miles
  currentDistance: number; // remaining distance
  status: 'active' | 'arrived' | 'delayed';
}

export function DestinationTracker() {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [destination, setDestination] = useState('');
  const [isSettingDestination, setIsSettingDestination] = useState(false);

  // Simulate location updates
  useEffect(() => {
    if (!journey || journey.status !== 'active') return;

    const interval = setInterval(() => {
      setJourney(prev => {
        if (!prev) return null;

        const newDistance = Math.max(0, prev.currentDistance - 0.2);
        const progress = ((prev.distance - newDistance) / prev.distance) * 100;

        // Check if arrived (within 0.1 miles)
        if (newDistance <= 0.1) {
          toast.success('🎉 You\'ve arrived safely at your destination!', {
            description: 'Your emergency contacts have been notified.',
          });
          return {
            ...prev,
            currentDistance: 0,
            status: 'arrived' as const,
          };
        }

        // Check if delayed (past estimated arrival)
        const isDelayed = new Date() > prev.estimatedArrival && newDistance > 0.5;
        if (isDelayed && prev.status !== 'delayed') {
          toast.warning('⚠️ You haven\'t arrived yet', {
            description: 'Would you like to alert your emergency contacts?',
          });
          return {
            ...prev,
            currentDistance: newDistance,
            status: 'delayed' as const,
          };
        }

        return {
          ...prev,
          currentDistance: newDistance,
        };
      });
    }, 2000); // Update every 2 seconds (simulated)

    return () => clearInterval(interval);
  }, [journey]);

  const handleStartTracking = () => {
    if (!destination.trim()) {
      toast.error('Please enter a destination');
      return;
    }

    const startTime = new Date();
    const estimatedMinutes = 15 + Math.random() * 20; // Random 15-35 minutes
    const estimatedArrival = new Date(startTime.getTime() + estimatedMinutes * 60000);
    const distance = 2 + Math.random() * 8; // Random 2-10 miles

    const newJourney: Journey = {
      destination,
      startTime,
      estimatedArrival,
      distance,
      currentDistance: distance,
      status: 'active',
    };

    setJourney(newJourney);
    setIsSettingDestination(false);
    setDestination('');
    
    toast.success('Tracking started!', {
      description: 'Your emergency contacts will be notified when you arrive.',
    });
  };

  const handleCancelTracking = () => {
    setJourney(null);
    toast.info('Destination tracking cancelled');
  };

  const handleConfirmArrival = () => {
    if (journey) {
      setJourney({
        ...journey,
        currentDistance: 0,
        status: 'arrived',
      });
      toast.success('✓ Arrival confirmed!', {
        description: 'Your emergency contacts have been notified.',
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProgress = () => {
    if (!journey) return 0;
    return ((journey.distance - journey.currentDistance) / journey.distance) * 100;
  };

  const getStatusColor = () => {
    if (!journey) return 'bg-gray-500';
    switch (journey.status) {
      case 'active':
        return 'bg-blue-500';
      case 'arrived':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!journey && !isSettingDestination) {
    return (
      <Card className="border-2 border-pink-200 dark:border-[#36122C] bg-gradient-to-br from-pink-50 to-rose-50 dark:from-[#36122C] dark:to-[#36122C]/80 relative overflow-hidden">
        {/* Decorative flowers */}
        <div className="absolute top-2 right-2 opacity-20">
          <Flower2 className="w-16 h-16 text-pink-400 rotate-12" />
        </div>
        
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-pink-200 p-2 rounded-lg">
              <Navigation className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <CardTitle>Safe Arrival Tracking</CardTitle>
              <CardDescription>
                Get peace of mind by tracking your journey to your destination
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-sm text-muted-foreground mb-4">
            Set your destination and we'll monitor your location. Your emergency contacts will be notified when you arrive safely.
          </p>
          <Button 
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            onClick={() => setIsSettingDestination(true)}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Set Destination
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isSettingDestination && !journey) {
    return (
      <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Set Your Destination</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsSettingDestination(false);
                setDestination('');
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Enter where you're headed so we can track your safe arrival
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination Address</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., 123 Main St, New York, NY"
              className="bg-white"
              onKeyDown={(e) => e.key === 'Enter' && handleStartTracking()}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsSettingDestination(false);
                setDestination('');
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
              onClick={handleStartTracking}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Start Tracking
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (journey) {
    return (
      <Card className={`border-2 ${
        journey.status === 'arrived' 
          ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50' 
          : journey.status === 'delayed'
          ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50'
          : 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50'
      } relative overflow-hidden`}>
        {/* Decorative elements */}
        {journey.status === 'arrived' && (
          <div className="absolute top-0 right-0 opacity-20">
            <Flower2 className="w-24 h-24 text-green-400 -rotate-12" />
          </div>
        )}
        
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className={`${
                journey.status === 'arrived' ? 'bg-green-200' :
                journey.status === 'delayed' ? 'bg-orange-200' : 'bg-blue-200'
              } p-2 rounded-lg`}>
                {journey.status === 'arrived' ? (
                  <CheckCircle className={`w-5 h-5 ${
                    journey.status === 'arrived' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                ) : (
                  <Navigation className={`w-5 h-5 ${
                    journey.status === 'delayed' ? 'text-orange-600' : 'text-blue-600'
                  }`} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-base">
                    {journey.status === 'arrived' ? 'Arrived Safely!' : 'Tracking Journey'}
                  </CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor()} text-white border-0`}
                  >
                    {journey.status === 'active' ? 'En Route' : 
                     journey.status === 'arrived' ? 'Arrived' : 'Delayed'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{journey.destination}</span>
                </div>
              </div>
            </div>
            {journey.status !== 'arrived' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancelTracking}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 relative z-10">
          {journey.status !== 'arrived' && (
            <>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{Math.round(getProgress())}%</span>
                </div>
                <Progress value={getProgress()} className="h-2" />
              </div>

              {/* Journey Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>ETA</span>
                  </div>
                  <p className="font-medium">{formatTime(journey.estimatedArrival)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>Distance</span>
                  </div>
                  <p className="font-medium">{journey.currentDistance.toFixed(1)} mi</p>
                </div>
              </div>

              {/* Delayed Warning */}
              {journey.status === 'delayed' && (
                <div className="bg-orange-100 border border-orange-300 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-orange-900">
                        You haven't arrived at your expected time. Everything okay?
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="mt-2 bg-white border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        Alert Emergency Contacts
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Confirmation */}
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={handleConfirmArrival}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm I've Arrived Safely
              </Button>
            </>
          )}

          {journey.status === 'arrived' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-3">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-green-900 mb-2">You Made It!</h3>
              <p className="text-sm text-green-800 mb-4">
                Arrived at {formatTime(new Date())}
              </p>
              <Button
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
                onClick={handleCancelTracking}
              >
                End Tracking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
