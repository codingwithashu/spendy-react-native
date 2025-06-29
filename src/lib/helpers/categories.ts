import AsyncStorage from "@react-native-async-storage/async-storage";

export type Category = {
    name: string;
    icon: string;
};

const STORAGE_KEY = "@spendy_custom_categories";

export const defaultCategories: Category[] = [
    { name: "Groceries", icon: "🛒" },
    { name: "Transport", icon: "🚗" },
    { name: "Food", icon: "🍔" },
    { name: "Shopping", icon: "🛍️" },
    { name: "Salary", icon: "💰" },
    { name: "Other", icon: "📦" },
];

export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        const custom = json ? JSON.parse(json) : [];
        return [...defaultCategories, ...custom];
    } catch (e) {
        return defaultCategories;
    }
};

// lib/helpers/categoryUtils.ts

/** Emojis for default categories */
export const getIcon = (category: string): string => {
    const icons: Record<string, string> = {
        Home: "🏠",
        "Food & Drink": "🍔",
        Shopping: "🛍️",
        Trips: "🛳️",
        Transport: "🚌",
        "Health & Beauty": "💅",
        Groceries: "🛒",
        Food: "🍔",
        Salary: "💰",
        Other: "📦",
    };

    return icons[category] || "💸";
};

/** Background colors for category icons */
export const getIconBgColor = (category: string): string => {
    const colors: Record<string, string> = {
        Home: "#10b981",
        "Food & Drink": "#f97316",
        Shopping: "#3b82f6",
        Trips: "#8b5cf6",
        Transport: "#facc15",
        "Health & Beauty": "#16a34a",
        Groceries: "#22c55e",
        Food: "#fb923c",
        Salary: "#facc15",
        Other: "#64748b",
    };

    return colors[category] || "#e5e7eb"; // fallback: gray-200
};
