# 💸 FinanceDash

> A modern, responsive, and highly interactive financial dashboard built to track expenses, visualize trends, and generate smart financial insights.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4.svg?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF.svg?logo=vite)

## ✨ Features

- **📊 Advanced Data Visualization:** Beautiful, smooth-curve line charts for balance trends and interactive pie charts for expense breakdowns using Recharts and Material-UI.
- **🌓 Flawless Dark Mode:** A fully integrated light/dark theme toggle featuring a custom sliding switch. UI transitions seamlessly from a premium slate-and-indigo light mode to a sleek, deep dark mode.
- **🧠 Smart Financial Insights:** An automated analytics engine that calculates your highest spending categories, month-over-month expense trends, and real-time savings rate.
- **🔍 Instant Search & Filtering:** A lightning-fast, real-time transaction table search that scans merchants, categories, and amounts simultaneously.
- **🔐 Role-Based Access Control:** Built-in "Viewer" and "Admin" roles. Admins can add, edit, and delete transactions, while Viewers have a read-only experience.
- **📱 Fully Responsive:** Carefully crafted layouts that look perfect on desktops, tablets, and mobile devices.

## 🛠️ Tech Stack

- **Frontend Framework:** React (via Vite)
- **Styling:** Tailwind CSS v4
- **State Management:** React Context API (`FinanceContext`)
- **Charting Libraries:** Recharts & Material-UI (MUI X-Charts)
- **UI Components:** Custom Tailwind components & MUI Alerts

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have **Node.js** (v18 or higher) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/hrujulTodankar/Finance-Dashboard-UI](https://github.com/hrujulTodankar/Finance-Dashboard-UI)

2. **Navigate to the project directory**
   ```bash
   cd financedash

3. **Install the dependencies**
   ```bash
   npm install

4. **Start the development server**
   ```bash
   npm run dev

5. **Open your browser**
Navigate to http://localhost:5173 to see the application running.


## 📂 Project Structure
- **src/components/FinanceContext.jsx:** The brains of the app. Handles the mock database, theme state, and smart insight calculations.

- **src/components/Header.jsx:** Top navigation containing the logo, role switcher, and theme toggle.

- **src/components/Dashboard.jsx:** The main analytics view containing summary cards, charts, and the Smart Insights engine.

- **src/components/TransactionTable.jsx:** The interactive data table with search, filtering, and CRUD operations.

- **src/components/AddTransactionModal.jsx:** The form interface for adding or editing financial records.


## 💡 Usage Highlights
- **Simulate Roles:** Use the dropdown in the top right to switch between Viewer and Admin to see how the UI restricts table actions.

- **Test the Search:** Type "Groceries", "Netflix", or a specific number like "1500" into the transaction table search bar to see instant filtering.

- **Toggle Dark Mode:** Click the sun/moon slider in the header to watch the entire UI smoothly transition color palettes using the "Canvas vs. Surface" design methodology.


