import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import InternalDashboard from './InternalDashboard';
import CustomerDashboard from './CustomerDashboard';

const DashboardPage = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'INTERNAL':
      return <InternalDashboard />;
    case 'CUSTOMER':
      return <CustomerDashboard />;
    default:
      return <AdminDashboard />;
  }
};

export default DashboardPage;
