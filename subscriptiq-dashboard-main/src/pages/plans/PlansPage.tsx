import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader, StatusBadge } from '@/components/ui/custom-cards';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  Plus,
  Calendar,
  Users,
  Check,
  Loader2,
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly' | string;
  status: string;
  product?: {
    name: string;
  };
  subscribers?: number;
  _count?: {
    subscriptions: number;
  };
}

const PlansPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBilling, setSelectedBilling] = useState<'all' | 'monthly' | 'yearly'>('all');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await api.get('/plans');
      setPlans(data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter(p =>
    selectedBilling === 'all' || p.billing.toLowerCase() === selectedBilling
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="Recurring Plans"
        description="Manage subscription plans and pricing"
        action={
          <Button className="bg-gradient-primary hover:opacity-90 border-0">
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        }
      />

      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 mb-8"
      >
        {['all', 'monthly', 'yearly'].map((option) => (
          <Button
            key={option}
            variant={selectedBilling === option ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedBilling(option as typeof selectedBilling)}
            className={selectedBilling === option ? 'bg-gradient-primary border-0' : ''}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Button>
        ))}
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-card border border-border card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.product?.name || 'No Product'}</p>
                </div>
                <StatusBadge variant={plan.status.toLowerCase() === 'active' ? 'success' : 'default'}>
                  {plan.status}
                </StatusBadge>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                  <span className="text-muted-foreground">/{plan.billing.toLowerCase() === 'yearly' ? 'year' : 'month'}</span>
                </div>
                {plan.billing.toLowerCase() === 'yearly' && (
                  <p className="text-sm text-success mt-1">Save 17% vs monthly</p>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Users className="w-4 h-4" />
                <span>{(plan._count?.subscriptions || 0).toLocaleString()} subscribers</span>
              </div>

              <div className="space-y-3 mb-6">
                {['Access to all features', '24/7 Support', 'API Access', 'Custom integrations'].slice(0, plan.billing.toLowerCase() === 'yearly' ? 4 : 3).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground capitalize">{plan.billing} billing</span>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1">View Details</Button>
                <Button className="flex-1 bg-gradient-primary border-0">Edit Plan</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PlansPage;
