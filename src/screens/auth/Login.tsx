import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { getSession, saveSession, login } from "../../lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { Image } from "react-native";

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkSession = async () => {
      const user = await getSession();
      if (user) {
        navigation.replace("Dashboard");
      }
    };
    checkSession();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: () => login(email.trim().toLowerCase(), password),
    onSuccess: async (user) => {
      await saveSession(user);
      Alert.alert("Welcome", `Logged in as ${user.name}`);
      navigation.replace("Dashboard");
    },
    onError: (error: any) => {
      Alert.alert("Login Failed", error.message || "Invalid credentials.");
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter both email and password.");
      return;
    }

    mutation.mutate();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 pt-10">
          <Image
            source={require("../../../assets/icon.png")}
            style={{
              width: 300,
              height: 300,
              alignSelf: "center",
              marginBottom: 20,
            }}
            resizeMode="contain"
          />

          <Text className="text-2xl font-bold text-center mb-8">Sign in</Text>

          {/* Email */}
          <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-full mb-4">
            <Ionicons name="mail-outline" size={20} />
            <TextInput
              className="flex-1 ml-2"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-full mb-2">
            <Ionicons name="lock-closed-outline" size={20} />
            <TextInput
              className="flex-1 ml-2"
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} />
            </TouchableOpacity>
          </View>

          {/* Remember Me + Forgot */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setRememberMe(!rememberMe)}
            >
              <Ionicons
                name={rememberMe ? "checkbox" : "square-outline"}
                size={20}
                color="#000"
              />
              <Text className="ml-2 text-gray-700">Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-blue-700 rounded-full py-4 items-center mb-6"
            disabled={mutation.isPending}
          >
            <Text className="text-white font-semibold text-lg">
              {mutation.isPending ? "Signing in..." : "Sign in"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-400">Or Login with</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Social Login */}
          <View className="flex-row justify-around mb-6">
            <TouchableOpacity className="p-4 border rounded-lg">
              <FontAwesome name="facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity className="p-4 border rounded-lg">
              <AntDesign name="google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity className="p-4 border rounded-lg">
              <AntDesign name="apple1" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center">
            <Text className="text-gray-500">Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate("Signup")}>
              <Text className="text-blue-600 font-semibold">Sign up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
