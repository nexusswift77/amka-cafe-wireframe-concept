
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Types for wallet data
export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'purchase' | 'top-up' | 'points_redemption';
  amount: number;
  points_earned?: number;
  points_used?: number;
  details?: any;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
}

// Fetch wallet for the current user
export const fetchWallet = async (): Promise<Wallet | null> => {
  try {
    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('*')
      .single();
    
    if (error) {
      console.error("Error fetching wallet:", error);
      throw error;
    }
    
    return wallet;
  } catch (error) {
    toast({
      title: "Failed to load wallet",
      description: "Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

// Fetch transactions for the current user
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
    
    return transactions || [];
  } catch (error) {
    toast({
      title: "Failed to load transactions",
      description: "Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

// Top up the wallet
export const topUpWallet = async (amount: number, paymentMethod: string): Promise<boolean> => {
  try {
    // Format for database (stored in cents)
    const amountInCents = Math.round(amount * 100);
    
    // Insert the top-up transaction
    const { error } = await supabase
      .from('transactions')
      .insert({
        type: 'top-up',
        amount: amountInCents,
        details: { payment_method: paymentMethod },
      });
    
    if (error) {
      console.error("Error during top-up:", error);
      throw error;
    }
    
    toast({
      title: "Wallet topped up successfully!",
      description: `${amount} KSh has been added to your wallet.`,
      variant: "default",
    });
    
    return true;
  } catch (error) {
    toast({
      title: "Top-up failed",
      description: "Please try again later.",
      variant: "destructive",
    });
    return false;
  }
};

// Format the amount to KSh currency string
export const formatCurrency = (amountInCents: number): string => {
  return `Ksh ${(amountInCents / 100).toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};
