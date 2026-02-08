import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader, StatusBadge } from '@/components/ui/custom-cards';
import { mockSubscriptions, mockInvoices, mockActivityLog, mockAutomationLogs } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  FileText,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Zap,
  RefreshCw,
} from 'lucide-react';

const InternalDashboard = () => {
  const pendingInvoices = mockInvoices.filter(i => i.status === 'pending' || i.status === 'overdue');
  const subscriptionsNeedingAction = mockSubscriptions.filter(s => s.status === 'quotation' || s.status === 'draft');

  const taskStats = [
    { label: 'Pending Invoices', value: pendingInvoices.length, icon: FileText, color: 'text-warning' },
    { label: 'Subscriptions to Review', value: subscriptionsNeedingAction.length, icon: CreditCard, color: 'text-primary' },
    { label: 'Automation Tasks', value: mockAutomationLogs.filter(l => l.status === 'running').length, icon: Zap, color: 'text-accent' },
    { label: 'Completed Today', value: 12, icon: CheckCircle, color: 'text-success' },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Staff Dashboard"
        description="Your tasks and pending items"
      />

      {/* Task Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {taskStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Pending Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-warning" />
              <h3 className="font-semibold">Pending Invoices</h3>
            </div>
            <Link to="/invoices">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {pendingInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${invoice.amount.toLocaleString()}</p>
                  <StatusBadge variant={invoice.status === 'overdue' ? 'danger' : 'warning'}>
                    {invoice.status}
                  </StatusBadge>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Subscriptions Requiring Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Subscriptions to Review</h3>
            </div>
            <Link to="/subscriptions">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {subscriptionsNeedingAction.map((sub, index) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium">{sub.customer}</p>
                  <p className="text-sm text-muted-foreground">{sub.plan}</p>
                </div>
                <StatusBadge variant={sub.status === 'quotation' ? 'info' : 'default'}>
                  {sub.status}
                </StatusBadge>
              </motion.div>
            ))}
            {subscriptionsNeedingAction.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No subscriptions need attention</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Activity & Automation */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {mockActivityLog.slice(0, 6).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className={`mt-1 p-1.5 rounded-full ${
                  activity.type === 'payment' ? 'bg-success/10 text-success' :
                  activity.type === 'automation' ? 'bg-accent/10 text-accent' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {activity.type === 'payment' ? <CheckCircle className="w-3 h-3" /> :
                   activity.type === 'automation' ? <Zap className="w-3 h-3" /> :
                   <AlertTriangle className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Automation Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="font-semibold">Automation Jobs</h3>
            </div>
            <Link to="/automation">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {mockAutomationLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {log.status === 'running' ? (
                    <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-success" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{log.workflow}</p>
                    <p className="text-xs text-muted-foreground">{log.triggeredAt}</p>
                  </div>
                </div>
                <StatusBadge variant={log.status === 'running' ? 'info' : 'success'}>
                  {log.status === 'running' ? 'Running' : `${log.records} records`}
                </StatusBadge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default InternalDashboard;
