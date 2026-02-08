import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import InternalDashboard from './InternalDashboard';
import CustomerDashboard from './CustomerDashboard';

const DashboardPage = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'internal':
      return <InternalDashboard />;
    case 'customer':
      return <CustomerDashboard />;
    default:
      return <AdminDashboard />;
  }
};

export default DashboardPage;
