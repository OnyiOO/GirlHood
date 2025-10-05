import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Upload, Shield, CheckCircle, AlertCircle, Camera, User, MapPin, CreditCard, Flower2, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import type { View, UserProfile } from '../App';
import { translate, type Language } from '../utils/translations';

interface ProfileViewProps {
  onNavigate: (view: View) => void;
  language: Language;
  onSaveProfile: (profile: UserProfile) => void;
  savedProfile: UserProfile | null;
}

type VerificationStatus = 'unverified' | 'pending' | 'verified';

interface ProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
}

export function ProfileView({ onNavigate, language, onSaveProfile, savedProfile }: ProfileViewProps) {
  const t = (key: string) => translate(key, language);
  
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(
    savedProfile?.isVerified ? 'verified' : 'unverified'
  );
  const [profileImage, setProfileImage] = useState<string>(savedProfile?.profileImage || '');
  const [idFrontImage, setIdFrontImage] = useState<string>('');
  const [idBackImage, setIdBackImage] = useState<string>('');
  const [selectedIdType, setSelectedIdType] = useState<string>('');
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: savedProfile?.firstName || '',
    lastName: savedProfile?.lastName || '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    email: '',
  });

  const completionPercentage = useMemo(() => {
    const fields = Object.values(profileData).filter(v => v !== '').length;
    const hasProfileImage = profileImage !== '';
    const hasIdImages = idFrontImage !== '' && idBackImage !== '';
    const hasIdType = selectedIdType !== '';
    
    const total = 9; // profile fields
    const completed = fields + (hasProfileImage ? 1 : 0) + (hasIdImages ? 2 : 0) + (hasIdType ? 1 : 0);
    
    return Math.round((completed / (total + 4)) * 100);
  }, [profileData, profileImage, idFrontImage, idBackImage, selectedIdType]);

  const handleImageUpload = (type: 'profile' | 'idFront' | 'idBack') => {
    // Simulate image upload with placeholder
    const placeholders = {
      profile: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      idFront: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"%3E%3Crect fill="%23e0e0e0" width="200" height="120"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23666"%3EID Front%3C/text%3E%3C/svg%3E',
      idBack: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"%3E%3Crect fill="%23e0e0e0" width="200" height="120"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23666"%3EID Back%3C/text%3E%3C/svg%3E'
    };
    
    if (type === 'profile') {
      setProfileImage(placeholders.profile);
      toast.success('Profile photo uploaded successfully');
    } else if (type === 'idFront') {
      setIdFrontImage(placeholders.idFront);
      toast.success('ID front uploaded successfully');
    } else {
      setIdBackImage(placeholders.idBack);
      toast.success('ID back uploaded successfully');
    }
  };

  const handleSubmitVerification = () => {
    if (completionPercentage < 100) {
      toast.error('Please complete all required fields');
      return;
    }

    setVerificationStatus('pending');
    toast.success('Verification submitted! We\'ll review your information within 24 hours.');
    
    // Simulate verification approval after 3 seconds
    setTimeout(() => {
      setVerificationStatus('verified');
      toast.success('Identity verified! Your account is now fully secure.');
      
      // Save profile to parent
      onSaveProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        profileImage: profileImage,
        isVerified: true,
      });
    }, 3000);
  };

  const updateProfileData = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50">
            <Shield className="w-3 h-3 mr-1" />
            Unverified
          </Badge>
        );
    }
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
            <h1 className="drop-shadow-md">Profile & Verification</h1>
          </div>
          <p className="text-white/95 ml-14 drop-shadow">Verify your identity for enhanced safety</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Security Notice */}
          <Card className="border-pink-200 bg-pink-50 dark:border-pink-900/50 dark:bg-pink-950/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-pink-900 dark:text-pink-100">
                    <strong>Your privacy is protected.</strong> All information is encrypted and stored securely. 
                    ID verification helps emergency responders identify you quickly in critical situations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 dark:bg-pink-900/40 p-2 rounded-lg">
                    <Shield className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <CardTitle>{t('verification_status')}</CardTitle>
                    <CardDescription>{t('complete_profile_unlock')}</CardDescription>
                  </div>
                </div>
                {getStatusBadge()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Profile Completion</span>
                  <span className="text-pink-600 dark:text-pink-400">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 dark:bg-pink-900/40 p-2 rounded-lg">
                  <Camera className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>Upload a clear photo of yourself</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback className="bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  onClick={() => handleImageUpload('profile')}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 dark:bg-pink-900/40 p-2 rounded-lg">
                  <User className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Enter your details as they appear on your ID</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => updateProfileData('firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => updateProfileData('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => updateProfileData('dateOfBirth', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => updateProfileData('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => updateProfileData('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 dark:bg-pink-900/40 p-2 rounded-lg">
                  <MapPin className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <CardTitle>Address</CardTitle>
                  <CardDescription>Your current residential address</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => updateProfileData('address', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => updateProfileData('city', e.target.value)}
                    placeholder="San Francisco"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={profileData.state}
                    onChange={(e) => updateProfileData('state', e.target.value)}
                    placeholder="CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={profileData.zipCode}
                    onChange={(e) => updateProfileData('zipCode', e.target.value)}
                    placeholder="94102"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Government ID Verification */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 dark:bg-pink-900/40 p-2 rounded-lg">
                  <CreditCard className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <CardTitle>Government ID Verification</CardTitle>
                  <CardDescription>Upload a valid government-issued ID for verification</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="idType">ID Type *</Label>
                <Select value={selectedIdType} onValueChange={setSelectedIdType}>
                  <SelectTrigger id="idType">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="state_id">State ID</SelectItem>
                    <SelectItem value="national_id">National ID Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Front of ID */}
                <div className="space-y-2">
                  <Label>Front of ID *</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-pink-400 dark:hover:border-pink-500 transition-colors">
                    {idFrontImage ? (
                      <div className="space-y-2">
                        <img src={idFrontImage} alt="ID Front" className="w-full h-32 object-cover rounded" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleImageUpload('idFront')}
                          className="w-full"
                        >
                          Replace
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => handleImageUpload('idFront')}
                        className="w-full h-32 flex flex-col items-center justify-center"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Upload Front</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Back of ID */}
                <div className="space-y-2">
                  <Label>Back of ID *</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-pink-400 dark:hover:border-pink-500 transition-colors">
                    {idBackImage ? (
                      <div className="space-y-2">
                        <img src={idBackImage} alt="ID Back" className="w-full h-32 object-cover rounded" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleImageUpload('idBack')}
                          className="w-full"
                        >
                          Replace
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => handleImageUpload('idBack')}
                        className="w-full h-32 flex flex-col items-center justify-center"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Upload Back</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-3 text-sm text-blue-900 dark:text-blue-100">
                <p>
                  <strong>Tips for best results:</strong>
                </p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Ensure all text is clearly visible and readable</li>
                  <li>Take photos in good lighting without glare</li>
                  <li>Include all four corners of the ID</li>
                  <li>Use a dark background for contrast</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="border-pink-200 dark:border-pink-900/50 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-pink-900 dark:text-pink-100">Ready to verify?</h3>
                  <p className="text-sm text-pink-700 dark:text-pink-300 mt-1">
                    {verificationStatus === 'verified' 
                      ? 'Your identity has been verified!' 
                      : verificationStatus === 'pending'
                      ? 'Your verification is being reviewed...'
                      : 'Submit your information for review'}
                  </p>
                </div>
                <Button
                  onClick={handleSubmitVerification}
                  disabled={verificationStatus === 'verified' || verificationStatus === 'pending'}
                  className="bg-pink-500 hover:bg-pink-600"
                  size="lg"
                >
                  {verificationStatus === 'verified' 
                    ? 'Verified ✓' 
                    : verificationStatus === 'pending'
                    ? 'Reviewing...'
                    : 'Submit for Verification'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
