import React, { useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/auth/Login";
import Signup from "../screens/auth/Signup";
import BottomTabs from "./BottomTabs";
import AddTransactionScreen from "../screens/Transactions/AddTransactionScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import AddCategoryScreen from "../screens/Category/AddCategoryScreen";

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Signup: undefined;
  AddTransactionModal: undefined;
  AddCategory: undefined;
};

const RootNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Dashboard" component={BottomTabs} />
          <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
          <Stack.Screen
            name="AddTransactionModal"
            component={AddTransactionScreen}
            options={{ presentation: "modal" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default RootNavigator;
