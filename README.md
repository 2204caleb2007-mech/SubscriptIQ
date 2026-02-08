# SubScriptIQ - AI-Powered ERP & Subscription Management

SubScriptIQ is a comprehensive full-stack application designed for seamless subscription management and ERP operations. It features an AI-driven dashboard and a robust backend to handle products, plans, invoices, and payments.

## 📁 Project Structure

This repository contains two main components:

- **`subscriptiq-dashboard-main/`**: The frontend application built with React, Vite, Tailwind CSS, and Shadcn UI.
- **`subscription-management/backend/`**: The REST API backend built with Node.js, Express, Prisma, and SQLite.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### 🛠️ Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd subscription-management/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database (SQLite):
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The API will be available at `http://localhost:3000`*

### 💻 Frontend Setup

1. Open a new terminal and navigate to the dashboard directory:
   ```bash
   cd subscriptiq-dashboard-main
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The dashboard will be available at `http://localhost:8080`*

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI / Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Fetching**: TanStack Query (React Query)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: SQLite (Development)
- **Authentication**: JWT & Bcryptjs
- **Validation**: Zod
- **Payment Integration**: Razorpay

---

## 🔧 Environment Variables

### Backend (`.env`)
```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:8080
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📄 License
This project is licensed under the MIT License.
