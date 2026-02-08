<<<<<<< HEAD
# SubscriptIQ - AI-Powered Subscription Management ERP

SubscriptIQ is a premium, full-stack ERP solution designed for modern subscription-based businesses. It combines powerful billing automation with AI-driven insights and a stunning WebGL-powered user experience.

---

## 🚀 Key Features

### **1. AI-Driven Finance**
- **Automated Invoicing**: Real-time invoice generation with automatic Tax (GST/VAT) and Discount application.
- **AI Insights**: Personalized financial summaries and purchase analysis generated immediately after checkout.
- **Notification System**: AI-powered sidebar alerts for new invoices and system events.

### **2. Premium User Experience**
- **ColorBends Graphics**: Stunning WebGL-based generative animations on Landing and Login pages.
- **Modern Dashboard**: A clean, responsive interface built with Tailwind CSS and Framer Motion.
- **Interactive Timeline**: Real-time tracking of RPA (Robotic Process Automation) and background billing jobs.

### **3. Global Compliance**
- **Tax Knowledge Base**: Integrated documentation for GST/SGST (India), VAT (EU), and Sales Tax (USA).
- **Dynamic Calculation**: Automatic tax rate selection based on customer region and product type.

### **4. Commerce & Payments**
- **Razorpay Integration**: Fully integrated payment gateway supporting both Live and Mock/Simulator modes.
- **Dynamic Product Catalog**: Manage products, plans, and subscription tiers with ease.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, React Query, Axios.
- **Backend**: Node.js, Express, Prisma ORM.
- **Database**: SQLite (scalable to PostgreSQL/MySQL via Prisma).
- **Payments**: Razorpay SDK.

---

## ⚙️ Setup & Installation

### **Prerequisites**
- Node.js (v18 or higher)
- npm or bun

### **1. Backend Setup**
Navigate to the backend directory and install dependencies:
```bash
cd subscription-management/backend
npm install
```

Configure Environment Variables:
Create a `.env` file in `subscription-management/backend/` with:
```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
FRONTEND_URL="http://localhost:5173"
RAZORPAY_KEY_ID="your_razorpay_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

Initialize Database:
```bash
npx prisma migrate dev
npx prisma generate
npm run seed
```

Run Server:
```bash
npm run dev
```

### **2. Frontend Setup**
Navigate to the dashboard directory and install dependencies:
```bash
cd subscriptiq-dashboard-main
npm install
```

Configure Environment Variables:
Create a `.env` file in `subscriptiq-dashboard-main/` with:
```env
VITE_API_URL="http://localhost:3000/api"
VITE_RAZORPAY_KEY_ID="your_razorpay_id"
```

Run Dashboard:
```bash
npm run dev
```

---

## 📂 Project Structure

```text
Odoo X Sns/
├── subscription-management/      # Backend Service
│   ├── prisma/                   # DB Schema & Migrations
│   ├── src/
│   │   ├── controllers/          # Business Logic
│   │   ├── routes/               # API Endpoints
│   │   └── server.ts             # Entry Point
├── subscriptiq-dashboard-main/   # Frontend Application
│   ├── src/
│   │   ├── components/           # Reusable UI
│   │   ├── pages/                # Route Views
│   │   ├── contexts/             # State Management
│   │   └── lib/                  # Utilities & API
└── README.md                     # This file
```

---

## 📄 Documentation
For more detailed technical specifications, model definitions, and function mappings, please refer to [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).

---
**Build Status**: Production-Ready 🚀
**Maintained by**: Google Deepmind Team (Antigravity AI)
=======
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
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
