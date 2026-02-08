import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  Calendar,
  CreditCard,
  FileText,
  Receipt,
  Percent,
  Calculator,
  BarChart3,
  Brain,
  MessageSquare,
  Zap,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  roles: UserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'INTERNAL', 'CUSTOMER'] },
  { title: 'Products', icon: Package, path: '/products', roles: ['ADMIN', 'INTERNAL'] },
  { title: 'Plans', icon: Calendar, path: '/plans', roles: ['ADMIN', 'INTERNAL'] },
  { title: 'Subscriptions', icon: CreditCard, path: '/subscriptions', roles: ['ADMIN', 'INTERNAL', 'CUSTOMER'] },
  { title: 'Invoices', icon: FileText, path: '/invoices', roles: ['ADMIN', 'INTERNAL', 'CUSTOMER'] },
  { title: 'Payments', icon: Receipt, path: '/payments', roles: ['ADMIN', 'INTERNAL', 'CUSTOMER'] },
  { title: 'Discounts', icon: Percent, path: '/discounts', roles: ['ADMIN'] },
  { title: 'Taxes', icon: Calculator, path: '/taxes', roles: ['ADMIN'] },
  { title: 'Reports', icon: BarChart3, path: '/reports', roles: ['ADMIN', 'INTERNAL'] },
  { title: 'AI Insights', icon: Brain, path: '/ai-insights', roles: ['ADMIN', 'INTERNAL'], badge: 'AI' },
  { title: 'AI Assistant', icon: MessageSquare, path: '/ai-chat', roles: ['ADMIN', 'INTERNAL', 'CUSTOMER'], badge: 'AI' },
  { title: 'Automation', icon: Zap, path: '/automation', roles: ['ADMIN', 'INTERNAL'] },
  { title: 'Users', icon: Users, path: '/users', roles: ['ADMIN'] },
  { title: 'Settings', icon: Settings, path: '/settings', roles: ['ADMIN', 'INTERNAL', 'CUSTOMER'] },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleInvoiceGenerated = () => {
      setShowNotification(true);
    };
    window.addEventListener('invoice-generated', handleInvoiceGenerated);
    return () => window.removeEventListener('invoice-generated', handleInvoiceGenerated);
  }, []);

  useEffect(() => {
    if (location.pathname === '/ai-chat') {
      setShowNotification(false);
    }
  }, [location.pathname]);

  const filteredNavItems = navItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 90 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        "fixed left-4 top-4 h-[calc(100vh-2rem)] rounded-3xl flex flex-col z-40 shadow-2xl transition-all duration-300",
        "bg-[#111c44] text-white border-none" // Hardcoded dark theme matching reference (Navy Blue/Black)
      )}
    >
      {/* Logo */}
      <div className="h-24 flex items-center px-6">
        <Link to="/dashboard" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg hover:shadow-indigo-500/25 transition-shadow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-bold text-xl tracking-tight">SubScriptIQ</span>
                <span className="text-xs text-blue-200/60 font-medium tracking-wide">AI-Powered ERP</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-4 custom-scrollbar">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className={cn('w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-blue-100/70 group-hover:text-white')} />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 whitespace-nowrap font-medium text-sm"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Active Indicator Glower */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}

                  {item.badge && !isCollapsed && (
                    <span className="relative">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                        {item.badge}
                      </span>
                      {item.title === 'AI Assistant' && showNotification && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#111c44] animate-pulse" />
                      )}
                    </span>
                  )}

                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#111c44] text-white text-sm font-medium rounded-xl shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.title}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 mt-auto">
        <div className={cn(
          "rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/5 backdrop-blur-sm p-3 transition-all duration-300",
          isCollapsed ? "justify-center" : ""
        )}>


          {user && (
            <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
              <div className="relative">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full ring-2 ring-white/10 shadow-md"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#111c44] rounded-full"></div>
              </div>

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-blue-200/60 capitalize truncate">{user.role}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isCollapsed && (
                <button
                  onClick={logout}
                  className="p-2 hover:bg-white/10 text-blue-200/60 hover:text-red-400 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 w-8 h-8 bg-[#111c44] border border-white/10 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4 text-blue-200 group-hover:text-white" /> : <ChevronLeft className="w-4 h-4 text-blue-200 group-hover:text-white" />}
      </button>
    </motion.aside>
  );
};
