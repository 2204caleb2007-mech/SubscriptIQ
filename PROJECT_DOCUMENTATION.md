# SubscriptIQ: Technical Documentation & Implementation Summary

This document provides a comprehensive technical overview of the SubscriptIQ project, detailing the architecture, data models, frameworks, and key functionalities implemented to date.

---

## 1. Technical Architecture & Frameworks

SubscriptIQ is built using a modern, scalable full-stack architecture designed for high performance and premium user experience.

### **Frontend**
- **React (Vite)**: The core UI framework, providing a fast and reactive developer experience.
- **TypeScript**: Ensures type safety across the application, reducing runtime errors.
- **Tailwind CSS**: Used for all styling, enabling a highly customized and responsive design system.
- **Framer Motion**: Powers all premium animations, including page transitions and the "ColorBends" WebGL-like generative visuals.
- **Lucide React**: A consistent and clean iconography set used throughout the dashboard.
- **TanStack Query (React Query)**: Manages server state, caching, and data synchronization.
- **Axios**: The primary HTTP client for backend communication.

### **Backend**
- **Node.js & Express**: A robust and high-speed server environment.
- **Prisma ORM**: Modern database access layer for TypeScript, providing type-safe queries and automated migrations.
- **SQLite**: The current primary database engine (`dev.db`), offering a lightweight yet powerful storage solution.
- **Razorpay SDK**: Integrated for secure and flexible payment processing.

---

## 2. Database Schema (The Data Models)

The backend uses **Prisma** to manage the following core entities:

| Model | Purpose | Key Fields |
| :--- | :--- | :--- |
| **User** | System accounts (Admin/Staff/Customer). | `name`, `email`, `role`, `status` |
| **Product** | Core offerings available for subscription. | `name`, `category`, `price`, `stock` |
| **Plan** | Specific billing structures for products. | `billing` (Monthly/Yearly), `price` |
| **Customer** | Profiles of companies or individuals. | `email`, `totalSpent`, `status` |
| **Subscription** | Active billing relationships. | `startDate`, `nextBilling`, `status` |
| **Invoice** | Billing documents generated for subscriptions. | `amount`, `status`, `dueDate` |
| **Payment** | Transaction records. | `method`, `amount`, `status`, `referenceId` |
| **Order** | Initial purchase intents. | `razorpayOrderId`, `totalAmount`, `status` |
| **Tax** | Regional tax rules. | `rate`, `region`, `appliesTo` (GST/VAT) |
| **Discount** | Coupons and referral codes. | `code`, `type`, `value`, `usageCount` |
| **AutomationLog** | Live tracking of background processes. | `workflow`, `action`, `records`, `status` |

---

## 3. Core Functionalities & Implementation Details

### **A. Smart Invoicing System**
- **Function**: `generateInvoice` (Backend) / `downloadPDF` (Frontend).
- **Logic**: Automatically calculates totals based on active subscriptions, applies relevant Taxes (GST/SGST) and Discounts, and generates a downloadable PDF document.
- **Location**: `backend/src/controllers/invoice.controller.ts` & `frontend/src/pages/invoices/InvoicesPage.tsx`.

### **B. AI-Powered Assistant & Notifications**
- **AI Sidebar Badge**: A pulsing notification badge that appears when new invoices or insights are available.
- **AI Insights**: Found in the post-payment screen; uses transaction data to provide immediate financial summaries to the user.
- **Implementation**: Managed via a global `NotificationContext` on the frontend.

### **C. Razorpay Payment Integration**
- **Function**: `createOrder`, `verifyPayment`.
- **Logic**: Handles the secure handshake between SubscriptIQ and Razorpay. Supports a **Mock Mode** for visual simulation and a **Live Mode** for actual transactions.
- **Location**: `backend/src/controllers/payment.controller.ts`.

### **D. Premium Visual Experience (ColorBends)**
- **Component**: `<ColorBends />`.
- **Logic**: A high-performance WebGL-based animation component that generates flowing, geometric patterns based on noise and warp algorithms.
- **Implementation**: Integrated into `LandingPage.tsx` and `LoginPage.tsx` to provide a "wow" factor first impression.

### **E. Dynamic Automation Engine**
- **Function**: `getAutomationLogs`.
- **Logic**: Fetches live tracking data from the backend to show real-time progress of automated billing cycles, renewals, and sync jobs.
- **Location**: `backend/src/routes/automation.routes.ts` & `frontend/src/pages/automation/AutomationPage.tsx`.

### **F. Global Tax Compliance**
- **Regional Laws**: Documentation for India (GST), EU (VAT), and USA (Sales Tax) integrated into the Taxes portal.
- **Automated Calculation**: The backend dynamically selects tax rates based on the customer's region.

---

## 4. Folder Structure & Organization

- `/subscription-management/backend`:
    - `src/controllers`: Business logic for each entity.
    - `src/routes`: API endpoint definitions.
    - `prisma/schema.prisma`: The "Source of Truth" for the database.
- `/subscriptiq-dashboard-main/src`:
    - `pages`: Higher-level route components (Dashboard, Payments, etc.).
    - `components`: Reusable UI elements (Buttons, Cards, Modals).
    - `contexts`: Global state managers (Auth, Cart, Notifications).
    - `lib`: Shared utilities (`api.ts`, `utils.ts`).

---

## 5. Summary of Recent Accomplishments
1. **Workspace Sanitization**: Removed all unrelated files (`StyleZone`) to ensure a specialized environment.
2. **Fixed Payment Infrastructure**: Resolved core crashes and stabilized the payment timeline.
3. **Enhanced Visual Identity**: Integrated signature animations and high-end design tokens.
4. **Data-Driven Automation**: Powered the RPA dashboard with real backend logging.

---
**Documentation Version**: 1.0.0
**Last Updated**: February 2026
