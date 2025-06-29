import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Modal, Pressable, Alert, ScrollView } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Dashboard from "../screens/dashboard/Dashboard";
import AccountsScreen from "../screens/Accounts/AccountsScreen";
import TransactionsScreen from "../screens/Transactions/TransactionsScreen";
import AddTransactionScreen from "../screens/Transactions/AddTransactionScreen";
import CategoryScreen from "../screens/Category/CategoryScreen";

const Tab = createBottomTabNavigator();

const STORAGE_KEY = "@spendy_transactions";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  icon: string;
};

const DummyScreen = () => (
  <View className="flex-1 items-center justify-center bg-gray-100">
    Hello World
  </View>
);

type PlusButtonProps = {
  onPress?: () => void;
};

const CustomPlusButton = ({ onPress }: PlusButtonProps) => (
  <Pressable
    onPress={onPress}
    className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center -mt-8 ml-4"
    style={({ pressed }) => [
      {
        opacity: pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 6,
      },
    ]}
    accessibilityLabel="Open add transaction modal"
  >
    <AntDesign name="plus" size={26} color="#fff" />
  </Pressable>
);

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const data = json ? JSON.parse(json) : [];
      setTransactions(data.reverse()); // Newest first
    } catch (err) {
      console.error("Error loading transactions:", err);
      Alert.alert("Error", "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 10 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
        }}
      >
        <Tab.Screen
          name="Activity"
          component={Dashboard}
          options={{
            title: "new",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "bar-chart" : "bar-chart-outline"}
                size={24}
                color={focused ? "#2563EB" : color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Budget"
          component={CategoryScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "pie-chart" : "pie-chart-outline"}
                size={24}
                color={focused ? "#2563EB" : color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Add"
          component={DummyScreen}
          options={{
            tabBarButton: (props) => (
              <CustomPlusButton
                {...props}
                onPress={() => setModalVisible(true)}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "swap-horizontal-bold" : "swap-horizontal"}
                size={24}
                color={focused ? "#2563EB" : color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Accounts"
          component={AccountsScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? "#2563EB" : color}
              />
            ),
          }}
        />
      </Tab.Navigator>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View
            className="bg-white rounded-t-3xl shadow-xl w-full max-h-[90%]"
            style={{
              paddingTop: 16,
              paddingBottom: insets.bottom,
              paddingHorizontal: 12,
            }}
          >
            {/* Close Button */}
            <View className="flex-row justify-end mb-2">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="p-2 rounded-full bg-gray-200"
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                accessibilityLabel="Close modal"
              >
                <AntDesign name="close" size={20} color="#4B5563" />
              </Pressable>
            </View>

            {/* Add Transaction Form */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <AddTransactionScreen
                onSave={() => {
                  setModalVisible(false);
                  loadTransactions();
                }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
