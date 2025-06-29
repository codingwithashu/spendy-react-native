import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { PieChart } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { fetchTransactions } from "../../lib/api/transactions";
import { SafeAreaView } from "react-native-safe-area-context";

const categoryColors: Record<string, string> = {
  Shopping: "#3b82f6",
  Home: "#10b981",
  "Food & Drink": "#f97316",
  Trips: "#8b5cf6",
  Transport: "#facc15",
};

export default function CategoryScreen() {
  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  // Group transactions by category
  const categorySummary = useMemo(() => {
    const summary: Record<string, { total: number; count: number }> = {};
    transactions
      .filter((t: { type: string }) => t.type === "expense") // only expenses
      .forEach((t: { category: string | number; amount: number }) => {
        if (!summary[t.category]) {
          summary[t.category] = { total: 0, count: 0 };
        }
        summary[t.category].total += t.amount;
        summary[t.category].count += 1;
      });
    return summary;
  }, [transactions]);

  const chartData = Object.entries(categorySummary)
    .filter(([_, { total }]) => total > 0) // only show positive amounts
    .map(([category, { total }]) => ({
      key: category,
      value: total,
      svg: { fill: categoryColors[category] || "#ccc" },
      arc: { outerRadius: "100%", padAngle: 0.02 },
    }));

  const totalAmount = Object.values(categorySummary).reduce(
    (sum, cat) => sum + cat.total,
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="px-6 pt-6"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <Text className="text-2xl font-bold mb-4">Category Summary</Text>

        <View className="bg-white p-4 rounded-xl mb-6 border border-gray-200">
          <View className="items-center mb-2">
            <Text className="font-semibold text-gray-700 mb-1">Summary</Text>
            <Text className="text-xl font-bold">₹{totalAmount.toFixed(2)}</Text>
          </View>
          <PieChart
            style={{ height: 200 }}
            data={chartData}
            outerRadius={"85%"}
            innerRadius={"55%"}
          />
          <View className="flex-row flex-wrap justify-center mt-4">
            {Object.entries(categorySummary).map(([category]) => (
              <View key={category} className="flex-row items-center mx-2 my-1">
                <View
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: categoryColors[category] || "#ccc",
                  }}
                />
                <Text className="text-sm text-gray-600">{category}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Breakdown list */}
        {Object.entries(categorySummary).map(([category, { total, count }]) => (
          <View
            key={category}
            className="flex-row justify-between items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-3"
          >
            <View className="flex-row items-center gap-x-3">
              <View
                className="w-10 h-10 rounded-lg items-center justify-center"
                style={{ backgroundColor: categoryColors[category] || "#ccc" }}
              >
                <Text className="text-white text-lg">{getIcon(category)}</Text>
              </View>
              <View>
                <Text className="text-gray-800 font-semibold">{category}</Text>
                <Text className="text-xs text-gray-500">
                  {count} Transactions
                </Text>
              </View>
            </View>
            <Text className="font-semibold text-gray-800">
              ₹{total.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const getIcon = (category: string) => {
  const icons: Record<string, string> = {
    Home: "🏠",
    "Food & Drink": "🍔",
    Shopping: "🛍️",
    Trips: "🛳️",
    Transport: "🚌",
  };
  return icons[category] || "💸";
};
