# SubscriptIQ: Comprehensive Technical Manual

This manual provides an exhaustive technical deep-dive into the SubscriptIQ Subscription Management ERP. It maps every core functionality, framework, and library to its exact implementation in the code.

---

## 1. Core Frameworks & Dependencies Mapping

### **Backend (Node.js/Express)**
*Root Folder: `subscription-management/backend`*

| Technology | Folder/File Path | Line Mapping | Rationale |
| :--- | :--- | :--- | :--- |
| **Express** | `package.json` | L27 | Standard for RESTful API routing and middleware. |
| **Express Setup** | `src/server.ts` | L2, L19 | Initializes the web server instance. |
| **Prisma Client** | `package.json` | L23 | Type-safe ORM chosen for database integrity. |
| **Prisma Schema** | `prisma/schema.prisma` | L1-L200 | Definitive source of truth for all database models. |
| **Razorpay SDK** | `package.json` | L29 | Chosen for robust domestic/international payment support. |
| **Razorpay Logic** | `src/controllers/payment.controller.ts` | L3, L98 | Encapsulates order creation and signature verification. |
| **Bcrypt** | `package.json` | L24 | Security standard for one-way password hashing. |
| **JWT** | `package.json` | L28 | Implements stateless authentication for security. |
| **Zod** | `package.json` | L30 | Schema validation for every incoming API request. |
| **CORS** | `src/server.ts` | L3, L24-42 | Configured to allow secure cross-origin resource sharing. |

### **Frontend (React/Vite)**
*Root Folder: `subscriptiq-dashboard-main`*

| Technology | Folder/File Path | Line Mapping | Rationale |
| :--- | :--- | :--- | :--- |
| **React 18** | `package.json` | L58 | High-performance component-based UI management. |
| **Vite** | `package.json` | L91 | Extremely fast build tool for modern asset piping. |
| **Initialization** | `src/main.tsx` | L1, L9 | Entry point using Concurrent Mode for fluidity. |
| **Framer Motion** | `package.json` | L52 | Chosen for smooth, hardware-accelerated UI transitions. |
| **TanStack Query** | `package.json` | L45 | Manages server-state synchronization (Caching/Polling). |
| **Query Provider** | `src/App.tsx` | L32, L71 | Wraps the application to provide global hydration. |
| **Tailwind CSS** | `package.json` | L88 | Utility-first styling for the "Navy Blue" premium theme. |
| **Lucide React** | `package.json` | L56 | Modular iconography used across all dashboards. |
| **Sonner** | `package.json` | L65 | Toast notification system for real-time feedback. |
| **jsPDF** | `package.json` | L55 | Client-side engine for high-fidelity "AI Bill" generation. |
| **Recharts** | `src/components/dashboard/DailySpendChart.tsx` | L1-L10 | Data visualization for spend analytics. |
| **Radix UI** | `package.json` | L17-L43 | Foundational primitives for accessible UI components. |

---

## 2. Database Models (Prisma Schema Deep-Dive)
*Location: `backend/prisma/schema.prisma`*

| Model | Line Range | Functional Role |
| :--- | :--- | :--- |
| **User** | L11-L25 | Handles multi-role accounts (ADMIN, INTERNAL, CUSTOMER). |
| **Product** | L27-L43 | Stores inventory and metadata for tiered billing. |
| **Plan** | L45-L59 | Links products to specific billing intervals (L53). |
| **Customer** | L61-L76 | Tracks CRM data and total revenue per user. |
| **Subscription** | L78-L93 | The core "Agreement" model tracking active billing states. |
| **Invoice** | L95-L111 | Individual billing documents with automated totals (L104). |
| **Payment** | L113-L125 | Ledger for actual money movement. |
| **Discount** | L127-L141 | Promo and loyalty logic with usage limits. |
| **Tax** | L143-L154 | Compliance layer for GST/VAT calculations. |
| **Order** | L156-L172 | Temporary state for Razorpay checkout sessions. |
| **AutomationLog** | L187-L200 | Tracking for RPA workflows and background jobs. |

---

## 3. Functional Logic & Controller Mapping

### **Security & Authentication**
*Controller: `backend/src/controllers/auth.controller.ts`*

- **Password Hashing**: L11, L28 (Uses `bcrypt`).
- **Token Generation**: L44, L170 (Uses `jsonwebtoken`).
- **Google OAuth Flow**: L180-L226 (Automated account provisioning).

### **Financial & Billing Engine**
*Controller: `backend/src/controllers/payment.controller.ts`*

- **Razorpay Order Creation**: L98-L137.
- **Crypto-Signature Validation**: L141-L150 (Security verification).
- **Invoice Auto-Generation**: L196 (Triggered upon payment success).

### **AI & Analytics Integration**
*Location: `frontend/src/pages/ai`*

- **AI Chat Logic**: `AIChatPage.tsx` (L14-L98).
- **Churn Prediction UI**: `AIInsightsPage.tsx` (L35-L52).
- **Staff Operations AI**: `dashboards/InternalDashboard.tsx` (L142-L176).

---

## 4. Technology Rationale: The "Why" Behind the Code

- **Vite (Quick Dev Cycle)**: Chosen over Webpack to reduce refresh times during rapid UI iteration.
- **TanStack Query (Data Freshness)**: Implemented specifically to handle real-time payment status without manual refreshes (See `src/App.tsx:L32`).
- **Prisma (Safe Scale)**: Chosen to allow us to modify the financial schema (like adding `AutomationLog`) without risking database corruption (See `prisma/schema.prisma:L187`).
- **Framer Motion (Premium UX)**: Used to distinguish SubscriptIQ from standard "Boring" ERPs with smooth physics-based motion (See `src/pages/LandingPage.tsx`).

---

**Technical Auditor**: Antigravity AI  
**Project Health**: Optimized & Sanitized  
**Reference ID**: SUBSCRIPTIQ-MANUAL-V1.3
