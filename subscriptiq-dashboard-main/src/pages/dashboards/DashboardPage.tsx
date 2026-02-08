import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import InternalDashboard from './InternalDashboard';
import CustomerDashboard from './CustomerDashboard';

const DashboardPage = () => {
  const { user } = useAuth();

  switch (user?.role) {
<<<<<<< HEAD
    case 'ADMIN':
      return <AdminDashboard />;
    case 'INTERNAL':
      return <InternalDashboard />;
    case 'CUSTOMER':
=======
    case 'admin':
      return <AdminDashboard />;
    case 'internal':
      return <InternalDashboard />;
    case 'customer':
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
      return <CustomerDashboard />;
    default:
      return <AdminDashboard />;
  }
};

export default DashboardPage;
