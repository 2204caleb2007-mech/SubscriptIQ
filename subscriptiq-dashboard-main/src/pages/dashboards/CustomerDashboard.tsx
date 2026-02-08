import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader, StatusBadge, GradientCard } from '@/components/ui/custom-cards';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import DailySpendChart from '@/components/dashboard/DailySpendChart';

const CustomerDashboard = () => {
  // Mock customer data
  const subscription = {
    plan: 'Professional Plan',
    billing: 'Annual',
    status: 'active',
    nextBilling: 'March 20, 2025',
    amount: 990,
  };

  const recentInvoices = [
    { id: 'INV-2025-001', date: 'Jan 15, 2025', amount: 990, status: 'paid' },
    { id: 'INV-2024-089', date: 'Dec 15, 2024', amount: 990, status: 'paid' },
    { id: 'INV-2024-078', date: 'Nov 15, 2024', amount: 990, status: 'paid' },
  ];

  const aiRecommendations = [
    { title: 'Upgrade to Enterprise', description: 'Unlock API access and premium support', savings: 'Save 20% annually' },
    { title: 'Add Team Members', description: 'Your plan supports up to 10 seats', cta: 'Invite team' },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Welcome back!"
        description="Manage your subscription and billing"
      />

      {/* Subscription Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2"
        >
          <GradientCard gradient="primary" className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 mb-1">Current Subscription</p>
                <h2 className="text-2xl font-bold text-white mb-4">{subscription.plan}</h2>
                <div className="flex items-center gap-4 text-white/80">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {subscription.billing}
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    Active
                  </span>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Manage Plan
              </Button>
            </div>
          </GradientCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Next Billing</span>
          </div>
          <p className="text-2xl font-bold mb-1">{subscription.nextBilling}</p>
          <p className="text-muted-foreground">${subscription.amount.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Spending Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 p-6 rounded-xl bg-card border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Spending History</h3>
            <p className="text-sm text-muted-foreground">Your daily transaction activity</p>
          </div>
        </div>
        <DailySpendChart />
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Outstanding', value: '$0', icon: DollarSign, status: 'success' },
          { label: 'This Month', value: '$990', icon: TrendingUp, status: 'neutral' },
          { label: 'Total Paid', value: '$5,940', icon: CreditCard, status: 'neutral' },
          { label: 'Invoices', value: '6', icon: FileText, status: 'neutral' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-4 h-4 text-muted-foreground" />
              {stat.status === 'success' && (
                <span className="w-2 h-2 rounded-full bg-success" />
              )}
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold">Recent Invoices</h3>
            </div>
            <Link to="/invoices">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${invoice.amount.toLocaleString()}</p>
                  <StatusBadge variant="success">{invoice.status}</StatusBadge>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">AI Recommendations</h3>
          </div>
          <div className="space-y-4">
            {aiRecommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-4 rounded-lg border border-accent/30 bg-accent/5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-accent">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    {rec.savings && (
                      <p className="text-sm text-success mt-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {rec.savings}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    {rec.cta || 'Learn More'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 p-6 rounded-xl bg-muted/50 border border-border"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <AlertCircle className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Need Help?</h3>
            <p className="text-sm text-muted-foreground">Our AI assistant is here to help you with billing questions.</p>
          </div>
          <Link to="/ai-chat">
            <Button>
              <Sparkles className="w-4 h-4 mr-2" />
              Chat with AI
            </Button>
          </Link>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
