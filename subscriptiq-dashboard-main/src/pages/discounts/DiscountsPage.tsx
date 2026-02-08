import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader, StatusBadge } from '@/components/ui/custom-cards';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  Plus,
  Percent,
  Tag,
  Calendar,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Discount {
  id: string;
  name: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usageCount: number;
  maxUses: number | null;
  validUntil: string | null;
  status: string;
}

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const { data } = await api.get('/discounts');
      setDiscounts(data);
    } catch (error) {
      console.error('Failed to fetch discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'Discount ID' },
    {
      key: 'name', label: 'Name', render: (item: Discount) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'percentage' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
            }`}>
            {item.type === 'percentage' ? <Percent className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">Code: {item.code}</p>
          </div>
        </div>
      )
    },
    {
      key: 'value', label: 'Discount', render: (item: Discount) => (
        <span className="font-medium">
          {item.type === 'percentage' ? `${item.value}%` : formatCurrency(item.value)}
        </span>
      )
    },
    {
      key: 'usageCount', label: 'Uses', render: (item: Discount) => (
        <span>{item.usageCount}{item.maxUses ? ` / ${item.maxUses}` : ''}</span>
      )
    },
    { key: 'validUntil', label: 'Valid Until', render: (item: Discount) => item.validUntil ? new Date(item.validUntil).toLocaleDateString() : 'No expiry' },
    {
      key: 'status', label: 'Status', render: (item: Discount) => (
        <StatusBadge variant={item.status.toLowerCase() === 'active' ? 'success' : 'default'}>
          {item.status}
        </StatusBadge>
      )
    },
    {
      key: 'actions', label: '', render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  const stats = [
    { label: 'Active Discounts', value: discounts.filter(d => d.status.toLowerCase() === 'active').length.toString(), icon: Tag },
    { label: 'Total Uses', value: discounts.reduce((acc, d) => acc + d.usageCount, 0).toLocaleString(), icon: Percent },
    { label: 'Expiring Soon', value: discounts.filter(d => d.validUntil && new Date(d.validUntil) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length.toString(), icon: Calendar },
    { label: 'Avg. Discount', value: discounts.length > 0 ? `${Math.round(discounts.reduce((acc, d) => acc + (d.type === 'percentage' ? d.value : 0), 0) / (discounts.filter(d => d.type === 'percentage').length || 1))}%` : '0%', icon: Percent },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Discounts"
        description="Manage discount codes and promotions"
        action={
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 border-0">
                <Plus className="w-4 h-4 mr-2" />
                Create Discount
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Discount</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Discount Name</Label>
                  <Input placeholder="e.g., Summer Sale" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Discount Code</Label>
                    <Input placeholder="SUMMER25" />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 outline-none">
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input type="number" placeholder="25" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Uses</Label>
                    <Input type="number" placeholder="Leave empty for unlimited" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input type="date" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button className="bg-gradient-primary border-0" onClick={() => setShowCreateModal(false)}>Create Discount</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
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
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable data={discounts} columns={columns} />
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default DiscountsPage;
