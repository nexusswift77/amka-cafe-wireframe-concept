
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

const Profile: React.FC = () => {
  // Dummy loyalty data
  const points = 370;
  const nextTier = 500;
  const progress = (points / nextTier) * 100;
  
  // Dummy activity data
  const recentActivity = [
    { id: 1, action: "Earned 15 points", date: "2025-05-14", details: "Purchase: Cappuccino + Sandwich" },
    { id: 2, action: "Redeemed Free Muffin", date: "2025-05-10", details: "60 points used" },
    { id: 3, action: "Earned 12 points", date: "2025-05-07", details: "Purchase: Breakfast Menu" }
  ];
  
  // Dummy dietary preferences
  const dietaryPreferences = [
    "Vegetarian", "Low Sugar", "Organic", "Gluten Free"
  ];

  return (
    <PageLayout>
      <div className="bg-cream py-8 px-4 md:px-6">
        <div className="cafe-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-coffee-light">
                <AvatarImage src="https://i.pravatar.cc/150?img=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-coffee-dark">Jane Doe</h1>
                <p className="text-coffee-dark/80">jane.doe@example.com</p>
              </div>
            </div>
            <Button variant="outline" className="md:self-start">Edit Profile</Button>
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
                        <span className="font-bold text-xl">Silver Tier</span>
                        <Badge variant="outline" className="bg-coffee-light/10">370 Points</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to Gold Tier</span>
                          <span>{points}/{nextTier}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      <div className="bg-cream p-4 rounded-md">
                        <h4 className="font-bold mb-2">Silver Tier Benefits</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Free coffee on your birthday</li>
                          <li>10% off on weekday mornings</li>
                          <li>Free size upgrades</li>
                        </ul>
                      </div>
                      
                      <div className="bg-cream/50 p-4 rounded-md border border-dashed border-coffee-light">
                        <h4 className="font-bold mb-2">Next Tier: Gold (500 points)</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-coffee-dark/80">
                          <li>15% off on all purchases</li>
                          <li>Priority pickup</li>
                          <li>Exclusive monthly events</li>
                          <li>Double points on weekends</li>
                        </ul>
                      </div>
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
                      <div className="mt-4 text-center">
                        <Button variant="link" className="text-coffee-medium">View All Activity</Button>
                      </div>
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
                        <Button variant="outline" size="sm">Redeem</Button>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-md p-4">
                      <h4 className="font-bold">Free Pastry</h4>
                      <p className="text-sm text-gray-600 mb-4">Any pastry from our daily selection</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-coffee-medium">150 points</span>
                        <Button variant="outline" size="sm">Redeem</Button>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-md p-4">
                      <h4 className="font-bold">Lunch Special</h4>
                      <p className="text-sm text-gray-600 mb-4">Sandwich + Coffee combo</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-coffee-medium">300 points</span>
                        <Button variant="outline" size="sm">Redeem</Button>
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
                        <Input id="fullName" value="Jane Doe" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value="jane.doe@example.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value="+254 123 456 789" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <div className="flex gap-2">
                          <Input id="dob" value="1990-06-15" type="date" />
                          <Button variant="outline" size="icon">
                            <Calendar className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <Label>Address</Label>
                      <Input placeholder="Street Address" value="123 Coffee Lane" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input placeholder="City" value="Nairobi" />
                        <Input placeholder="State/Region" value="Nairobi County" />
                        <Input placeholder="Postal Code" value="00100" />
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
                    {dietaryPreferences.map((pref, index) => (
                      <Badge key={index} variant="outline" className="bg-coffee-light/10 text-coffee-dark">
                        {pref}
                        <button className="ml-1 text-coffee-dark/60 hover:text-coffee-dark">×</button>
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" className="rounded-full">+ Add</Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">Favorite Items</h3>
                      <p className="text-sm text-gray-600 mb-4">Your most ordered items will appear here</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="flex items-center gap-3 p-2 border rounded-md">
                          <div className="h-10 w-10 bg-cream rounded-md flex items-center justify-center">
                            <Coffee className="h-6 w-6 text-coffee-dark" />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">Cappuccino</p>
                            <p className="text-xs text-gray-500">Ordered 12 times</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-2 border rounded-md">
                          <div className="h-10 w-10 bg-cream rounded-md flex items-center justify-center">
                            <Coffee className="h-6 w-6 text-coffee-dark" />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">Avocado Toast</p>
                            <p className="text-xs text-gray-500">Ordered 8 times</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-2 border rounded-md">
                          <div className="h-10 w-10 bg-cream rounded-md flex items-center justify-center">
                            <Coffee className="h-6 w-6 text-coffee-dark" />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">Blueberry Muffin</p>
                            <p className="text-xs text-gray-500">Ordered 5 times</p>
                          </div>
                        </div>
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
                          <Switch id="sms-marketing" defaultChecked />
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
                  <div className="space-y-4">
                    <div className="bg-white border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold">Order #12345</p>
                          <p className="text-sm text-gray-500">May 14, 2025 • 3:22 PM</p>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                      <p className="text-sm mb-2">1x Cappuccino, 1x Chicken Sandwich</p>
                      <div className="flex justify-between items-center">
                        <p className="font-bold">Ksh 650</p>
                        <Button variant="outline" size="sm">Reorder</Button>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold">Table Reservation</p>
                          <p className="text-sm text-gray-500">May 12, 2025 • 7:00 PM</p>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                      <p className="text-sm mb-2">Window table for 4 guests</p>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">Book Again</Button>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold">Order #12344</p>
                          <p className="text-sm text-gray-500">May 10, 2025 • 10:15 AM</p>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                      <p className="text-sm mb-2">1x Breakfast Menu, 2x Cappuccino</p>
                      <div className="flex justify-between items-center">
                        <p className="font-bold">Ksh 850</p>
                        <Button variant="outline" size="sm">Reorder</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button variant="outline">View All Orders</Button>
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
