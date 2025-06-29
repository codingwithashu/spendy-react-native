// lib/api/auth.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../../types/types";

const USER_STORAGE_KEY = "@spendy_user";
const SESSION_KEY = "@spendy_session_user";



/** Simulate signup (returns true if success) */
export const signup = async (user: User): Promise<void> => {
    const json = await AsyncStorage.getItem(USER_STORAGE_KEY);
    const users = json ? JSON.parse(json) : [];

    // Check if user already exists
    const existing = users.find((u: User) => u.email === user.email);
    if (existing) {
        throw new Error("User already exists");
    }

    users.push(user);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
};

/** Simulate login */
export const login = async (email: string, password: string): Promise<User> => {
    const json = await AsyncStorage.getItem(USER_STORAGE_KEY);
    const users = json ? JSON.parse(json) : [];

    const user = users.find((u: User) => u.email === email && u.password === password);
    if (!user) {
        throw new Error("Invalid credentials");
    }

    return user;
};


export const saveSession = async (user: User) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getSession = async (): Promise<User | null> => {
    const json = await AsyncStorage.getItem(SESSION_KEY);
    return json ? JSON.parse(json) : null;
};

export const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
};

export const clearSession = async () => {
    try {
        await AsyncStorage.removeItem(SESSION_KEY);
    } catch (e) {
        console.error("Failed to clear session:", e);
    }
  };