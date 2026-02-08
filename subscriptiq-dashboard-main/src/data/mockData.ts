// Mock Data for SubscriptIQ ERP

export const mockProducts = [
  { id: 'PROD-001', name: 'Starter Plan', category: 'SaaS', price: 29, status: 'active', variants: 3, description: 'Perfect for small teams' },
  { id: 'PROD-002', name: 'Professional Plan', category: 'SaaS', price: 99, status: 'active', variants: 2, description: 'For growing businesses' },
  { id: 'PROD-003', name: 'Enterprise Plan', category: 'SaaS', price: 299, status: 'active', variants: 5, description: 'Full-featured enterprise solution' },
  { id: 'PROD-004', name: 'API Access', category: 'Add-on', price: 49, status: 'active', variants: 1, description: 'REST & GraphQL API access' },
  { id: 'PROD-005', name: 'Premium Support', category: 'Service', price: 199, status: 'active', variants: 2, description: '24/7 priority support' },
  { id: 'PROD-006', name: 'Data Analytics', category: 'Add-on', price: 79, status: 'draft', variants: 1, description: 'Advanced analytics dashboard' },
  { id: 'PROD-007', name: 'White Label', category: 'Enterprise', price: 499, status: 'active', variants: 3, description: 'Custom branding solution' },
  { id: 'PROD-008', name: 'Training Package', category: 'Service', price: 999, status: 'active', variants: 1, description: 'On-site training for teams' },
];

export const mockPlans = [
  { id: 'PLAN-001', name: 'Monthly Starter', product: 'Starter Plan', billing: 'monthly', price: 29, subscribers: 1247, status: 'active' },
  { id: 'PLAN-002', name: 'Annual Starter', product: 'Starter Plan', billing: 'yearly', price: 290, subscribers: 823, status: 'active' },
  { id: 'PLAN-003', name: 'Monthly Pro', product: 'Professional Plan', billing: 'monthly', price: 99, subscribers: 562, status: 'active' },
  { id: 'PLAN-004', name: 'Annual Pro', product: 'Professional Plan', billing: 'yearly', price: 990, subscribers: 891, status: 'active' },
  { id: 'PLAN-005', name: 'Monthly Enterprise', product: 'Enterprise Plan', billing: 'monthly', price: 299, subscribers: 134, status: 'active' },
  { id: 'PLAN-006', name: 'Annual Enterprise', product: 'Enterprise Plan', billing: 'yearly', price: 2990, subscribers: 267, status: 'active' },
];

export const mockSubscriptions = [
  { id: 'SUB-001', customer: 'Acme Corp', plan: 'Annual Pro', status: 'active', startDate: '2024-01-15', nextBilling: '2025-01-15', mrr: 82.50, email: 'billing@acme.com' },
  { id: 'SUB-002', customer: 'TechStart Inc', plan: 'Monthly Starter', status: 'active', startDate: '2024-06-01', nextBilling: '2025-02-01', mrr: 29, email: 'admin@techstart.io' },
  { id: 'SUB-003', customer: 'Global Solutions', plan: 'Annual Enterprise', status: 'active', startDate: '2024-03-20', nextBilling: '2025-03-20', mrr: 249.17, email: 'finance@globalsol.com' },
  { id: 'SUB-004', customer: 'Startup Labs', plan: 'Monthly Pro', status: 'quotation', startDate: '2025-02-01', nextBilling: '-', mrr: 99, email: 'hello@startuplabs.co' },
  { id: 'SUB-005', customer: 'Innovation Hub', plan: 'Annual Starter', status: 'draft', startDate: '-', nextBilling: '-', mrr: 24.17, email: 'team@innohub.io' },
  { id: 'SUB-006', customer: 'DataFlow Systems', plan: 'Monthly Enterprise', status: 'active', startDate: '2024-09-10', nextBilling: '2025-02-10', mrr: 299, email: 'ops@dataflow.tech' },
  { id: 'SUB-007', customer: 'CloudNine Ltd', plan: 'Annual Pro', status: 'cancelled', startDate: '2024-02-01', nextBilling: '-', mrr: 0, email: 'info@cloudnine.co.uk' },
  { id: 'SUB-008', customer: 'NextGen Apps', plan: 'Monthly Starter', status: 'active', startDate: '2024-11-15', nextBilling: '2025-02-15', mrr: 29, email: 'support@nextgenapps.dev' },
];

export const mockInvoices = [
  { id: 'INV-2025-001', customer: 'Acme Corp', amount: 990, status: 'paid', dueDate: '2025-01-15', paidDate: '2025-01-14', subscription: 'SUB-001' },
  { id: 'INV-2025-002', customer: 'TechStart Inc', amount: 29, status: 'paid', dueDate: '2025-01-01', paidDate: '2025-01-01', subscription: 'SUB-002' },
  { id: 'INV-2025-003', customer: 'Global Solutions', amount: 2990, status: 'pending', dueDate: '2025-02-20', paidDate: null, subscription: 'SUB-003' },
  { id: 'INV-2025-004', customer: 'DataFlow Systems', amount: 299, status: 'overdue', dueDate: '2025-01-10', paidDate: null, subscription: 'SUB-006' },
  { id: 'INV-2025-005', customer: 'NextGen Apps', amount: 29, status: 'paid', dueDate: '2025-01-15', paidDate: '2025-01-15', subscription: 'SUB-008' },
  { id: 'INV-2024-089', customer: 'Acme Corp', amount: 990, status: 'paid', dueDate: '2024-12-15', paidDate: '2024-12-14', subscription: 'SUB-001' },
  { id: 'INV-2024-088', customer: 'CloudNine Ltd', amount: 82.50, status: 'void', dueDate: '2024-12-01', paidDate: null, subscription: 'SUB-007' },
  { id: 'INV-2024-087', customer: 'Global Solutions', amount: 2990, status: 'paid', dueDate: '2024-11-20', paidDate: '2024-11-19', subscription: 'SUB-003' },
];

export const mockPayments = [
  { id: 'PAY-001', invoice: 'INV-2025-001', amount: 990, method: 'Credit Card', status: 'completed', date: '2025-01-14', customer: 'Acme Corp' },
  { id: 'PAY-002', invoice: 'INV-2025-002', amount: 29, method: 'Bank Transfer', status: 'completed', date: '2025-01-01', customer: 'TechStart Inc' },
  { id: 'PAY-003', invoice: 'INV-2025-005', amount: 29, method: 'Credit Card', status: 'completed', date: '2025-01-15', customer: 'NextGen Apps' },
  { id: 'PAY-004', invoice: 'INV-2024-089', amount: 990, method: 'Credit Card', status: 'completed', date: '2024-12-14', customer: 'Acme Corp' },
  { id: 'PAY-005', invoice: 'INV-2024-087', amount: 2990, method: 'Wire Transfer', status: 'completed', date: '2024-11-19', customer: 'Global Solutions' },
];

export const mockDiscounts = [
  { id: 'DISC-001', name: 'New Year Special', type: 'percentage', value: 20, code: 'NY2025', status: 'active', usageCount: 156, maxUses: 500, validUntil: '2025-01-31' },
  { id: 'DISC-002', name: 'Annual Discount', type: 'percentage', value: 15, code: 'ANNUAL15', status: 'active', usageCount: 892, maxUses: null, validUntil: null },
  { id: 'DISC-003', name: 'Startup Program', type: 'percentage', value: 50, code: 'STARTUP50', status: 'active', usageCount: 45, maxUses: 100, validUntil: '2025-06-30' },
  { id: 'DISC-004', name: 'Fixed Discount', type: 'fixed', value: 50, code: 'SAVE50', status: 'inactive', usageCount: 234, maxUses: 300, validUntil: '2024-12-31' },
  { id: 'DISC-005', name: 'Referral Bonus', type: 'percentage', value: 25, code: 'REFER25', status: 'active', usageCount: 567, maxUses: null, validUntil: null },
];

export const mockTaxes = [
  { id: 'TAX-001', name: 'Standard VAT', rate: 20, region: 'UK', status: 'active', appliesTo: 'All Products' },
  { id: 'TAX-002', name: 'EU VAT', rate: 21, region: 'European Union', status: 'active', appliesTo: 'All Products' },
  { id: 'TAX-003', name: 'US Sales Tax', rate: 8.25, region: 'United States', status: 'active', appliesTo: 'All Products' },
  { id: 'TAX-004', name: 'GST', rate: 10, region: 'Australia', status: 'active', appliesTo: 'All Products' },
  { id: 'TAX-005', name: 'Zero Rate', rate: 0, region: 'Global', status: 'active', appliesTo: 'Services Only' },
];

export const mockUsers = [
  { id: 'USR-001', name: 'Alex Morgan', email: 'admin@subscriptiq.com', role: 'admin', status: 'active', lastLogin: '2025-02-07 09:30', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 'USR-002', name: 'Jordan Smith', email: 'jordan@subscriptiq.com', role: 'internal', status: 'active', lastLogin: '2025-02-07 08:45', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 'USR-003', name: 'Casey Williams', email: 'casey@subscriptiq.com', role: 'internal', status: 'active', lastLogin: '2025-02-06 17:20', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: 'USR-004', name: 'Riley Chen', email: 'riley@subscriptiq.com', role: 'internal', status: 'inactive', lastLogin: '2025-01-28 14:10', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
];

export const mockCustomers = [
  { id: 'CUST-001', name: 'Taylor Johnson', email: 'taylor@acme.com', company: 'Acme Corp', subscriptions: 2, totalSpent: 5940, status: 'active', joinDate: '2023-06-15' },
  { id: 'CUST-002', name: 'Morgan Lee', email: 'morgan@techstart.io', company: 'TechStart Inc', subscriptions: 1, totalSpent: 348, status: 'active', joinDate: '2024-06-01' },
  { id: 'CUST-003', name: 'Jamie Parker', email: 'jamie@globalsol.com', company: 'Global Solutions', subscriptions: 3, totalSpent: 17940, status: 'active', joinDate: '2023-01-10' },
  { id: 'CUST-004', name: 'Drew Martinez', email: 'drew@dataflow.tech', company: 'DataFlow Systems', subscriptions: 1, totalSpent: 1495, status: 'active', joinDate: '2024-09-10' },
  { id: 'CUST-005', name: 'Avery Brown', email: 'avery@cloudnine.co.uk', company: 'CloudNine Ltd', subscriptions: 0, totalSpent: 990, status: 'churned', joinDate: '2024-02-01' },
];

export const mockActivityLog = [
  { id: 1, action: 'Invoice Generated', target: 'INV-2025-003', user: 'System', timestamp: '2025-02-07 10:00:00', type: 'automation' },
  { id: 2, action: 'Payment Received', target: 'PAY-003', user: 'System', timestamp: '2025-02-07 09:45:00', type: 'payment' },
  { id: 3, action: 'Subscription Renewed', target: 'SUB-002', user: 'System', timestamp: '2025-02-07 09:30:00', type: 'subscription' },
  { id: 4, action: 'Reminder Sent', target: 'INV-2025-004', user: 'Automation', timestamp: '2025-02-07 09:00:00', type: 'automation' },
  { id: 5, action: 'New User Registered', target: 'CUST-006', user: 'System', timestamp: '2025-02-06 16:20:00', type: 'user' },
  { id: 6, action: 'Discount Applied', target: 'DISC-001', user: 'Jordan Smith', timestamp: '2025-02-06 15:45:00', type: 'discount' },
  { id: 7, action: 'Plan Upgraded', target: 'SUB-008', user: 'Customer', timestamp: '2025-02-06 14:30:00', type: 'subscription' },
  { id: 8, action: 'Churn Risk Alert', target: 'CUST-005', user: 'AI System', timestamp: '2025-02-06 12:00:00', type: 'ai' },
];

export const mockChurnPredictions = [
  { customerId: 'CUST-001', company: 'Acme Corp', riskScore: 15, riskLevel: 'low', factors: ['Consistent payments', 'High engagement'], recommendation: 'Offer loyalty discount' },
  { customerId: 'CUST-002', company: 'TechStart Inc', riskScore: 35, riskLevel: 'medium', factors: ['Support tickets increased', 'Reduced usage'], recommendation: 'Schedule check-in call' },
  { customerId: 'CUST-003', company: 'Global Solutions', riskScore: 8, riskLevel: 'low', factors: ['Long-term customer', 'Multiple subscriptions'], recommendation: 'Upsell opportunity' },
  { customerId: 'CUST-004', company: 'DataFlow Systems', riskScore: 72, riskLevel: 'high', factors: ['Overdue payment', 'No recent logins'], recommendation: 'Immediate outreach required' },
  { customerId: 'CUST-005', company: 'CloudNine Ltd', riskScore: 95, riskLevel: 'high', factors: ['Cancelled subscription', 'Unresolved complaints'], recommendation: 'Win-back campaign' },
];

export const mockRevenueData = [
  { month: 'Jul', revenue: 124500, subscriptions: 2890, churn: 45 },
  { month: 'Aug', revenue: 132800, subscriptions: 3120, churn: 52 },
  { month: 'Sep', revenue: 145200, subscriptions: 3340, churn: 38 },
  { month: 'Oct', revenue: 158900, subscriptions: 3580, churn: 61 },
  { month: 'Nov', revenue: 172300, subscriptions: 3850, churn: 47 },
  { month: 'Dec', revenue: 189500, subscriptions: 4120, churn: 55 },
  { month: 'Jan', revenue: 198700, subscriptions: 4380, churn: 42 },
];

export const mockAutomationLogs = [
  { id: 1, workflow: 'Invoice Generation', status: 'completed', triggeredAt: '2025-02-07 10:00:00', completedAt: '2025-02-07 10:00:05', records: 45 },
  { id: 2, workflow: 'Payment Reminder', status: 'completed', triggeredAt: '2025-02-07 09:00:00', completedAt: '2025-02-07 09:00:12', records: 23 },
  { id: 3, workflow: 'Subscription Renewal', status: 'completed', triggeredAt: '2025-02-07 08:00:00', completedAt: '2025-02-07 08:00:08', records: 156 },
  { id: 4, workflow: 'Churn Analysis', status: 'running', triggeredAt: '2025-02-07 07:00:00', completedAt: null, records: 0 },
  { id: 5, workflow: 'Welcome Email', status: 'completed', triggeredAt: '2025-02-06 16:20:00', completedAt: '2025-02-06 16:20:02', records: 1 },
];

export const mockNotifications = [
  { id: 1, title: 'Payment Received', message: 'Acme Corp paid $990 for INV-2025-001', time: '5 min ago', read: false, type: 'success' },
  { id: 2, title: 'Overdue Invoice', message: 'INV-2025-004 is now 7 days overdue', time: '1 hour ago', read: false, type: 'warning' },
  { id: 3, title: 'New Subscription', message: 'NextGen Apps subscribed to Monthly Starter', time: '2 hours ago', read: true, type: 'info' },
  { id: 4, title: 'Churn Risk Alert', message: 'DataFlow Systems flagged as high risk', time: '3 hours ago', read: true, type: 'danger' },
  { id: 5, title: 'AI Insight', message: 'Revenue forecast updated for Q1', time: '5 hours ago', read: true, type: 'info' },
];
