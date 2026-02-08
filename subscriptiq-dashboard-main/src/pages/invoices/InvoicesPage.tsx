import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader, StatusBadge } from '@/components/ui/custom-cards';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2, Search, Filter, Download, Eye, Printer, Brain, Sparkles, Zap, ShieldCheck, Globe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [showAiExplanation, setShowAiExplanation] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data } = await api.get('/invoices');
      setInvoices(data);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async (invoice: any) => {
    const toastId = toast.loading(`Generating PDF for ${invoice.id}...`);
    try {
      // Temporarily select the invoice so it renders in the hidden template
      setSelectedInvoice(invoice);

      // Wait for React to render the modal content
      await new Promise(r => setTimeout(r, 500));

      const element = document.getElementById('printable-invoice');
      if (!element) throw new Error('Invoice template not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoice.id}.pdf`);

      toast.success('Invoice downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to download PDF', { id: toastId });
    }
  };

  const filteredInvoices = invoices.filter(i =>
    (i.customer?.name || i.customer?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      case 'void': return 'default';
      default: return 'default';
    }
  };

  const columns = [
    { key: 'id', label: 'Invoice #' },
    { key: 'customer', label: 'Customer', render: (item: any) => item.customer?.name || item.customer?.email },
    {
      key: 'amount', label: 'Amount', render: (item: any) => (
        <span className="font-medium">{formatCurrency(item.amount)}</span>
      )
    },
    { key: 'dueDate', label: 'Due Date', render: (item: any) => new Date(item.dueDate).toLocaleDateString() },
    { key: 'paidDate', label: 'Paid Date', render: (item: any) => item.paidDate ? new Date(item.paidDate).toLocaleDateString() : '-' },
    {
      key: 'status', label: 'Status', render: (item: any) => (
        <StatusBadge variant={getStatusVariant(item.status)}>
          {item.status}
        </StatusBadge>
      )
    },
    {
      key: 'actions', label: '', render: (item: any) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedInvoice(item); }}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); downloadPDF(item); }}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  const aiExplanation = selectedInvoice ? `
This invoice (${selectedInvoice.id}) was generated for ${selectedInvoice.customer?.name || 'the customer'}'s purchase. 

**Breakdown:**
- Subtotal: ${formatCurrency(selectedInvoice.amount * 0.85)}
- Platform Fee: ${formatCurrency(selectedInvoice.amount * 0.05)}
- Taxes: ${formatCurrency(selectedInvoice.amount * 0.10)}

**Status Analysis:**
${selectedInvoice.status.toLowerCase() === 'paid'
      ? `Payment was verified successfully. This transaction is fully settled.`
      : selectedInvoice.status.toLowerCase() === 'overdue'
        ? `This invoice is overdue. AI recommends immediate follow-up.`
        : `This invoice is pending. AI expects payment within current billing cycle.`
    }

**Recommendation:**
Enhance customer loyalty by offering a "Fast-Track" referral code for their next purchase.
  ` : '';

  return (
    <DashboardLayout>
      <PageHeader
        title="Invoices"
        description="Manage and track all invoices"
        action={
          <Button variant="outline" onClick={() => toast.info('Exporting all data...')}>
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Outstanding', value: formatCurrency(invoices.filter(i => i.status.toLowerCase() !== 'paid').reduce((s, i) => s + i.amount, 0)), color: 'text-warning' },
          { label: 'Paid Overall', value: formatCurrency(invoices.filter(i => i.status.toLowerCase() === 'paid').reduce((s, i) => s + i.amount, 0)), color: 'text-success' },
          { label: 'Overdue', value: invoices.filter(i => i.status.toLowerCase() === 'overdue').length.toString(), color: 'text-destructive' },
          { label: 'Total Invoices', value: invoices.length.toString(), color: 'text-primary' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

<<<<<<< HEAD
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices by ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 ring-offset-background focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-10 border-border/50 hover:border-primary/50 bg-background/50 hover:bg-background transition-all shadow-sm">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            Filters
          </Button>
        </div>
      </div>
=======
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 mb-6"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </motion.div>
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            data={filteredInvoices}
            columns={columns}
            onRowClick={(item) => setSelectedInvoice(item)}
          />
        )}
      </motion.div>

      {/* Invoice Detail Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => { if (!open) setSelectedInvoice(null); setShowAiExplanation(false); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl">{selectedInvoice.id}</DialogTitle>
                  <StatusBadge variant={getStatusVariant(selectedInvoice.status)}>
                    {selectedInvoice.status}
                  </StatusBadge>
                </div>
              </DialogHeader>

              {/* Printable Invoice Container */}
              <div id="printable-invoice" className="mt-6 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative overflow-hidden">
                {/* AI Watermark for PDF */}
                <div className="absolute top-0 right-0 opacity-[0.03] rotate-12 -mr-10 -mt-10 select-none pointer-events-none">
                  <Zap className="w-64 h-64 text-blue-600" />
                </div>

                <div className="flex justify-between items-start mb-12 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-8 h-8 text-blue-600 fill-blue-600" />
                      <span className="font-black text-2xl tracking-tighter">SUBSCRIPTIQ <span className="text-blue-600">AI</span></span>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Smart Billing Intelligence</p>
                    <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                      123 Innovation Way<br />
                      Tech District, CA 94103
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-slate-100 dark:text-slate-800 absolute -top-4 -right-2 select-none">#BILL</p>
                    <div className="mt-10">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedInvoice.id}</p>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">ISSUED ON</p>
                      <p className="text-sm font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12 relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">BILL TO</p>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">{selectedInvoice.customer?.name || 'Valued Customer'}</p>
                    <p className="text-sm text-slate-500">{selectedInvoice.customer?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">PAYMENT STATUS</p>
                    <p className={cn(
                      "font-black text-lg uppercase tracking-tight",
                      selectedInvoice.status.toLowerCase() === 'paid' ? "text-emerald-500" : "text-amber-500"
                    )}>
                      {selectedInvoice.status}
                    </p>
                    {selectedInvoice.paidDate && (
                      <p className="text-xs text-slate-500 mt-1">COMPLETED ON {new Date(selectedInvoice.paidDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                <div className="relative z-10">
                  <table className="w-full mb-8">
                    <thead>
                      <tr className="border-b-2 border-slate-900/10 dark:border-white/10">
                        <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">DESCRIPTION</th>
                        <th className="text-right py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                      <tr className="border-b border-slate-50 dark:border-slate-800/50">
                        <td className="py-5 text-slate-900 dark:text-white">Smart Subscription Services (Monthly Cluster)</td>
                        <td className="text-right py-5">{formatCurrency(selectedInvoice.amount * 0.85)}</td>
                      </tr>
                      <tr className="border-b border-slate-50 dark:border-slate-800/50">
                        <td className="py-5 text-slate-500">Global Processing Fee</td>
                        <td className="text-right py-5">{formatCurrency(selectedInvoice.amount * 0.05)}</td>
                      </tr>
                      <tr className="border-b border-slate-50 dark:border-slate-800/50">
                        <td className="py-5 text-slate-500">Automated Tax Accrual (GST/VAT)</td>
                        <td className="text-right py-5">{formatCurrency(selectedInvoice.amount * 0.10)}</td>
                      </tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/30">
                        <td className="py-6 px-4 font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">Total Amount</td>
                        <td className="text-right py-6 px-4 font-black text-2xl text-blue-600 tabular-nums">
                          {formatCurrency(selectedInvoice.amount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-8 relative z-10">
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                      <ShieldCheck className="w-3 h-3" />
                      SECURE
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                      <Globe className="w-3 h-3" />
                      VERIFIED
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">THANKS FOR YOUR LOYALTY</p>
                </div>
              </div>

              {/* AI Explanation Toggle */}
              <Button
                variant="outline"
                className="w-full mt-6 h-12 border-blue-500/20 hover:bg-blue-50 dark:hover:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-bold rounded-xl gap-2"
                onClick={() => setShowAiExplanation(!showAiExplanation)}
              >
                <Brain className="w-5 h-5" />
                {showAiExplanation ? 'Hide' : 'Unlock'} AI Billing Insights
              </Button>

              {showAiExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 shadow-inner"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-600 text-white">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-sm uppercase tracking-widest text-blue-600 dark:text-blue-400">AI SMART ANALYSIS</h4>
                  </div>
                  <div className="space-y-4">
                    {aiExplanation.split('\n').filter(l => l.trim()).map((line, i) => (
                      <p key={i} className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {line.startsWith('**') ? (
                          <strong className="text-blue-600 dark:text-blue-400 uppercase tracking-tighter">{line.replace(/\*\*/g, '')}</strong>
                        ) : line.startsWith('-') ? (
                          <span className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                            {line.substring(1)}
                          </span>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end gap-3 mt-8">
                <Button variant="outline" className="h-12 px-8 rounded-xl font-bold" onClick={() => { setSelectedInvoice(null); setShowAiExplanation(false); }}>
                  Close
                </Button>
                <Button variant="outline" className="h-12 px-6 rounded-xl font-bold gap-2" onClick={() => window.print()}>
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button
                  className="h-12 px-8 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 gap-2"
                  onClick={() => downloadPDF(selectedInvoice)}
                >
                  <Download className="w-4 h-4" />
                  DOWNLOAD AI BILL
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default InvoicesPage;
