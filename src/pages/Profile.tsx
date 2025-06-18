import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, User, Bell, Settings, Coffee, LogOut, Edit, Heart, Package, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getUserLoyaltyData } from '@/services/orderService';
import OrderHistory from '@/components/order/OrderHistory';
import ReservationHistory from '@/components/profile/ReservationHistory';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [isInfoSaving, setIsInfoSaving] = useState(false);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [newPreference, setNewPreference] = useState('');
  const [isPreferencesSaving, setIsPreferencesSaving] = useState(false);
  const [loyaltyData, setLoyaltyData] = useState({
    totalPoints: 0,
    totalSpent: 0,
    totalOrders: 0,
    recentActivity: []
  });
  const [isLoyaltyLoading, setIsLoyaltyLoading] = useState(false);
  
  // Load profile data from database
  const loadProfileData = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, address, date_of_birth, dietary_preferences, favorite_items')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (profile) {
        // Parse address if it exists
        let address = '', city = '', state = '', postalCode = '';
        if (profile.address) {
          const addressParts = profile.address.split(', ');
          address = addressParts[0] || '';
          city = addressParts[1] || '';
          state = addressParts[2] || '';
          postalCode = addressParts[3] || '';
        }
        
        const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
        
        setProfileData({
          fullName: fullName || userName,
          phone: profile.phone || '',
          dateOfBirth: profile.date_of_birth || '',
          address: address,
          city: city,
          state: state,
          postalCode: postalCode
        });
        
        // Load preferences
        setDietaryPreferences(profile.dietary_preferences || []);
        setFavoriteItems(Array.isArray(profile.favorite_items) ? profile.favorite_items : []);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };
  
  // Load loyalty data from database
  const loadLoyaltyData = async () => {
    if (!user) return;
    
    try {
      setIsLoyaltyLoading(true);
      const data = await getUserLoyaltyData();
      setLoyaltyData(data);
    } catch (error) {
      console.error('Error loading loyalty data:', error);
    } finally {
      setIsLoyaltyLoading(false);
    }
  };
  
  // Use real user data or redirect to auth page
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      loadProfileData();
      loadLoyaltyData();
    }
  }, [user, navigate]);

  // Show loading state while checking authentication
  if (!user) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-coffee-dark">Loading profile...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Use actual user data
  const userEmail = user.email || 'No email provided';
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  
  // Use real loyalty data
  const points = loyaltyData.totalPoints;
  const nextTier = points >= 500 ? 1000 : 500;
  const progress = (points / nextTier) * 100;
  
  // Use real activity data
  const recentActivity = loyaltyData.recentActivity;
  
  const handleSignOut = async () => {
    await signOut();
  };

  const handleEditProfile = async () => {
    if (!user) return;
    
    try {
      // Fetch current profile data from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, address, date_of_birth')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching profile:', error);
      }
      
      // Parse address if it exists
      let address = '', city = '', state = '', postalCode = '';
      if (profile?.address) {
        const addressParts = profile.address.split(', ');
        address = addressParts[0] || '';
        city = addressParts[1] || '';
        state = addressParts[2] || '';
        postalCode = addressParts[3] || '';
      }
      
      // Initialize form with current data
      setEditForm({
        fullName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : userName,
        phone: profile?.phone || '',
        dateOfBirth: profile?.date_of_birth || '',
        address: address,
        city: city,
        state: state,
        postalCode: postalCode
      });
      
    } catch (error) {
      console.error('Error loading profile data:', error);
      // Fallback to basic user data
    setEditForm({
      fullName: userName,
      phone: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      postalCode: ''
    });
    }
    
    setIsEditDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Parse the full name into first and last name
      const nameParts = editForm.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Combine address parts
      const fullAddress = [
        editForm.address,
        editForm.city,
        editForm.state,
        editForm.postalCode
      ].filter(Boolean).join(', ');
      
      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: editForm.phone || null,
          date_of_birth: editForm.dateOfBirth || null,
          address: fullAddress || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local profile data state
      setProfileData({
        fullName: editForm.fullName,
        phone: editForm.phone,
        dateOfBirth: editForm.dateOfBirth,
        address: editForm.address,
        city: editForm.city,
        state: editForm.state,
        postalCode: editForm.postalCode
      });
      
      // Show success message
      toast({
        title: "Profile updated successfully!",
        description: "Your personal information has been saved.",
      });
      
      // Close the dialog
    setIsEditDialogOpen(false);
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Failed to update profile",
        description: error.message || "An error occurred while saving your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveInfoTab = async () => {
    if (!user) return;
    
    try {
      setIsInfoSaving(true);
      
      // Parse the full name into first and last name
      const nameParts = profileData.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Combine address parts
      const fullAddress = [
        profileData.address,
        profileData.city,
        profileData.state,
        profileData.postalCode
      ].filter(Boolean).join(', ');
      
      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: profileData.phone || null,
          date_of_birth: profileData.dateOfBirth || null,
          address: fullAddress || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Profile updated successfully!",
        description: "Your personal information has been saved.",
      });
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Failed to update profile",
        description: error.message || "An error occurred while saving your profile.",
        variant: "destructive",
      });
    } finally {
      setIsInfoSaving(false);
    }
  };

  const handleAddPreference = () => {
    if (newPreference.trim() && !dietaryPreferences.includes(newPreference.trim())) {
      setDietaryPreferences([...dietaryPreferences, newPreference.trim()]);
      setNewPreference('');
    }
  };

  const handleRemovePreference = (preference: string) => {
    setDietaryPreferences(dietaryPreferences.filter(p => p !== preference));
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    
    try {
      setIsPreferencesSaving(true);
      
      // Update preferences in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          dietary_preferences: dietaryPreferences,
          favorite_items: favoriteItems,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Preferences updated successfully!",
        description: "Your dietary preferences have been saved.",
      });
      
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Failed to update preferences",
        description: error.message || "An error occurred while saving your preferences.",
        variant: "destructive",
      });
    } finally {
      setIsPreferencesSaving(false);
    }
  };

  return (
    <PageLayout>
      <div className="bg-cream py-8 px-4 md:px-6">
        <div className="cafe-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-coffee-light">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-coffee-dark">{userName}</h1>
                <p className="text-coffee-dark/80">{userEmail}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handleEditProfile} className="md:self-start">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your personal information and preferences.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-fullName">Full Name</Label>
                        <Input 
                          id="edit-fullName" 
                          value={editForm.fullName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Enter your full name" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-phone">Phone</Label>
                        <Input 
                          id="edit-phone" 
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-dob">Date of Birth</Label>
                        <Input 
                          id="edit-dob" 
                          type="date" 
                          value={editForm.dateOfBirth}
                          onChange={(e) => setEditForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-address">Address</Label>
                        <Input 
                          id="edit-address" 
                          value={editForm.address}
                          onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Street Address" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-city">City</Label>
                          <Input 
                            id="edit-city" 
                            value={editForm.city}
                            onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="City" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-state">State</Label>
                          <Input 
                            id="edit-state" 
                            value={editForm.state}
                            onChange={(e) => setEditForm(prev => ({ ...prev, state: e.target.value }))}
                            placeholder="State" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-postal">Postal</Label>
                          <Input 
                            id="edit-postal" 
                            value={editForm.postalCode}
                            onChange={(e) => setEditForm(prev => ({ ...prev, postalCode: e.target.value }))}
                            placeholder="Postal Code" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} className="gradient-button" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleSignOut} className="md:self-start">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-10 px-4 md:px-6">
        <div className="cafe-container">
          <Tabs defaultValue="loyalty" className="space-y-6">
            {/* Mobile: Scrollable tabs */}
            <div className="relative w-full md:hidden">
              <div className="w-full overflow-x-auto scrollbar-hide">
                <TabsList className="inline-flex h-12 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-max">
                  <TabsTrigger value="loyalty" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <Coffee className="h-4 w-4 mr-2" />
                    Loyalty
                  </TabsTrigger>
                  <TabsTrigger value="info" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <User className="h-4 w-4 mr-2" />
                    Info
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger value="reservations" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Reservations
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <Package className="h-4 w-4 mr-2" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>
              {/* Fade gradients to indicate scrollable content */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>

            {/* Desktop: Grid layout */}
            <TabsList className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 w-full">
              <TabsTrigger value="loyalty" className="flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                <span className="hidden lg:inline">Loyalty</span>
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden lg:inline">Info</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden lg:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="reservations" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden lg:inline">Reservations</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden lg:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden lg:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="loyalty" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coffee className="mr-2 h-5 w-5" />
                    Loyalty Status
                  </CardTitle>
                  <CardDescription>Your current loyalty tier and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoyaltyLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-dark mx-auto mb-2"></div>
                        <p className="text-coffee-dark">Loading loyalty data...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xl">
                            {points >= 500 ? 'Gold Tier' : points >= 200 ? 'Silver Tier' : 'Bronze Tier'}
                          </span>
                          <Badge variant="outline" className="bg-coffee-light/10">{points} Points</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress to {points >= 500 ? 'Platinum' : 'Gold'} Tier</span>
                            <span>{points}/{nextTier}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        
                        <div className="bg-cream p-4 rounded-md">
                          <h4 className="font-bold mb-2">Current Tier Benefits</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {points >= 500 ? (
                              <>
                                <li>15% off on all purchases</li>
                                <li>Priority pickup</li>
                                <li>Exclusive monthly events</li>
                                <li>Double points on weekends</li>
                              </>
                            ) : points >= 200 ? (
                              <>
                                <li>Free coffee on your birthday</li>
                                <li>10% off on weekday mornings</li>
                                <li>Free size upgrades</li>
                              </>
                            ) : (
                              <>
                                <li>Earn points with every purchase</li>
                                <li>Birthday surprise</li>
                                <li>Welcome bonus received</li>
                              </>
                            )}
                          </ul>
                        </div>
                        
                        {points < 500 && (
                          <div className="bg-cream/50 p-4 rounded-md border border-dashed border-coffee-light">
                            <h4 className="font-bold mb-2">Next Tier: {points >= 200 ? 'Gold (500 points)' : 'Silver (200 points)'}</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-coffee-dark/80">
                              {points >= 200 ? (
                                <>
                                  <li>15% off on all purchases</li>
                                  <li>Priority pickup</li>
                                  <li>Exclusive monthly events</li>
                                  <li>Double points on weekends</li>
                                </>
                              ) : (
                                <>
                                  <li>Free coffee on your birthday</li>
                                  <li>10% off on weekday mornings</li>
                                  <li>Free size upgrades</li>
                                </>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Loyalty Statistics */}
                        <div className="bg-white p-4 rounded-md border">
                          <h4 className="font-bold mb-3">Your Stats</h4>
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-coffee-dark">{loyaltyData.totalOrders}</div>
                              <div className="text-sm text-gray-600">Total Orders</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-coffee-dark">Ksh {loyaltyData.totalSpent.toFixed(2)}</div>
                              <div className="text-sm text-gray-600">Total Spent</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-bold mb-3">Recent Activity</h3>
                        <div className="space-y-3">
                          {recentActivity.length > 0 ? (
                            recentActivity.map((activity: any) => (
                              <div key={activity.id} className="bg-white p-3 rounded-md border">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{activity.action}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(activity.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600">{activity.details}</p>
                                {activity.points > 0 && (
                                  <div className="text-xs text-coffee-medium font-medium mt-1">
                                    +{activity.points} points
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              <Coffee className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No activity yet</p>
                              <p className="text-sm mt-1">Start ordering to earn points!</p>
                            </div>
                          )}
                        </div>
                        {wallet && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm font-medium text-green-800">
                              Current Balance: Ksh {((wallet.balance || 0) / 100).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Available Rewards</CardTitle>
                  <CardDescription>Rewards you can redeem with your points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border rounded-md p-4">
                      <h4 className="font-bold">Free Coffee</h4>
                      <p className="text-sm text-gray-600 mb-4">Any regular sized coffee of your choice</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-coffee-medium">100 points</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={points < 100}
                        >
                          {points >= 100 ? 'Redeem' : 'Need more points'}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-md p-4">
                      <h4 className="font-bold">Free Pastry</h4>
                      <p className="text-sm text-gray-600 mb-4">Any pastry from our daily selection</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-coffee-medium">150 points</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={points < 150}
                        >
                          {points >= 150 ? 'Redeem' : 'Need more points'}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-md p-4">
                      <h4 className="font-bold">Lunch Special</h4>
                      <p className="text-sm text-gray-600 mb-4">Sandwich + Coffee combo</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-coffee-medium">300 points</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={points < 300}
                        >
                          {points >= 300 ? 'Redeem' : 'Need more points'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="info" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="infoFullName">Full Name</Label>
                        <Input 
                          id="infoFullName" 
                          value={profileData.fullName || userName} 
                          onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Enter your full name" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="infoEmail">Email</Label>
                        <Input id="infoEmail" type="email" value={userEmail} disabled />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="infoPhone">Phone</Label>
                        <Input 
                          id="infoPhone" 
                          value={profileData.phone || ''} 
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="infoDob">Date of Birth</Label>
                        <Input 
                          id="infoDob" 
                          type="date" 
                          value={profileData.dateOfBirth || ''}
                          onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <Label>Address</Label>
                      <Input 
                        value={profileData.address || ''} 
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Street Address" 
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input 
                          value={profileData.city || ''} 
                          onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="City" 
                        />
                        <Input 
                          value={profileData.state || ''} 
                          onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="State/Region" 
                        />
                        <Input 
                          value={profileData.postalCode || ''} 
                          onChange={(e) => setProfileData(prev => ({ ...prev, postalCode: e.target.value }))}
                          placeholder="Postal Code" 
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button 
                        className="gradient-button" 
                        onClick={handleSaveInfoTab}
                        disabled={isInfoSaving}
                      >
                        {isInfoSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dietary Preferences</CardTitle>
                  <CardDescription>Tell us about your dietary preferences for better recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                    {dietaryPreferences.length > 0 ? (
                      dietaryPreferences.map((pref, index) => (
                        <Badge key={index} variant="outline" className="bg-coffee-light/10 text-coffee-dark">
                          {pref}
                            <button 
                              className="ml-1 text-coffee-dark/60 hover:text-coffee-dark"
                              onClick={() => handleRemovePreference(pref)}
                            >
                              ×
                            </button>
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No dietary preferences set</p>
                    )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        value={newPreference}
                        onChange={(e) => setNewPreference(e.target.value)}
                        placeholder="Add a dietary preference (e.g., Vegetarian, Gluten-free)"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddPreference()}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAddPreference}
                        disabled={!newPreference.trim()}
                      >
                        Add
                      </Button>
                        </div>
                        
                    <div className="flex justify-end pt-4">
                      <Button 
                        className="gradient-button" 
                        onClick={handleSavePreferences}
                        disabled={isPreferencesSaving}
                      >
                        {isPreferencesSaving ? 'Saving...' : 'Save Preferences'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Items</CardTitle>
                  <CardDescription>Your most ordered items will appear here as you use our service</CardDescription>
                </CardHeader>
                <CardContent>
                  {favoriteItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favoriteItems.map((item, index) => (
                        <div key={index} className="bg-cream p-4 rounded-md border">
                          <h4 className="font-bold">{item.name || 'Unknown Item'}</h4>
                          <p className="text-sm text-gray-600">{item.description || 'No description'}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-bold text-coffee-medium">
                              Ksh {((item.price || 0) / 100).toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">
                              Ordered {item.orderCount || 1} time{(item.orderCount || 1) !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Coffee className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No favorite items yet</p>
                      <p className="text-sm mt-1">Start ordering to see your favorites!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reservations" className="space-y-6">
              <ReservationHistory />
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-6">
              <OrderHistory />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-2">Notification Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="order-updates" className="flex-1">
                            Order updates
                          </Label>
                          <Switch id="order-updates" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="reservation-reminders" className="flex-1">
                            Reservation reminders
                          </Label>
                          <Switch id="reservation-reminders" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="loyalty-updates" className="flex-1">
                            Loyalty program updates
                          </Label>
                          <Switch id="loyalty-updates" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="special-offers" className="flex-1">
                            Special offers
                          </Label>
                          <Switch id="special-offers" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-bold text-lg mb-4">Password and Security</h3>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
                        <Button variant="outline" className="w-full sm:w-auto">Two-Factor Authentication</Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-bold text-lg mb-2">Language and Region</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <select id="language" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                            <option>English</option>
                            <option>Swahili</option>
                            <option>French</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <select id="currency" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                            <option>Kenyan Shilling (Ksh)</option>
                            <option>US Dollar ($)</option>
                            <option>Euro (€)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-bold text-lg text-red-600 mb-2">Danger Zone</h3>
                      <p className="text-sm text-gray-600 mb-4">These actions are irreversible</p>
                      <div className="space-x-4">
                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
