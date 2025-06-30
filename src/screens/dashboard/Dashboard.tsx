import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../../lib/api/transactions";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import * as shape from "d3-shape";
import { Transaction } from "../../types/types";
import { getIcon, getIconBgColor } from "../../lib/helpers/categories";
import { Grid, LineChart, XAxis } from "react-native-svg-charts";
import * as scale from "d3-scale";

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const currentMonthName = new Date().toLocaleString("default", {
  month: "long",
});
const daysInMonth = new Date(year, month + 1, 0).getDate();
export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("Month");

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const Gradient = () => (
    <Defs key={"gradient"}>
      <LinearGradient id={"gradient"} x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
        <Stop offset={"0%"} stopColor={"#3b82f6"} stopOpacity={0.5} />
        <Stop offset={"100%"} stopColor={"#3b82f6"} stopOpacity={0.05} />
      </LinearGradient>
    </Defs>
  );

  const income = useMemo(
    () =>
      transactions
        .filter((t: { type: string }) => t.type === "income")
        .reduce((sum: any, t: { amount: any }) => sum + t.amount, 0),
    [transactions]
  );

  const expense = useMemo(
    () =>
      transactions
        .filter((t: { type: string }) => t.type === "expense")
        .reduce((sum: any, t: { amount: any }) => sum + t.amount, 0),
    [transactions]
  );

  const balance = income - expense;

  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;

    const dayTransactions = transactions.filter(
      (t: { date: string | number | Date }) => {
        const tDate = new Date(t.date);
        return (
          tDate.getFullYear() === year &&
          tDate.getMonth() === month &&
          tDate.getDate() === day
        );
      }
    );

    return dayTransactions.reduce(
      (sum: any, t: { amount: any }) => sum + t.amount,
      0
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="px-6 pt-6"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {/* Header */}
        <Text className="text-xl font-bold mb-4">Main Account</Text>

        {/* Balance */}
        <View className="bg-blue-700 rounded-2xl p-6 mb-6">
          <View className="flex-row justify-between">
            <View>
              <Text className="text-white text-sm">Account Balance</Text>
              <Text className="text-white text-3xl font-bold mt-1">
                ₹{balance.toFixed(2)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-white text-sm">This Month</Text>
              <Text className="text-white text-xl font-semibold mt-1">
                ₹{(income - expense).toFixed(2)}
              </Text>
            </View>
          </View>
          <View className="mt-4">
            <Text className="text-white text-xs">Credit Card</Text>
            <Text className="text-white font-semibold">₹2000</Text>
          </View>
        </View>

        {/* Graph */}
        <View className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-700 font-semibold text-sm">
              Spending Overview ({currentMonthName})
            </Text>
            <Text className="text-red-500 text-xs font-medium">₹{income}</Text>
          </View>

          <LineChart
            style={{ height: 160 }}
            data={chartData}
            svg={{ stroke: "url(#gradient)", strokeWidth: 3 }}
            curve={shape.curveNatural}
            contentInset={{ top: 20, bottom: 20 }}
          >
            <Grid />
            <Gradient />
          </LineChart>

          <XAxis
            style={{ marginTop: 10 }}
            data={chartData}
            formatLabel={(value, index) => (index + 1).toString()} // Day of the month
            numberOfTicks={6}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 10, fill: "#999" }}
          />
        </View>

        {/* Cash Flow */}
        <View className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-200">
          <Text className="font-semibold text-gray-800 mb-3">Cash Flow</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-green-600">Income</Text>
            <Text className="text-green-600 font-bold">
              ₹{income.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-red-600">Expenses</Text>
            <Text className="text-red-600 font-bold">
              ₹{expense.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-200">
            <Text className="text-gray-700 font-medium">Total</Text>
            <Text
              className={`font-semibold ${
                balance >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              ₹{balance.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <Text className="text-lg font-semibold mb-4">Recent Transactions</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#007aff" />
        ) : transactions.length === 0 ? (
          <Text className="text-gray-400 text-center">
            No transactions yet.
          </Text>
        ) : (
          transactions.slice(0, 6).map((item: Transaction, idx: number) => (
            <View
              key={item.id || idx}
              className="flex-row justify-between items-center bg-white rounded-xl shadow-sm px-4 py-3 mb-3 border border-gray-100"
            >
              <View className="flex-row items-center gap-x-3">
                <View
                  className="w-10 h-10 rounded-lg items-center justify-center"
                  style={{ backgroundColor: getIconBgColor(item.category) }}
                >
                  <Text className="text-white text-lg">
                    {getIcon(item.category)}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-800 font-semibold">
                    {item.title}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {item.category} • {formatDate(item.date)}
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
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
