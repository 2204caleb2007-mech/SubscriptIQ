import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader, StatusBadge } from '@/components/ui/custom-cards';
import { mockChurnPredictions } from '@/data/mockData';
import { Brain, TrendingUp, Users, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

const AIInsightsPage = () => {
  return (
    <DashboardLayout>
      <PageHeader title="AI Insights" description="AI-powered analytics and predictions" />

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Churn Prediction', value: '4.2%', change: '-0.8%', icon: Users, color: 'success' },
          { title: 'Revenue Forecast', value: '+23%', change: 'Next Quarter', icon: TrendingUp, color: 'primary' },
          { title: 'Customer LTV', value: '$2,450', change: 'Avg.', icon: Sparkles, color: 'accent' },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl bg-card border border-border ai-glow">
            <card.icon className={`w-8 h-8 text-${card.color} mb-4`} />
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.title}</p>
            <p className={`text-sm mt-2 text-${card.color}`}>{card.change}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Churn Risk Analysis</h3>
        </div>
        <div className="space-y-4">
          {mockChurnPredictions.map((p, i) => (
            <motion.div key={p.customerId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }} className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${p.riskLevel === 'low' ? 'bg-success' : p.riskLevel === 'medium' ? 'bg-warning' : 'bg-destructive'}`} />
                <div>
                  <p className="font-medium">{p.company}</p>
                  <p className="text-sm text-muted-foreground">{p.recommendation}</p>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge variant={p.riskLevel === 'low' ? 'success' : p.riskLevel === 'medium' ? 'warning' : 'danger'}>
                  {p.riskScore}% Risk
                </StatusBadge>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AIInsightsPage;
