
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWallet, fetchTransactions, Wallet, Transaction } from "@/services/walletService";

export function useWallet() {
  const {
    data: wallet,
    isLoading: isLoadingWallet,
    error: walletError,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
  });
  
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });
  
  const refetchAll = () => {
    refetchWallet();
    refetchTransactions();
  };

  return {
    wallet,
    transactions,
    isLoading: isLoadingWallet || isLoadingTransactions,
    error: walletError || transactionsError,
    refetchAll,
  };
}
