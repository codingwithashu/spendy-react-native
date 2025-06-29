import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveTransaction } from "../../lib/api/transactions";
import { Category, getAllCategories } from "../../lib/helpers/categories";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  icon: string;
};

const STORAGE_KEY = "@spendy_transactions";

export default function AddTransactionScreen({
  onSave,
}: {
  onSave?: () => void;
}) {
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const loadCategories = async () => {
      const all = await getAllCategories();
      setCategories(all);
    };
    loadCategories();
  }, []);
  const mutation = useMutation({
    mutationFn: saveTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      Alert.alert("Success", "Transaction added successfully.");
      setTitle("");
      setAmount("");
      setCategory("Groceries");
      setIcon("🛒");
      setDate(new Date());
      setType("expense");
      onSave?.();
    },
    onError: () => {
      Alert.alert("Error", "Failed to save transaction.");
    },
  });
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Groceries");
  const [icon, setIcon] = useState("🛒");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSave = () => {
    if (!title || !amount || isNaN(parseFloat(amount))) {
      Alert.alert(
        "Invalid Input",
        "Please fill in all fields with valid data."
      );
      return;
    }

    const newTransaction: Transaction = {
      id: uuid.v4().toString(),
      title,
      amount: parseFloat(amount),
      category,
      type,
      icon,
      date: date.toISOString(),
    };

    mutation.mutate(newTransaction);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 w-full">
      <View className="bg-white shadow-md p-6">
        {/* Header */}
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Add Transaction
        </Text>

        {/* Amount Input */}
        <View className="mb-5">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Amount
          </Text>
          <TextInput
            placeholder="₹ 0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ""))}
            className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white"
            accessibilityLabel="Transaction amount"
          />
        </View>

        {/* Title Input */}
        <View className="mb-5">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Title
          </Text>
          <TextInput
            placeholder="e.g., Lunch, Uber"
            value={title}
            onChangeText={setTitle}
            className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white"
            accessibilityLabel="Transaction title"
          />
        </View>

        {/* Type Toggle */}
        <View className="mb-5">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Type</Text>
          <View className="flex-row bg-gray-200 rounded-xl p-1">
            <Pressable
              onPress={() => setType("expense")}
              className={`flex-1 py-2 rounded-lg items-center ${
                type === "expense" ? "bg-red-500" : "bg-transparent"
              }`}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              accessibilityLabel="Select expense"
            >
              <Text
                className={`text-sm font-semibold ${
                  type === "expense" ? "text-white" : "text-gray-700"
                }`}
              >
                Expense
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setType("income")}
              className={`flex-1 py-2 rounded-lg items-center ${
                type === "income" ? "bg-green-500" : "bg-transparent"
              }`}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              accessibilityLabel="Select income"
            >
              <Text
                className={`text-sm font-semibold ${
                  type === "income" ? "text-white" : "text-gray-700"
                }`}
              >
                Income
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Category Picker */}
        <View className="mb-5">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Category
          </Text>
          <View className="border border-gray-300 rounded-xl bg-gray-50">
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => {
                const selected = categories.find((c) => c.name === itemValue);
                setCategory(itemValue);
                setIcon(selected?.icon || "📦");
              }}
              style={{ padding: 12, color: "#1F2937", fontSize: 16 }}
            >
              {categories.map((cat) => (
                <Picker.Item
                  key={cat.name}
                  label={`${cat.icon} ${cat.name}`}
                  value={cat.name}
                  style={{ fontSize: 16, color: "#1F2937" }}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Date Picker */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Date</Text>
          <Pressable
            onPress={() => setShowDate(true)}
            className="flex-row items-center justify-between border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            accessibilityLabel="Select date"
          >
            <Text className="text-gray-800">
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
            <AntDesign name="calendar" size={20} color="#4B5563" />
          </Pressable>
          {showDate && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(_, selectedDate) => {
                setShowDate(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          className={`rounded-xl py-4 items-center shadow-md ${
            mutation.isPending ? "bg-blue-300" : "bg-blue-600"
          }`}
          disabled={mutation.isPending}
          style={({ pressed }) => [
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <Text className="text-white text-lg font-semibold">
            {mutation.isPending ? "Saving..." : "Save Transaction"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
