import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootNavigator, { RootStackParamList } from "./navigation/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
