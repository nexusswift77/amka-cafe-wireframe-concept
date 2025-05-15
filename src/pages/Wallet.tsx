
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, CreditCard, Loader, UserRound } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { topUpWallet, formatCurrency } from '@/services/walletService';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const WalletPage: React.FC = () => {
  const { wallet, transactions, isLoading, error, refetchAll } = useWallet();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleTopUp = async (paymentMethod: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    // Additional validation for M-Pesa
    if (paymentMethod === 'mpesa' && !phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your M-Pesa number.",
        variant: "destructive",
      });
      return;
    }

    // Validation for card payment
    if (paymentMethod === 'card') {
      if (!cardNumber || !expiry || !cvv) {
        toast({
          title: "Missing card details",
          description: "Please fill in all card information.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      setIsProcessing(true);
      
      // Call the service function to top up
      const success = await topUpWallet(parseFloat(amount), paymentMethod);
      
      if (success) {
        // Reset form
        setAmount('');
        setPhoneNumber('');
        setCardNumber('');
        setExpiry('');
        setCvv('');
        
        // Refresh data
        refetchAll();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if user is authenticated
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // If no session, show login prompt
  if (!session) {
    return (
      <PageLayout>
        <div className="bg-cream py-8 px-4 md:px-6">
          <div className="cafe-container">
            <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-2">My Wallet</h1>
            <p className="text-coffee-dark/80">Please log in to access your wallet</p>
          </div>
        </div>
        
        <div className="py-10 px-4 md:px-6">
          <div className="cafe-container">
            <Card className="text-center p-6">
              <CardHeader>
                <CardTitle>Authentication Required</CardTitle>
                <CardDescription>
                  You need to be logged in to view and manage your wallet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserRound className="w-16 h-16 mx-auto mb-4 text-coffee-medium/50" />
                <p>Access your funds, earn points, and track your transactions.</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button className="gradient-button" onClick={() => window.location.href = '/auth'}>
                  Log in or Sign up
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className="bg-cream py-8 px-4 md:px-6">
          <div className="cafe-container">
            <h1 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-2">My Wallet</h1>
            <p className="text-coffee-dark/80">Loading your wallet data...</p>
          </div>
        </div>
        
        <div className="py-10 px-4 md:px-6 flex justify-center">
          <Loader className="w-10 h-10 animate-spin text-coffee-medium" />
        </div>
      </PageLayout>
    );
  }

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
                    <p className="text-4xl font-bold text-coffee-dark">
                      {wallet ? formatCurrency(wallet.balance) : "Ksh 0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loyalty Points</p>
                    <div className="flex items-center">
                      <p className="text-4xl font-bold text-coffee-medium">
                        {wallet ? wallet.points : 0}
                      </p>
                      <span className="ml-2 text-xs bg-cream text-coffee-dark px-2 py-1 rounded-full">
                        {wallet && wallet.points >= 500 ? "Gold Tier" : "Silver Tier"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <p className="text-sm text-gray-500">
                  {wallet && wallet.points < 100 
                    ? `Next reward: ${100 - wallet.points} points to Free Coffee`
                    : "You have enough points for rewards!"}
                </p>
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
                      <Input 
                        id="phone" 
                        placeholder="Enter M-Pesa number" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (Ksh)</Label>
                      <Input 
                        id="amount" 
                        type="number" 
                        placeholder="Enter amount" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="500"
                      />
                    </div>
                    <div className="text-sm text-green-600 mt-2">
                      Bonus: +50 points with top-up of Ksh 1,000+
                    </div>
                    <Button 
                      className="w-full gradient-button" 
                      onClick={() => handleTopUp('mpesa')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Top Up Wallet'}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="card" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        placeholder="Enter card number" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input 
                          id="expiry" 
                          placeholder="MM/YY" 
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv" 
                          placeholder="CVV" 
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardAmount">Amount (Ksh)</Label>
                      <Input 
                        id="cardAmount" 
                        type="number" 
                        placeholder="Enter amount" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="500"
                      />
                    </div>
                    <div className="text-sm text-green-600 mt-2">
                      Bonus: +50 points with top-up of Ksh 1,000+
                    </div>
                    <Button 
                      className="w-full gradient-button"
                      onClick={() => handleTopUp('card')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Top Up Wallet'}
                    </Button>
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
                    {transactions && transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b">
                          <td className="py-3 px-4">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            {transaction.type === 'purchase' ? 'Purchase' : 
                             transaction.type === 'top-up' ? 'Top-up' : 'Points Redeemed'}
                          </td>
                          <td className="py-3 px-4">
                            {transaction.details ? JSON.stringify(transaction.details).replace(/["{}\[\]]/g, '') : '-'}
                          </td>
                          <td className={`py-3 px-4 text-right ${transaction.type !== 'purchase' ? 'text-green-600' : ''}`}>
                            {transaction.type !== 'points_redemption' 
                              ? `${transaction.type === 'top-up' ? '+' : ''}${formatCurrency(transaction.amount)}` 
                              : `${transaction.points_used} points`}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-gray-500">
                          No transactions yet
                        </td>
                      </tr>
                    )}
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

export default WalletPage;
