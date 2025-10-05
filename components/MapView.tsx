import { useState } from 'react';
import { ArrowLeft, MapPin, Navigation, User, Flower2, Locate, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { View, NetworkUser } from '../App';
import { translate, type Language } from '../utils/translations';

interface MapViewProps {
  networkUsers: NetworkUser[];
  onNavigate: (view: View) => void;
  language: Language;
}

export function MapView({ networkUsers, onNavigate, language }: MapViewProps) {
  const t = (key: string) => translate(key, language);
  const [selectedUser, setSelectedUser] = useState<NetworkUser | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Filter users who are sharing their location
  const usersWithLocation = networkUsers.filter(
    user => user.locationSharing && user.location
  );

  // Calculate map bounds to center on all users
  const getMapCenter = () => {
    if (usersWithLocation.length === 0) return { lat: 40.7128, lng: -74.0060 }; // Default to NYC
    
    const avgLat = usersWithLocation.reduce((sum, user) => sum + (user.location?.lat || 0), 0) / usersWithLocation.length;
    const avgLng = usersWithLocation.reduce((sum, user) => sum + (user.location?.lng || 0), 0) / usersWithLocation.length;
    
    return { lat: avgLat, lng: avgLng };
  };

  const center = getMapCenter();

  // Convert lat/lng to pixel position on the map
  const getMarkerPosition = (user: NetworkUser) => {
    if (!user.location) return { x: 50, y: 50 };
    
    // Normalize coordinates to percentage
    const latDiff = user.location.lat - center.lat;
    const lngDiff = user.location.lng - center.lng;
    
    const x = 50 + (lngDiff * 1000 * zoomLevel); // Center + offset
    const y = 50 - (latDiff * 1000 * zoomLevel); // Invert Y axis for map coordinates
    
    return { x, y };
  };

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
        
        {/* Flower Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-soft-light pointer-events-none">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1657008462036-5a85c6ef0266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxvd2VycyUyMHBhdHRlcm58ZW58MXx8fHwxNzU5NjAyMjQ0fDB&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Flower pattern"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/30 backdrop-blur-sm"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="drop-shadow-md">{t('location_map')}</h1>
              <p className="text-white/95 text-sm drop-shadow">
                {usersWithLocation.length} {t('peers_sharing_location')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 overflow-hidden relative">
        {usersWithLocation.length === 0 ? (
          // Empty State
          <div className="h-full flex items-center justify-center p-6">
            <Card className="max-w-md w-full">
              <CardContent className="p-8 text-center">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full w-20 h-20 mx-auto mb-4">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="mb-2">{t('no_locations_shared')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('no_peers_sharing_location_yet')}
                </p>
                <Button 
                  onClick={() => onNavigate('network')}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  {t('go_to_network')}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Map View
          <div className="h-full relative">
            {/* Map Background - Stylized representation */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
              {/* Grid pattern to simulate map */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              
              {/* Decorative "streets" */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/3 left-0 right-0 h-2 bg-gray-400" style={{ transform: `rotate(-5deg)` }}></div>
                <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-400" style={{ transform: `rotate(3deg)` }}></div>
                <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-400" style={{ transform: `rotate(2deg)` }}></div>
                <div className="absolute left-2/3 top-0 bottom-0 w-2 bg-gray-400" style={{ transform: `rotate(-3deg)` }}></div>
              </div>
            </div>

            {/* User Markers */}
            <div className="absolute inset-0 overflow-hidden">
              {usersWithLocation.map((user) => {
                const position = getMarkerPosition(user);
                const isSelected = selectedUser?.id === user.id;
                
                return (
                  <div
                    key={user.id}
                    className="absolute transition-all duration-300 cursor-pointer"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: isSelected ? 20 : 10
                    }}
                    onClick={() => setSelectedUser(user)}
                  >
                    {/* Marker Pin */}
                    <div className={`relative ${isSelected ? 'scale-125' : 'scale-100'} transition-transform`}>
                      {/* Pulse animation for online users */}
                      {user.status === 'online' && (
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                      )}
                      
                      {/* Marker */}
                      <div className={`relative bg-pink-500 p-3 rounded-full border-4 border-white shadow-lg ${
                        user.status === 'online' ? 'ring-4 ring-green-400' : ''
                      }`}>
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Avatar badge */}
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md text-lg">
                        {user.avatar || '👤'}
                      </div>
                    </div>

                    {/* Info popup when selected */}
                    {isSelected && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 z-30">
                        <Card className="shadow-xl border-2 border-pink-300">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="text-3xl">{user.avatar || '👤'}</div>
                              <div className="flex-1">
                                <h4 className="mb-1">{user.name}</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {user.username}
                                </p>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge 
                                    variant={user.status === 'online' ? 'default' : 'secondary'}
                                    className={user.status === 'online' ? 'bg-green-500' : ''}
                                  >
                                    {user.status === 'online' ? t('online') : t('offline')}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {t('sharing_location')}
                                  </Badge>
                                </div>
                                {user.location?.address && (
                                  <p className="text-xs text-muted-foreground flex items-start gap-1">
                                    <Navigation className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    <span>{user.location.address}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="w-full mt-3 bg-pink-500 hover:bg-pink-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Could add navigation or directions here
                              }}
                            >
                              <Navigation className="w-4 h-4 mr-2" />
                              {t('get_directions')}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <Button
                size="icon"
                variant="secondary"
                className="bg-white hover:bg-gray-100 shadow-lg"
                onClick={() => setZoomLevel(Math.min(zoomLevel + 0.2, 3))}
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="bg-white hover:bg-gray-100 shadow-lg"
                onClick={() => setZoomLevel(Math.max(zoomLevel - 0.2, 0.5))}
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="bg-white hover:bg-gray-100 shadow-lg"
                onClick={() => {
                  setZoomLevel(1);
                  setSelectedUser(null);
                }}
              >
                <Locate className="w-5 h-5" />
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardContent className="p-3">
                  <h4 className="text-sm mb-2">{t('legend')}</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-pink-500 rounded-full ring-4 ring-green-400"></div>
                      <span>{t('online_sharing')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                      <span>{t('offline_sharing')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User List Sidebar */}
            <div className="absolute top-4 left-4 z-10 max-w-xs">
              <Card className="bg-white/95 backdrop-blur-sm max-h-96 overflow-y-auto">
                <CardContent className="p-4">
                  <h4 className="mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t('connected_peers')} ({usersWithLocation.length})
                  </h4>
                  <div className="space-y-2">
                    {usersWithLocation.map((user) => (
                      <button
                        key={user.id}
                        className={`w-full text-left p-2 rounded-lg transition-colors ${
                          selectedUser?.id === user.id
                            ? 'bg-pink-100 dark:bg-pink-900/30'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{user.avatar || '👤'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.username}
                            </p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
