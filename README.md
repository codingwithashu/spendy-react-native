# 💰 Spendy – Your Personal Finance Tracker App

**Spendy** is a beautiful, fast, and lightweight mobile finance tracker built with React Native and Expo. With a clean UI and offline-first design, it makes expense tracking simple, intuitive, and accessible to everyone.

---

## ✨ Features

- 🔐 **Authentication**

  - Signup and login (email + password)
  - Session management with AsyncStorage

- 💸 **Transactions**

  - Add expenses or income with amount, title, category, and date
  - Auto-icon & emoji-based categories
  - View recent transactions in dashboard

- 📊 **Dashboard & Insights**

  - Account balance, income, and expenses summary
  - Filter: Week, Month, Year, All
  - Line chart visualization

- 🏷️ **Categories**

  - Built-in categories with emoji icons
  - Automatically synced across app

- 🌙 **Offline-first**

  - No internet? No problem. All data stored locally

- 🎨 **Modern UI**
  - Tailwind-like styling with NativeWind
  - Responsive and mobile-first UX

---

## 📲 Screens Included

- `LoginScreen.tsx`
- `SignupScreen.tsx`
- `Dashboard.tsx`
- `AddTransactionScreen.tsx`
- `CategoriesScreen.tsx`
- `ProfileScreen.tsx`

---

## 🔧 Installation Guide

npm install

# or

yarn

npx expo start

spendy-app/
├── assets/ # App assets (icons, images, splash, etc.)
├── components/ # Reusable UI components
├── lib/
│ └── api/ # Auth, transaction, and category APIs
├── navigation/ # Stack navigation setup
├── screens/ # Screen components (Login, Dashboard, etc.)
├── types/ # TypeScript interfaces/types
├── utils/ # Helper functions like category icons
├── App.tsx # App root
├── app.json # Expo configuration (icon, splash, etc.)
└── README.md

### 1. Clone the Repository

```bash
it clone https://github.com/codingwithashu/spendy-react-native.git
cd spendy-react-native
```
