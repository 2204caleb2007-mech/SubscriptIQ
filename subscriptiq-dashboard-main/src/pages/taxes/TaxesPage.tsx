import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader, StatusBadge } from '@/components/ui/custom-cards';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { ColorBends } from '@/components/ui/ColorBends';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Plus, Calculator, Globe, Edit, Trash2, Library, BookOpen, ShieldCheck, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const TaxesPage = () => {
  const [taxes, setTaxes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      const { data } = await api.get('/taxes');
      setTaxes(data);
    } catch (error) {
      console.error('Failed to fetch taxes:', error);
      toast.error('Failed to load taxes');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'Tax ID' },
    {
      key: 'name', label: 'Name', render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.appliesTo}</p>
          </div>
        </div>
      )
    },
    {
      key: 'rate', label: 'Rate', render: (item: any) => (
        <span className="font-medium">{item.rate}%</span>
      )
    },
    {
      key: 'region', label: 'Region', render: (item: any) => (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          {item.region}
        </div>
      )
    },
    {
      key: 'status', label: 'Status', render: (item: any) => (
        <StatusBadge variant={item.status === 'active' ? 'success' : 'default'}>
          {item.status}
        </StatusBadge>
      )
    },
    {
      key: 'actions', label: '', render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Tax Management"
        description="Configure tax rates for different regions"
        action={
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 border-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Tax Rate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Tax Rate</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Tax Name</Label>
                  <Input placeholder="e.g., Standard VAT" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input type="number" placeholder="20" />
                  </div>
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Input placeholder="e.g., United Kingdom" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Applies To</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3">
                    <option value="all">All Products</option>
                    <option value="services">Services Only</option>
                    <option value="physical">Physical Products Only</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button className="bg-gradient-primary border-0" onClick={() => setShowCreateModal(false)}>Add Tax Rate</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-info/10 border border-info/30 mb-8"
      >
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-info mt-0.5" />
          <div>
            <p className="font-medium text-info">Automatic Tax Calculation</p>
            <p className="text-sm text-muted-foreground">
              Taxes are automatically applied based on customer location and product type.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable data={taxes} columns={columns} />
        )}
      </motion.div>

      {/* Tax Knowledge Base - New Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <div className="flex items-center gap-2 mb-6">
          <Library className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Tax Knowledge Base & Regional Laws</h2>
        </div>
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1080px] h-[1080px] opacity-40">
            <ColorBends
              rotation={45}
              speed={0.2}
              colors={["#5227FF", "#FF9FFC", "#7cff67", "#ffffff"]}
              transparent
              autoRotate={0}
              scale={1}
              frequency={1}
              warpStrength={1}
              mouseInfluence={1}
              parallax={0.5}
              noise={0.1}
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[128px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-[128px] animate-pulse-soft delay-500" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-bold mb-2">India: GST & SGST</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive Goods and Services Tax system. Dual GST model with CGST and SGST/UTGST applied concurrently.
              IGST applies for inter-state transactions.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-muted rounded text-[10px] font-bold">CGST</span>
              <span className="px-2 py-1 bg-muted rounded text-[10px] font-bold">SGST</span>
              <span className="px-2 py-1 bg-muted rounded text-[10px] font-bold">IGST</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-bold mb-2">European Union: VAT</h3>
            <p className="text-sm text-muted-foreground mb-4">
              VAT rules vary by member state but follow the EU VAT Directive. One-Stop Shop (OSS) available for digital services across borders.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-muted rounded text-[10px] font-bold">OSS Compliance</span>
              <span className="px-2 py-1 bg-muted rounded text-[10px] font-bold">MOSS</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-bold mb-2">USA: Sales Tax</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Jurisdiction-based tax where "Nexus" determines applicability. Varies significantly by state, county, and city levels.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-muted rounded text-[10px] font-bold">Economic Nexus</span>
              <span className="px-2 py-1 bg-muted rounded text-[10px] font-bold">SST</span>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
          <div className="flex items-center gap-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-bold">AI Compliance Engine Enabled</h4>
              <p className="text-sm text-muted-foreground">
                Our AI automatically stays updated with over 150+ country tax laws, ensuring your invoices are always compliant with local regulations.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default TaxesPage;
