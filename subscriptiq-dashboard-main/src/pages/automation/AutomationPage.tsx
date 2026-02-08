import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader, StatusBadge } from '@/components/ui/custom-cards';
import api from '@/lib/api';
import { Zap, FileText, Mail, RefreshCw, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AutomationPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get('/automation/logs');
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch automation logs:', error);
      toast.error('Failed to load automation history');
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (workflow: string) => {
    switch (workflow) {
      case 'Invoice Generation': return FileText;
      case 'Payment Reminder': return Mail;
      case 'Subscription Renewal': return RefreshCw;
      default: return Zap;
    }
  };

  // Split logs for the two sections: first 4 for timeline, the rest for recent jobs
  const timelineLogs = logs.slice(0, 4);
  const recentJobs = logs.slice(0, 5);

  return (
    <DashboardLayout>
      <PageHeader title="Automation" description="View automated workflows and RPA processes" />

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-card border border-border">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" /> Automation Timeline
            </h3>
            <div className="space-y-6">
              {timelineLogs.map((log, i) => {
                const Icon = getIcon(log.workflow);
                return (
                  <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }} className="timeline-item">
                    <div className={`timeline-dot ${log.status === 'running' ? 'animate-pulse bg-primary' : (log.status === 'failed' ? 'bg-destructive' : 'bg-success')}`}>
                      {log.status === 'running' ? <Clock className="w-3 h-3 text-white" /> : <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <p className="font-medium">{log.action}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.target}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.triggeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-card border border-border">
            <h3 className="font-semibold mb-6">Recent Jobs</h3>
            <div className="space-y-3">
              {recentJobs.map((log, i) => (
                <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{log.workflow}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.triggeredAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge variant={log.status === 'running' ? 'info' : (log.status === 'failed' ? 'danger' : 'success')}>
                      {log.status === 'running' ? 'Running' : (log.records > 0 ? `${log.records} records` : 'Completed')}
                    </StatusBadge>
                    {log.duration && (
                      <p className="text-[10px] text-muted-foreground mt-1">Duration: {log.duration}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AutomationPage;
