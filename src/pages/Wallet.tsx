
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, CreditCard } from 'lucide-react';

// Dummy transaction data
const transactions = [
  { id: 1, date: '2025-05-14', type: 'Purchase', amount: -650, details: 'Cappuccino + Sandwich', status: 'completed' },
  { id: 2, date: '2025-05-12', type: 'Top-up', amount: 2000, details: 'M-Pesa', status: 'completed' },
  { id: 3, date: '2025-05-10', type: 'Purchase', amount: -450, details: 'Breakfast Menu', status: 'completed' },
  { id: 4, date: '2025-05-07', type: 'Points Redeemed', amount: 0, details: 'Free Muffin', status: 'completed' },
  { id: 5, date: '2025-05-03', type: 'Purchase', amount: -520, details: 'Special Latte + Croissant', status: 'completed' },
  { id: 6, date: '2025-05-01', type: 'Top-up', amount: 1500, details: 'Credit Card', status: 'completed' }
];

const WalletPage: React.FC = () => {
  return (
    <PageLayout>
      <div className="bg-cream py-8 px-4 md:px-6">
        <div className="cafe-container">
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-2">My Wallet</h1>
          <p className="text-coffee-dark/80">Manage your Café Amka funds and points</p>
        </div>
      </div>
      
      <div className="py-10 px-4 md:px-6">
        <div className="cafe-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="md:col-span-2 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">Wallet Balance</CardTitle>
                <CardDescription>Your available funds and points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-sm text-gray-500">Available Balance</p>
                    <p className="text-4xl font-bold text-coffee-dark">Ksh 1,200</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loyalty Points</p>
                    <div className="flex items-center">
                      <p className="text-4xl font-bold text-coffee-medium">370</p>
                      <span className="ml-2 text-xs bg-cream text-coffee-dark px-2 py-1 rounded-full">Silver Tier</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <p className="text-sm text-gray-500">Next reward: 30 points to Free Coffee</p>
                <Button variant="outline" size="sm">Redeem Points</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white">
              <CardHeader className="pb-3">
                <CardTitle>Top Up Wallet</CardTitle>
                <CardDescription>Add funds to your wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="mpesa">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
                    <TabsTrigger value="card">Card</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="mpesa" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter M-Pesa number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (Ksh)</Label>
                      <Input id="amount" type="number" placeholder="Enter amount" />
                    </div>
                    <div className="text-sm text-green-600 mt-2">
                      Bonus: +50 points with top-up of Ksh 1,000+
                    </div>
                    <Button className="w-full gradient-button">Top Up Wallet</Button>
                  </TabsContent>
                  
                  <TabsContent value="card" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="Enter card number" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="CVV" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardAmount">Amount (Ksh)</Label>
                      <Input id="cardAmount" type="number" placeholder="Enter amount" />
                    </div>
                    <div className="text-sm text-green-600 mt-2">
                      Bonus: +50 points with top-up of Ksh 1,000+
                    </div>
                    <Button className="w-full gradient-button">Top Up Wallet</Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>Recent wallet activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Transaction</th>
                      <th className="text-left py-3 px-4">Details</th>
                      <th className="text-right py-3 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="py-3 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{transaction.type}</td>
                        <td className="py-3 px-4">{transaction.details}</td>
                        <td className={`py-3 px-4 text-right ${transaction.amount >= 0 ? 'text-green-600' : ''}`}>
                          {transaction.amount >= 0 ? '+' : ''}{transaction.amount} {transaction.amount === 0 ? 'points' : 'Ksh'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline">View All Transactions</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Wallet;
