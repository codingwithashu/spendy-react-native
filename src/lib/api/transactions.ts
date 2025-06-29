// lib/api/transactions.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@spendy_transactions";

export const fetchTransactions = async () => {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const data = json ? JSON.parse(json) : [];
    return data.reverse(); // newest first
};

export const saveTransaction = async (transaction: any) => {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const current = json ? JSON.parse(json) : [];
    current.push(transaction);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  };