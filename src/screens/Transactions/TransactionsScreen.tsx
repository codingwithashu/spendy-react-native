import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  icon: string;
  date: string;
};

const STORAGE_KEY = "@spendy_transactions";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const data = json ? JSON.parse(json) : [];
      setTransactions(data.reverse());
    } catch (err) {
      console.error("Error loading transactions:", err);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Delete", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = transactions.filter((t) => t.id !== id);
          setTransactions(updated);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        },
      },
    ]);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <Text className="text-2xl font-bold mb-4">All Transactions</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => handleDelete(item.id)}
            className="flex-row justify-between items-center bg-gray-100 px-4 py-3 rounded-lg mb-3"
          >
            <View className="flex-row items-center gap-x-3">
              <Text className="text-lg">{item.icon}</Text>
              <View>
                <Text className="font-medium text-gray-800">{item.title}</Text>
                <Text className="text-xs text-gray-500">
                  {item.category} •{" "}
                  {new Date(item.date).toLocaleDateString("en-IN")}
                </Text>
              </View>
            </View>
            <Text
              className={`font-semibold ${
                item.type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {item.type === "income" ? "+" : "-"}₹{item.amount.toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}
      />

      {transactions.length === 0 && (
        <Text className="text-gray-400 text-center mt-10">
          No transactions added yet.
        </Text>
      )}
    </View>
  );
}
