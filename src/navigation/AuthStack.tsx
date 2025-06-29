import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";
import LoginScreen from "../screens/auth/Login";
import SignupScreen from "../screens/auth/Signup";
import AddTransactionScreen from "../screens/Transactions/AddTransactionScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={BottomTabs} />

      {/* Modal for Add Transaction */}
      <Stack.Screen
        name="AddTransactionModal"
        component={AddTransactionScreen}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
