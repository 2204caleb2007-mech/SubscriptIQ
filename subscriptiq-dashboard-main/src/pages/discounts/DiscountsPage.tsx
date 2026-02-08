import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
<<<<<<< HEAD
import { PageHeader, StatusBadge, StatCard } from '@/components/ui/custom-cards';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus, Percent, Tag, Calendar, Edit, Trash2, Loader2, Sparkles } from 'lucide-react';
=======
import { PageHeader, StatusBadge } from '@/components/ui/custom-cards';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
<<<<<<< HEAD
=======
  Plus,
  Percent,
  Tag,
  Calendar,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
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

<<<<<<< HEAD
  const [searchQuery, setSearchQuery] = useState('');

=======
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
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

<<<<<<< HEAD
  const filteredDiscounts = discounts.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

=======
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
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
<<<<<<< HEAD
            <p className="font-medium text-sm md:text-base">{item.name}</p>
            <p className="text-xs text-muted-foreground font-mono bg-muted px-1 rounded inline-block mt-1">{item.code}</p>
=======
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">Code: {item.code}</p>
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
          </div>
        </div>
      )
    },
    {
      key: 'value', label: 'Discount', render: (item: Discount) => (
<<<<<<< HEAD
        <span className="font-semibold text-primary">
=======
        <span className="font-medium">
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
          {item.type === 'percentage' ? `${item.value}%` : formatCurrency(item.value)}
        </span>
      )
    },
    {
      key: 'usageCount', label: 'Uses', render: (item: Discount) => (
<<<<<<< HEAD
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${item.maxUses ? (item.usageCount / item.maxUses) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{item.usageCount}{item.maxUses ? ` / ${item.maxUses}` : ''}</span>
        </div>
=======
        <span>{item.usageCount}{item.maxUses ? ` / ${item.maxUses}` : ''}</span>
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
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
<<<<<<< HEAD
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
=======
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  const stats = [
<<<<<<< HEAD
    { label: 'Active Discounts', value: discounts.filter(d => d.status.toLowerCase() === 'active').length.toString(), icon: Tag, color: 'text-primary' },
    { label: 'Total Uses', value: discounts.reduce((acc, d) => acc + d.usageCount, 0).toLocaleString(), icon: Percent, color: 'text-accent' },
    { label: 'Expiring Soon', value: discounts.filter(d => d.validUntil && new Date(d.validUntil) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length.toString(), icon: Calendar, color: 'text-warning' },
    { label: 'Avg. Discount', value: discounts.length > 0 ? `${Math.round(discounts.reduce((acc, d) => acc + (d.type === 'percentage' ? d.value : 0), 0) / (discounts.filter(d => d.type === 'percentage').length || 1))}%` : '0%', icon: Sparkles, color: 'text-success' },
=======
    { label: 'Active Discounts', value: discounts.filter(d => d.status.toLowerCase() === 'active').length.toString(), icon: Tag },
    { label: 'Total Uses', value: discounts.reduce((acc, d) => acc + d.usageCount, 0).toLocaleString(), icon: Percent },
    { label: 'Expiring Soon', value: discounts.filter(d => d.validUntil && new Date(d.validUntil) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length.toString(), icon: Calendar },
    { label: 'Avg. Discount', value: discounts.length > 0 ? `${Math.round(discounts.reduce((acc, d) => acc + (d.type === 'percentage' ? d.value : 0), 0) / (discounts.filter(d => d.type === 'percentage').length || 1))}%` : '0%', icon: Percent },
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
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
<<<<<<< HEAD
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.color}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 ring-offset-background focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-10 border-border/50 hover:border-primary/50 bg-background/50 hover:bg-background transition-all shadow-sm">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            Filters
          </Button>
        </div>
=======
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
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
<<<<<<< HEAD
        className="glass-card overflow-hidden border-border/50"
=======
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
      >
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
<<<<<<< HEAD
          <DataTable data={filteredDiscounts} columns={columns} />
=======
          <DataTable data={discounts} columns={columns} />
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default DiscountsPage;
