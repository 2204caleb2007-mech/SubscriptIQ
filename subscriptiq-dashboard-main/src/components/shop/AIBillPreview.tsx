import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Globe, ShieldCheck, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

interface AIBillPreviewProps {
    orderId: string;
    items: any[];
    amount: number;
    userName: string;
    userEmail: string;
}

export const AIBillPreview: React.FC<AIBillPreviewProps> = ({
    orderId,
    items,
    amount,
    userName,
    userEmail
}) => {
    const billRef = useRef<HTMLDivElement>(null);

    const downloadBill = async () => {
        if (!billRef.current) return;

        const toastId = toast.loading('Generating your AI Bill...');

        try {
            const canvas = await html2canvas(billRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`AI_Bill_${orderId.split('_').pop()}.pdf`);

            toast.success('AI Bill downloaded successfully!', { id: toastId });
        } catch (error) {
            console.error('Failed to generate PDF', error);
            toast.error('Failed to generate bill. Please try again.', { id: toastId });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    AI-Generated Bill Preview
                </h4>
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-[10px] gap-2 border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={downloadBill}
                >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                </Button>
            </div>

            {/* The actual Invoice to be captured */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl shadow-blue-500/5">
                <div ref={billRef}>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Zap className="w-6 h-6 text-blue-600 fill-blue-600" />
                                <h2 className="text-xl font-black tracking-tighter">SUBSCRIPTIQ <span className="text-blue-600">AI</span></h2>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Futuristic Billing System</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-slate-200 dark:text-slate-800 select-none">#INVOICE</p>
                            <p className="text-xs font-mono text-slate-500">{new Date().toISOString().split('T')[0]}</p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Billed To</p>
                            <p className="font-bold text-sm text-slate-900 dark:text-white uppercase">{userName}</p>
                            <p className="text-xs text-slate-500">{userEmail}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Order ID</p>
                            <p className="font-mono text-xs text-slate-900 dark:text-white">{orderId}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="border-t border-b border-slate-100 dark:border-slate-800 py-4 mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] font-bold text-slate-400 uppercase">
                                    <th className="text-left pb-4">Product Description</th>
                                    <th className="text-center pb-4">Qty</th>
                                    <th className="text-right pb-4">Price</th>
                                    <th className="text-right pb-4">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium">
                                {items.map((item, i) => (
                                    <tr key={i} className="border-t border-slate-50 dark:border-slate-800/50">
                                        <td className="py-4 text-slate-900 dark:text-white">{item.name}</td>
                                        <td className="py-4 text-center text-slate-500">{item.quantity}</td>
                                        <td className="py-4 text-right text-slate-500">{formatCurrency(item.price)}</td>
                                        <td className="py-4 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded-full w-fit">
                                <ShieldCheck className="w-3 h-3" />
                                AI VERIFIED SECURE
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-blue-500 font-bold bg-blue-500/10 px-2 py-1 rounded-full w-fit">
                                <Globe className="w-3 h-3" />
                                GLOBAL SUBSCRIPTION NODE
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Payable Amount</p>
                            <p className="text-4xl font-black text-blue-600 tracking-tighter">{formatCurrency(amount)}</p>
                        </div>
                    </div>
                </div>

                {/* Decorative background elements for that 'AI' feel */}
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />
            </div>
        </div>
    );
};
