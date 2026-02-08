import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/custom-cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Lock, Bell, Palette, Save } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({ email: true, push: false, billing: true });

  return (
    <DashboardLayout>
      <PageHeader title="Settings" description="Manage your account preferences" />

      <div className="max-w-2xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Profile</h3>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name</Label><Input defaultValue={user?.name} /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue={user?.email} disabled /></div>
            </div>
            <div className="space-y-2"><Label>Company</Label><Input defaultValue={user?.company} /></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Appearance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Dark Mode</p><p className="text-sm text-muted-foreground">Toggle dark/light theme</p></div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
              { key: 'billing', label: 'Billing Alerts', desc: 'Invoice and payment notifications' },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between">
                <div><p className="font-medium">{n.label}</p><p className="text-sm text-muted-foreground">{n.desc}</p></div>
                <Switch checked={notifications[n.key as keyof typeof notifications]}
                  onCheckedChange={(v) => setNotifications(p => ({ ...p, [n.key]: v }))} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Change Password</h3>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2"><Label>Current Password</Label><Input type="password" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>New Password</Label><Input type="password" /></div>
              <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" /></div>
            </div>
          </div>
        </motion.div>

        <Button className="bg-gradient-primary border-0"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
