import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader, StatusBadge } from '@/components/ui/custom-cards';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { mockUsers } from '@/data/mockData';
import { Plus, Shield, User } from 'lucide-react';

const UsersPage = () => {
  const columns = [
    { key: 'name', label: 'User', render: (item: typeof mockUsers[0]) => (
      <div className="flex items-center gap-3">
        <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (item: typeof mockUsers[0]) => (
      <div className="flex items-center gap-2">
        <Shield className={`w-4 h-4 ${item.role === 'admin' ? 'text-primary' : 'text-muted-foreground'}`} />
        <span className="capitalize">{item.role}</span>
      </div>
    )},
    { key: 'lastLogin', label: 'Last Login' },
    { key: 'status', label: 'Status', render: (item: typeof mockUsers[0]) => (
      <StatusBadge variant={item.status === 'active' ? 'success' : 'default'}>{item.status}</StatusBadge>
    )},
  ];

  return (
    <DashboardLayout>
      <PageHeader title="User Management" description="Manage internal users and permissions"
        action={<Button className="bg-gradient-primary border-0"><Plus className="w-4 h-4 mr-2" /> Add User</Button>} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <DataTable data={mockUsers} columns={columns} />
      </motion.div>
    </DashboardLayout>
  );
};

export default UsersPage;
