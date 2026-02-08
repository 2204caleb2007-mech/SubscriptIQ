import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import DailySpendChart from '@/components/dashboard/DailySpendChart';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, PageHeader } from '@/components/ui/custom-cards';
import { mockRevenueData, mockActivityLog, mockChurnPredictions } from '@/data/mockData';
import api from '@/lib/api';
import {
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
} from 'lucide-react';

const AdminDashboard = () => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>(mockRevenueData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, growthRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/analytics/subscription-growth')
        ]);
        setUsers(usersRes.data);
        if (growthRes.data && growthRes.data.length > 0) {
          setRevenueData(growthRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: 'Total Revenue',
      value: '$198,700',
      change: '+12.5% from last month',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Active Subscriptions',
      value: '4,380',
      change: '+260 this month',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Overdue Invoices',
      value: '$4,890',
      change: '3 invoices',
      changeType: 'negative' as const,
      icon: FileText,
    },
    {
      title: 'Churn Risk',
      value: '4.2%',
      change: '-0.8% from last month',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
  ];

  const paymentStatusData = [
    { name: 'Paid', value: 75, color: 'hsl(var(--success))' },
    { name: 'Pending', value: 15, color: 'hsl(var(--warning))' },
    { name: 'Overdue', value: 10, color: 'hsl(var(--destructive))' },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of your subscription business"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Daily Revenue</h3>
              <p className="text-sm text-muted-foreground">Real-time daily transaction spikes</p>
            </div>
            <div className="flex items-center gap-4">
              {/* User Filter Dropdown */}
              <select
                className="bg-background border border-input rounded-md text-sm p-1 max-w-[150px] outline-none focus:ring-2 focus:ring-primary"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">All Users</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full bg-primary" />
                Revenue
              </div>
            </div>
          </div>
          <DailySpendChart userId={selectedUser} />
        </motion.div>

        {/* Payment Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <h3 className="font-semibold mb-6">Payment Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={paymentStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {paymentStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subscription Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <h3 className="font-semibold mb-6">Subscription Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <defs>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                }}
                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
              />
              <Bar dataKey="subscriptions" fill="url(#colorSubs)" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-4">
            {mockChurnPredictions.slice(0, 4).map((prediction, index) => (
              <motion.div
                key={prediction.customerId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${prediction.riskLevel === 'low' ? 'bg-success' :
                    prediction.riskLevel === 'medium' ? 'bg-warning' : 'bg-destructive'
                    }`} />
                  <div>
                    <p className="font-medium text-sm">{prediction.company}</p>
                    <p className="text-xs text-muted-foreground">{prediction.recommendation}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${prediction.riskLevel === 'low' ? 'text-success' :
                  prediction.riskLevel === 'medium' ? 'text-warning' : 'text-destructive'
                  }`}>
                  {prediction.riskScore}%
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-6 rounded-xl bg-card border border-border"
      >
        <h3 className="font-semibold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {mockActivityLog.slice(0, 5).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${activity.type === 'payment' ? 'bg-success/10 text-success' :
                activity.type === 'automation' ? 'bg-accent/10 text-accent' :
                  activity.type === 'ai' ? 'bg-primary/10 text-primary' :
                    'bg-muted text-muted-foreground'
                }`}>
                {activity.type === 'payment' ? <CheckCircle className="w-4 h-4" /> :
                  activity.type === 'automation' ? <Clock className="w-4 h-4" /> :
                    activity.type === 'ai' ? <Brain className="w-4 h-4" /> :
                      <AlertTriangle className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.target}</p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.timestamp.split(' ')[1]}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
