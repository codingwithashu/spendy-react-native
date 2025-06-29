import React from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { clearSession } from "../../lib/api/auth"; // adjust the path

const STORAGE_KEY = "@spendy_transactions";

export default function AccountsScreen() {
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await clearSession(); // ⬅️ Clear user session from AsyncStorage
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  const handleClearData = async () => {
    Alert.alert(
      "Clear All Transactions",
      "Are you sure? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(STORAGE_KEY);
            Alert.alert("Done", "All transactions have been deleted.");
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      {/* Avatar + Name */}
      <View className="items-center mb-8">
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=3" }}
          className="w-20 h-20 rounded-full mb-4"
        />
        <Text className="text-xl font-bold">Ashutosh Gupta</Text>
        <Text className="text-gray-500">ashu@example.com</Text>
      </View>

      {/* Menu */}
      <TouchableOpacity
        onPress={handleClearData}
        className="bg-gray-100 py-4 px-4 rounded-lg mb-4"
      >
        <Text className="text-red-500 font-semibold">
          🧹 Clear All Transactions
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("AddCategory")}
        className="bg-gray-100 py-4 px-4 rounded-lg mb-4"
      >
        <Text className="text-green-700 font-semibold">
          ➕ Manage Categories
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-gray-100 py-4 px-4 rounded-lg"
      >
        <Text className="text-blue-700 font-semibold">🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
