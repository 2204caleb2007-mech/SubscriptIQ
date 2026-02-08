import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader, StatusBadge } from '@/components/ui/custom-cards';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2, Search, Filter, CheckCircle, CreditCard, Building, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PaymentsPage = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get('/payments');
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = payments.filter(p =>
    (p.invoice?.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card': return CreditCard;
      case 'bank transfer': return Building;
      case 'wire transfer': return Building;
      default: return CreditCard;
    }
  };

  const columns = [
    { key: 'id', label: 'Payment ID' },
    { key: 'invoice', label: 'Invoice', render: (item: any) => item.invoiceId || 'N/A' },
    {
      key: 'customer', label: 'Customer', render: (item: any) => {
        const customer = item.invoice?.customer;
        return customer?.name || customer?.email || 'N/A';
      }
    },
    {
      key: 'amount', label: 'Amount', render: (item: any) => (
        <span className="font-medium">{formatCurrency(item.amount)}</span>
      )
    },
    {
      key: 'method', label: 'Method', render: (item: any) => {
        const Icon = getMethodIcon(item.method);
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-muted-foreground" />
            {item.method}
          </div>
        );
      }
    },
    { key: 'date', label: 'Date', render: (item: any) => new Date(item.date).toLocaleDateString() },
    {
      key: 'status', label: 'Status', render: (item: any) => (
        <StatusBadge variant={item.status === 'completed' ? 'success' : 'warning'}>
          {item.status}
        </StatusBadge>
      )
    },
  ];

  // Payment history timeline
  const paymentTimeline = payments.slice(0, 5).map((payment, index) => ({
    ...payment,
    events: [
      { action: 'Payment initiated', time: new Date(payment.date).toLocaleString(), status: 'completed' },
      { action: 'Processing', time: new Date(payment.date).toLocaleString(), status: 'completed' },
      { action: 'Confirmed', time: new Date(payment.date).toLocaleString(), status: 'completed' },
    ],
  }));

  return (
    <DashboardLayout>
      <PageHeader
        title="Payments"
        description="Track and manage payment transactions"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Received', value: formatCurrency(payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0)), color: 'text-success', icon: CheckCircle },
          { label: 'Pending', value: formatCurrency(payments.filter(p => p.status !== 'completed').reduce((s, p) => s + p.amount, 0)), color: 'text-warning', icon: Clock },
          { label: 'Transactions', value: payments.length.toString(), color: 'text-foreground', icon: CreditCard },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 mb-6"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            data={filteredPayments}
            columns={columns}
            onRowClick={(item) => setSelectedPayment(item)}
          />
        )}
      </motion.div>

      {/* Payment Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 rounded-xl bg-card border border-border"
      >
        <h3 className="font-semibold mb-6">Payment Timeline</h3>
        <div className="space-y-6">
          {paymentTimeline.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success-foreground" />
                </div>
                {index < paymentTimeline.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{payment.invoice?.customer?.name || payment.invoice?.customer?.email || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground">{payment.invoiceId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payment Detail Modal */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-md">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Payment Received</h2>
                    <p className="text-sm text-muted-foreground">{selectedPayment.id}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                <div className="text-center p-6 rounded-xl bg-success/10">
                  <p className="text-4xl font-bold text-success">{formatCurrency(selectedPayment.amount)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Amount Paid</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Invoice</span>
                    <span className="font-medium">{selectedPayment.invoiceId}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium">{selectedPayment.invoice?.customer?.name || selectedPayment.invoice?.customer?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Method</span>
                    <span className="font-medium">{selectedPayment.method}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{new Date(selectedPayment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Status</span>
                    <StatusBadge variant="success">{selectedPayment.status}</StatusBadge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setSelectedPayment(null)}>Close</Button>
                <Button className="bg-gradient-primary border-0">View Invoice</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PaymentsPage;
