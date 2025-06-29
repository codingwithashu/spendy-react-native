import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Category } from "../../lib/helpers/categories";

const STORAGE_KEY = "@spendy_custom_categories";

const defaultCategories = [
  { name: "Groceries", icon: "🛒" },
  { name: "Transport", icon: "🚗" },
  { name: "Food", icon: "🍔" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Salary", icon: "💰" },
  { name: "Other", icon: "📦" },
];

const emojiList = [
  "🍕",
  "🎮",
  "🏥",
  "✈️",
  "🎁",
  "🐶",
  "🏠",
  "📚",
  "📱",
  "🍿",
  "💻",
];

export default function AddCategoryScreen() {
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");

  useEffect(() => {
    loadCustomCategories();
  }, []);

  const loadCustomCategories = async () => {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      setCustomCategories(JSON.parse(json));
    }
  };

  const saveCustomCategory = async () => {
    if (!newCategory || !selectedIcon) {
      Alert.alert("Required", "Please enter category name and choose an icon.");
      return;
    }

    const newEntry = { name: newCategory.trim(), icon: selectedIcon };

    const updated = [...customCategories, newEntry];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setCustomCategories(updated);
    setNewCategory("");
    setSelectedIcon("");
    Alert.alert("Success", "Category added!");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-6">
        <Text className="text-2xl font-bold mb-4">Add Category</Text>

        {/* Default Categories */}
        <Text className="text-lg font-semibold mb-2">Default Categories</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {defaultCategories.map((cat) => (
            <View
              key={cat.name}
              className="bg-gray-100 px-3 py-2 rounded-xl flex-row items-center space-x-2"
            >
              <Text className="text-lg">{cat.icon}</Text>
              <Text className="text-gray-800 font-medium">{cat.name}</Text>
            </View>
          ))}
        </View>

        {/* Custom Add Section */}
        <Text className="text-lg font-semibold mb-2">Create Your Own</Text>

        <TextInput
          value={newCategory}
          onChangeText={setNewCategory}
          placeholder="Enter category name"
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        />

        <Text className="mb-2 text-sm text-gray-700">Choose an icon</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {emojiList.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => setSelectedIcon(emoji)}
              className={`w-10 h-10 items-center justify-center rounded-full ${
                selectedIcon === emoji ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <Text className="text-lg">{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={saveCustomCategory}
          className="bg-blue-600 rounded-xl py-4 items-center"
        >
          <Text className="text-white font-semibold">Add Category</Text>
        </TouchableOpacity>

        {/* Custom Categories List */}
        {customCategories.length > 0 && (
          <>
            <Text className="text-lg font-semibold mt-6 mb-2">
              Your Categories
            </Text>
            {customCategories.map((cat, i) => (
              <View
                key={i}
                className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-2"
              >
                <Text className="text-xl mr-3">{cat.icon}</Text>
                <Text className="text-gray-800 font-medium">{cat.name}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
