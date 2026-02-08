import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader, StatusBadge } from '@/components/ui/custom-cards';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  XCircle,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Subscription {
  id: string;
  status: string;
  startDate: string | null;
  nextBilling: string | null;
  mrr: number;
  customer: {
    name: string;
    email: string;
  };
  plan: {
    name: string;
    product: {
      name: string;
    };
  };
}

const statusSteps = [
  { key: 'DRAFT', label: 'Draft', icon: FileText },
  { key: 'QUOTATION', label: 'Quotation', icon: Clock },
  { key: 'ACTIVE', label: 'Active', icon: CheckCircle },
  { key: 'CANCELLED', label: 'Closed', icon: XCircle },
];

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data } = await api.get('/subscriptions');
      setSubscriptions(data);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(s =>
    (s.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'all' || s.status === statusFilter)
  );

  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'success';
      case 'QUOTATION': return 'info';
      case 'DRAFT': return 'default';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { key: 'id', label: 'Subscription ID' },
    {
      key: 'customer', label: 'Customer', render: (item: Subscription) => (
        <div>
          <p className="font-medium">{item.customer.name}</p>
          <p className="text-xs text-muted-foreground">{item.customer.email}</p>
        </div>
      )
    },
    { key: 'plan', label: 'Plan', render: (item: Subscription) => item.plan.name },
    { key: 'mrr', label: 'MRR', render: (item: Subscription) => formatCurrency(item.mrr) },
    { key: 'nextBilling', label: 'Next Billing', render: (item: Subscription) => item.nextBilling ? new Date(item.nextBilling).toLocaleDateString() : 'N/A' },
    {
      key: 'status', label: 'Status', render: (item: Subscription) => (
        <StatusBadge variant={getStatusVariant(item.status)}>
          {item.status}
        </StatusBadge>
      )
    },
  ];

  const getStepStatus = (step: string, currentStatus: string) => {
    const order = ['DRAFT', 'QUOTATION', 'ACTIVE', 'CANCELLED'];
    const stepIndex = order.indexOf(step);
    const currentIndex = order.indexOf(currentStatus.toUpperCase());

    if (currentStatus.toUpperCase() === 'CANCELLED' && step === 'CANCELLED') return 'current';
    if (currentStatus.toUpperCase() === 'CANCELLED' && step !== 'CANCELLED') return stepIndex < currentIndex ? 'completed' : 'pending';
    if (step === 'CANCELLED') return 'pending';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Subscriptions"
        description="Manage customer subscriptions"
        action={
          <Button className="bg-gradient-primary hover:opacity-90 border-0">
            <Plus className="w-4 h-4 mr-2" />
            New Subscription
          </Button>
        }
      />

      {/* Status Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {['all', 'ACTIVE', 'QUOTATION', 'DRAFT', 'CANCELLED'].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className={statusFilter === status ? 'bg-gradient-primary border-0' : ''}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            {status !== 'all' && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-background/20 text-xs">
                {subscriptions.filter(s => s.status === status).length}
              </span>
            )}
          </Button>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 mb-6"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            data={filteredSubscriptions}
            columns={columns}
            onRowClick={(item) => setSelectedSubscription(item)}
          />
        )}
      </motion.div>

      {/* Subscription Detail Modal with Timeline */}
      <Dialog open={!!selectedSubscription} onOpenChange={() => setSelectedSubscription(null)}>
        <DialogContent className="max-w-2xl">
          {selectedSubscription && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{selectedSubscription.customer.name}</h2>
                      <p className="text-sm text-muted-foreground">{selectedSubscription.id}</p>
                    </div>
                    <StatusBadge variant={getStatusVariant(selectedSubscription.status)}>
                      {selectedSubscription.status}
                    </StatusBadge>
                  </div>
                </DialogTitle>
              </DialogHeader>

              {/* Lifecycle Timeline */}
              <div className="my-8">
                <h4 className="text-sm font-medium mb-4">Subscription Lifecycle</h4>
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                  {statusSteps.map((step, index) => {
                    const status = getStepStatus(step.key, selectedSubscription.status);
                    const Icon = step.icon;
                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col items-center relative z-10"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'completed' ? 'bg-success text-success-foreground' :
                            status === 'current' ? 'bg-primary text-primary-foreground animate-pulse-soft' :
                              'bg-muted text-muted-foreground'
                          }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs mt-2 ${status === 'pending' ? 'text-muted-foreground' : ''}`}>
                          {step.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="font-medium">{selectedSubscription.plan.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{selectedSubscription.startDate ? new Date(selectedSubscription.startDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedSubscription.customer.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">MRR</p>
                    <p className="font-medium text-xl">{formatCurrency(selectedSubscription.mrr)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Billing</p>
                    <p className="font-medium">{selectedSubscription.nextBilling ? new Date(selectedSubscription.nextBilling).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setSelectedSubscription(null)}>Close</Button>
                {selectedSubscription.status === 'DRAFT' && (
                  <Button className="bg-gradient-primary border-0">
                    Send Quotation <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {selectedSubscription.status === 'QUOTATION' && (
                  <Button className="bg-gradient-success border-0">
                    Activate <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {selectedSubscription.status === 'ACTIVE' && (
                  <Button variant="destructive">
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SubscriptionsPage;
