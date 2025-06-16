
import React from 'react';
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
import { Calendar, User, Bell, Settings, Coffee, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { wallet } = useWallet();
  
  // Use real user data or show loading state
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
  
  // Use real wallet data or defaults
  const points = wallet?.points || 50; // Default welcome bonus
  const nextTier = 500;
  const progress = (points / nextTier) * 100;
  
  // Dummy activity data - in a real app this would come from the database
  const recentActivity = [
    { id: 1, action: "Welcome bonus received", date: new Date().toISOString().split('T')[0], details: "50 points awarded" },
    { id: 2, action: "Account created", date: new Date(user.created_at).toISOString().split('T')[0], details: "Welcome to our cafe!" }
  ];
  
  // Dummy dietary preferences
  const dietaryPreferences: string[] = [];

  const handleSignOut = async () => {
    await signOut();
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
              <Button variant="outline" className="md:self-start">Edit Profile</Button>
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
            <TabsList className="grid grid-cols-3 md:grid-cols-5 max-w-xl">
              <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="settings" className="hidden md:inline-flex">Settings</TabsTrigger>
              <TabsTrigger value="orders" className="hidden md:inline-flex">Orders</TabsTrigger>
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
                          <span>{points}/{points >= 500 ? 1000 : nextTier}</span>
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
                          <h4 className="font-bold mb-2">Next Tier: Gold (500 points)</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-coffee-dark/80">
                            <li>15% off on all purchases</li>
                            <li>Priority pickup</li>
                            <li>Exclusive monthly events</li>
                            <li>Double points on weekends</li>
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold mb-3">Recent Activity</h3>
                      <div className="space-y-3">
                        {recentActivity.map((activity) => (
                          <div key={activity.id} className="bg-white p-3 rounded-md border">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{activity.action}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(activity.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{activity.details}</p>
                          </div>
                        ))}
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
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" value={userName} placeholder="Enter your full name" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={userEmail} disabled />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="Enter your phone number" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <div className="flex gap-2">
                          <Input id="dob" type="date" />
                          <Button variant="outline" size="icon">
                            <Calendar className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <Label>Address</Label>
                      <Input placeholder="Street Address" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input placeholder="City" />
                        <Input placeholder="State/Region" />
                        <Input placeholder="Postal Code" />
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button className="gradient-button">Save Changes</Button>
                    </div>
                  </form>
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
                  <div className="flex flex-wrap gap-2 mb-6">
                    {dietaryPreferences.length > 0 ? (
                      dietaryPreferences.map((pref, index) => (
                        <Badge key={index} variant="outline" className="bg-coffee-light/10 text-coffee-dark">
                          {pref}
                          <button className="ml-1 text-coffee-dark/60 hover:text-coffee-dark">×</button>
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No dietary preferences set</p>
                    )}
                    <Button variant="outline" size="sm" className="rounded-full">+ Add</Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">Favorite Items</h3>
                      <p className="text-sm text-gray-600 mb-4">Your most ordered items will appear here as you use our service</p>
                      
                      <div className="text-center py-8 text-gray-500">
                        <Coffee className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Start ordering to see your favorites!</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-bold text-lg mb-2">Marketing Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-marketing" className="flex-1">
                            Email promotions and offers
                          </Label>
                          <Switch id="email-marketing" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sms-marketing" className="flex-1">
                            SMS notifications
                          </Label>
                          <Switch id="sms-marketing" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="personalized-recs" className="flex-1">
                            Personalized recommendations
                          </Label>
                          <Switch id="personalized-recs" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
            
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>Your recent orders and reservations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Coffee className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No orders yet</p>
                    <p className="text-sm mt-1">Your order history will appear here once you make your first purchase</p>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button variant="outline">Start Ordering</Button>
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
