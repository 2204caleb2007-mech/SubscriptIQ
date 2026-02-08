
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from '@/components/ui/sheet';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';
import { PaymentSimulator } from './PaymentSimulator';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function CartDrawer() {
    const { items, removeItem, updateQuantity, total, itemCount, isOpen, setIsOpen, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showSimulator, setShowSimulator] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<any>(null);

    const handleCheckout = async () => {
        if (!user) {
            toast.error('Please login to checkout');
            navigate('/login');
            setIsOpen(false);
            return;
        }

        try {
            const orderData = {
                amount: total,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                notes: {
                    items: items.map(i => i.name).join(', ')
                }
            };

            const { data: order } = await api.post('/payments/create-order', orderData);

            if (order.is_mock) {
                console.log('Mock order detected, showing Simulator');
                setCurrentOrder(order);
                setShowSimulator(true);
                return;
            }

            const options = {
                key: order.key_id || 'rzp_test_placeholder',
                amount: order.amount,
                currency: order.currency,
                name: 'SubscriptIQ',
                description: 'E-commerce Purchase',
                image: 'https://lovable.dev/opengraph-image-p98pqg.png', // Placeholder image
                order_id: order.id,
                handler: async (response: any) => {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            items: items,
                            userEmail: user.email,
                            userName: user.name
                        };

                        await api.post('/payments/verify', verifyData);

                        toast.success('Payment successful!');
                        clearCart();
                        setIsOpen(false);
                        navigate('/invoices'); // Redirect to invoices to see the result
                    } catch (error) {
                        console.error('Verification failed', error);
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#3b82f6',
                },
            };

            if (window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                toast.error('Razorpay SDK failed to load. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error', error);
            toast.error('Failed to initiate checkout');
        }
    };

    const handleSimulatorSuccess = async (verifyData: any) => {
        try {
            const fullVerifyData = {
                ...verifyData,
                items: items,
                userEmail: user?.email,
                userName: user?.name
            };

            await api.post('/payments/verify', fullVerifyData);

            toast.success('Payment successful!');
            clearCart();
            setShowSimulator(false);
            setIsOpen(false);
            navigate('/invoices');
        } catch (error) {
            console.error('Simulator verification failed', error);
            toast.error('Payment verification failed');
        }
    };

    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent className="w-full sm:max-w-md flex flex-col">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Shopping Cart ({itemCount})
                        </SheetTitle>
                    </SheetHeader>

                    <ScrollArea className="flex-1 -mx-6 px-6 my-4">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                                <ShoppingCart className="w-16 h-16 text-gray-200" />
                                <div className="space-y-1">
                                    <p className="text-xl font-semibold text-gray-900">Your cart is empty</p>
                                    <p className="text-sm text-gray-500">Looks like you haven't added anything yet.</p>
                                </div>
                                <Button variant="outline" onClick={() => setIsOpen(false)}>
                                    Continue Shopping
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-20 w-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/80'}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                                                    {item.name}
                                                </h4>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-2 border rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-gray-100 rounded-md disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-gray-100 rounded-md"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-sm">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-xs text-gray-500">
                                                            {formatCurrency(item.price)} each
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    {items.length > 0 && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium">{formatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tax</span>
                                    <span className="font-medium">Calculated at checkout</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-base font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                            <Button className="w-full h-12 text-lg bg-gray-900 hover:bg-gray-800" onClick={handleCheckout}>
                                Checkout
                            </Button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <PaymentSimulator
                isOpen={showSimulator}
                onClose={() => setShowSimulator(false)}
                amount={total}
                orderId={currentOrder?.id || ''}
                userName={user?.name || ''}
                userEmail={user?.email || ''}
                items={items}
                onSuccess={handleSimulatorSuccess}
            />
        </>
    );
}
