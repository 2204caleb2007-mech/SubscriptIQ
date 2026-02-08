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
  Zap,
  Star,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans.map((plan, index) => {
            const isYearly = plan.billing.toLowerCase() === 'yearly';
            const isPro = plan.name.toLowerCase().includes('pro');
            const isEnterprise = plan.name.toLowerCase().includes('enterprise');

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={cn(
                  "relative p-8 rounded-3xl border transition-all duration-300 group",
                  isPro
                    ? "bg-card border-primary/20 shadow-xl shadow-primary/5 glow-primary"
                    : "bg-card/50 border-border hover:border-primary/30"
                )}
              >
                {/* Popular Badge */}
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/25 z-10">
                    Most Popular
                  </div>
                )}

                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {isEnterprise ? <Shield className="w-5 h-5 text-accent" /> : isPro ? <Zap className="w-5 h-5 text-primary" /> : <Star className="w-5 h-5 text-orange-400" />}
                      <h3 className="font-black text-xl tracking-tight">{plan.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{plan.product?.name || 'Standard Offering'}</p>
                  </div>
                  <StatusBadge variant={plan.status.toLowerCase() === 'active' ? 'success' : 'default'} className="rounded-lg px-3 py-1">
                    {plan.status}
                  </StatusBadge>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter">{formatCurrency(plan.price)}</span>
                    <span className="text-muted-foreground font-bold text-sm">/{isYearly ? 'year' : 'month'}</span>
                  </div>
                  {isYearly && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-md bg-success/10 text-success text-xs font-bold"
                    >
                      <Zap className="w-3 h-3 fill-success" />
                      Save 17% overall
                    </motion.div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Everything in {index > 0 ? filteredPlans[index - 1].name : 'Free'} plus:</p>
                  {['Access to all features', '24/7 Priority Support', 'Dedicated API Access', 'Custom White-labeling'].slice(0, isEnterprise ? 4 : isPro ? 3 : 2).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 bg-muted/50 p-3 rounded-xl border border-border/50">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-bold">{(plan._count?.subscriptions || 0).toLocaleString()}</span>
                  <span>Active Subscribers</span>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    className={cn(
                      "w-full h-12 rounded-xl font-black transition-all gap-2",
                      isPro ? "bg-gradient-primary border-0 shadow-lg shadow-primary/20" : "variant-outline"
                    )}
                  >
                    {isPro ? 'Upgrade Now' : 'Choose Plan'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" className="w-full h-10 rounded-xl font-bold text-muted-foreground hover:text-foreground">
                    View Full Details
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PlansPage;
