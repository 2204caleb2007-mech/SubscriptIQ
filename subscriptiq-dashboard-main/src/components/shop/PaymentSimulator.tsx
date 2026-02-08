import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Smartphone,
    CreditCard,
    Building2,
    QrCode,
    CheckCircle2,
    Loader2,
    ChevronRight,
    ArrowRight,
    Search,
    Filter,
    Download,
    Eye,
    Printer,
    Brain,
    Sparkles,
    Zap,
    ShieldCheck,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, cn } from '@/lib/utils';
import { AIChatSuccess } from './AIChatSuccess';
import { AIBillPreview } from './AIBillPreview';
import { toast } from 'sonner';

interface PaymentSimulatorProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    orderId: string;
    onSuccess: (data: any) => void;
    userName: string;
    userEmail: string;
    items: any[];
}

export const PaymentSimulator: React.FC<PaymentSimulatorProps> = ({
    isOpen,
    onClose,
    amount,
    orderId,
    onSuccess,
    userName,
    userEmail,
    items
}) => {
    const [step, setStep] = useState<'methods' | 'processing' | 'success'>('methods');
    const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

    useEffect(() => {
        if (!isOpen) {
            setStep('methods');
        }
    }, [isOpen]);

    const handlePay = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
        }, 2000);
    };

    const handleFinalize = () => {
        onSuccess({
            razorpay_order_id: orderId,
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_signature: 'simulated_signature',
            is_mock: true
        });

        // Trigger notification event for Sidebar
        window.dispatchEvent(new CustomEvent('invoice-generated'));
        toast.success("Payment successful! Your invoice is ready.", {
            description: "You can find your bill in the Invoices section or AI Chat.",
            duration: 5000,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={cn(
                    "bg-white dark:bg-slate-900 w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-500",
                    step === 'success' ? 'max-w-[800px]' : 'max-w-[400px]'
                )}
            >
                {/* Header */}
                <div className="bg-[#2a3042] p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-1.5 rounded-lg">
                            <ShieldCheck className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-white/60 font-medium uppercase tracking-widest">RAZORPAY SECURE</p>
                            <h3 className="text-sm font-bold tracking-tight">SubscriptIQ Payment Gateway</h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-0 relative min-h-[440px]">
                    <AnimatePresence mode="wait">
                        {step === 'methods' && (
                            <motion.div
                                key="methods"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-6 space-y-6"
                            >
                                {/* Amount Header */}
                                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div>
                                        <h4 className="text-2xl font-bold dark:text-white">{formatCurrency(amount)}</h4>
                                        <p className="text-xs text-slate-500">{userEmail}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ORDER ID</p>
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{orderId.split('_').pop()}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">PREFERRED PAYMENT METHODS</p>

                                    <button
                                        onClick={() => setMethod('upi')}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                                            method === 'upi'
                                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-sm'
                                                : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-lg", method === 'upi' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500')}>
                                                <QrCode className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-sm dark:text-white">UPI QR / GPay</p>
                                                <p className="text-xs text-slate-500">Scan QR using any UPI app</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </button>

                                    <button
                                        onClick={() => setMethod('card')}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                                            method === 'card'
                                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-sm'
                                                : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-lg", method === 'card' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500')}>
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-sm dark:text-white">Card</p>
                                                <p className="text-xs text-slate-500">Visa, Mastercard, RuPay, Maestro</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </button>

                                    <button
                                        onClick={() => setMethod('netbanking')}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                                            method === 'netbanking'
                                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-sm'
                                                : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-lg", method === 'netbanking' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500')}>
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-sm dark:text-white">Netbanking</p>
                                                <p className="text-xs text-slate-500">All major Indian banks supported</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </button>
                                </div>

                                {method === 'upi' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center gap-4 border border-dashed border-slate-200 dark:border-slate-700"
                                    >
                                        <div className="bg-white p-3 rounded-xl shadow-sm">
                                            <img
                                                src="/gpay_qr.jpg"
                                                alt="Payment QR"
                                                className="w-48 h-auto"
                                            />
                                        </div>
                                        <p className="text-[10px] text-center text-slate-500 font-medium px-4">
                                            UPI ID: ashishmullasserymenon05@okaxis
                                        </p>
                                    </motion.div>
                                )}

                                <div className="pt-2">
                                    <Button
                                        onClick={handlePay}
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30"
                                    >
                                        Pay {formatCurrency(amount)}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'processing' && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center p-12 min-h-[440px] text-center"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative" />
                                </div>
                                <h3 className="text-xl font-bold mt-8 dark:text-white">Processing Payment</h3>
                                <p className="text-slate-500 mt-2">Completing your transaction securely...</p>
                                <div className="mt-8 flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 min-h-[440px]"
                            >
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Left: AI Chat */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-green-500/10 p-3 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold dark:text-white">Payment Successful!</h3>
                                                <p className="text-xs text-slate-500">Transaction ID: {`pay_sim_${Date.now()}`.split('_').pop()}</p>
                                            </div>
                                        </div>

                                        <AIChatSuccess items={items} userName={userName} />

                                        <div className="pt-4 flex gap-3">
                                            <Button
                                                className="flex-1 h-12 bg-[#2a3042] hover:bg-[#1a2032] text-white font-bold rounded-xl"
                                                onClick={handleFinalize}
                                            >
                                                Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Right: AI Bill */}
                                    <div className="w-full md:w-[320px] shrink-0">
                                        <AIBillPreview
                                            orderId={orderId}
                                            amount={amount}
                                            items={items}
                                            userName={userName}
                                            userEmail={userEmail}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-center items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none pt-0.5">SECURED BY RAZORPAY SSL</span>
                </div>
            </motion.div>
        </div>
    );
};
