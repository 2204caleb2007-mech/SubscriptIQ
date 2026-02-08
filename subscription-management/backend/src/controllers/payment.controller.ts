import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const isPlaceholderKey = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

export const getPayments = async (req: AuthRequest, res: Response) => {
    try {
        const where: any = {};

        // Role-based filtering: Customers only see their own payments
        if (req.user?.role === 'CUSTOMER') {
            const customer = await prisma.customer.findUnique({
                where: { email: req.user.email }
            });
            if (customer) {
                where.invoice = { customerId: customer.id };
            } else {
                return res.json([]);
            }
        }

        const payments = await prisma.payment.findMany({
            where,
            include: {
                invoice: {
                    include: {
                        customer: true,
                        subscription: { include: { plan: true } },
                    },
                },
            },
            orderBy: { date: 'desc' },
        });

        res.json(payments);
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
};

export const getPayment = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const payment = await prisma.payment.findUnique({
            where: { id: id as string },
            include: {
                invoice: {
                    include: {
                        customer: true,
                        subscription: { include: { plan: true } },
                    },
                },
            },
        });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Role-based authorization: Customers can only see their own payment
        if (req.user?.role === 'CUSTOMER') {
            const customer = await prisma.customer.findUnique({
                where: { email: req.user.email }
            });
            if (!customer || payment.invoice.customerId !== customer.id) {
                return res.status(403).json({ error: 'Access denied to this payment' });
            }
        }

        res.json(payment);
    } catch (error) {
        console.error('Get payment error:', error);
        res.status(500).json({ error: 'Failed to fetch payment' });
    }
};

export const createPayment = async (req: AuthRequest, res: Response) => {
    try {
        const { invoiceId, amount, method, status, date } = req.body;

        const payment = await prisma.payment.create({
            data: {
                invoiceId,
                amount: parseFloat(amount),
                method,
                status: status || 'completed',
                date: date ? new Date(date) : new Date(),
            },
            include: {
                invoice: {
                    include: {
                        customer: true,
                        subscription: { include: { plan: true } },
                    },
                },
            },
        });

        // Update invoice status to PAID if payment is completed
        if (status === 'completed' || !status) {
            await prisma.invoice.update({
                where: { id: invoiceId },
                data: { status: 'PAID', paidDate: new Date() },
            });
        }

        res.status(201).json(payment);
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { amount, currency = 'INR', receipt, notes } = req.body;

        if (isPlaceholderKey) {
            console.log('Using mock Razorpay order for placeholder keys');
            return res.json({
                id: `order_mock_${Date.now()}`,
                amount: Math.round(amount * 100),
                currency,
                receipt,
                status: 'created',
                is_mock: true,
                key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
            });
        }

        // Forced ₹1 for testing if configured
        const finalAmount = process.env.TEST_PAYMENT_AMOUNT_ONE === 'true' ? 1 : amount;
        if (process.env.TEST_PAYMENT_AMOUNT_ONE === 'true') {
            console.log('TEST MODE: Forcing payment amount to ₹1');
        }

        const options = {
            amount: Math.round(finalAmount * 100), // Razorpay accepts amount in paise
            currency,
            receipt,
            notes,
        };

        const order = await razorpay.orders.create(options);
        res.json({
            ...order,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, userEmail, userName, is_mock, discountCode } = req.body;

        if (!is_mock) {
            const generated_signature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
                .update(razorpay_order_id + '|' + razorpay_payment_id)
                .digest('hex');

            if (generated_signature !== razorpay_signature) {
                return res.status(400).json({ error: 'Invalid signature' });
            }
        }

        // 1. Find or create customer
        // FORCED SECURITY: If logged in, use the authenticated user's email
        const targetEmail = (req.user?.role === 'CUSTOMER') ? req.user.email : (userEmail || 'guest@example.com');
        const targetName = (req.user?.role === 'CUSTOMER') ? req.user.name : (userName || 'Guest');

        let customer = await prisma.customer.findUnique({ where: { email: targetEmail } });
        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    name: targetName,
                    email: targetEmail,
                    status: 'active'
                }
            });
        }
        console.log(`Processing payment for Customer: ${customer.email} (${customer.id})`);

        // 2. Calculate Totals with Tax and Discount
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

        let discountAmount = 0;
        let discountId = null;
        if (discountCode) {
            const discount = await prisma.discount.findUnique({ where: { code: discountCode } });
            if (discount && discount.status === 'active') {
                if (discount.type === 'percentage') {
                    discountAmount = (subtotal * discount.value) / 100;
                } else {
                    discountAmount = discount.value;
                }
                discountId = discount.id;
                // Update usage count
                await prisma.discount.update({
                    where: { id: discount.id },
                    data: { usageCount: { increment: 1 } }
                });
            }
        }

        // Get active taxes
        const activeTaxes = await prisma.tax.findMany({ where: { status: 'active' } });
        const taxRate = activeTaxes.reduce((sum, t) => sum + t.rate, 0);
        const taxAmount = ((subtotal - discountAmount) * taxRate) / 100;

        const totalAmount = subtotal - discountAmount + taxAmount;

        // 3. Create Invoice
        const invoice = await prisma.invoice.create({
            data: {
                customerId: customer.id,
                subscriptionId: 'one-time-purchase',
                amount: totalAmount,
                status: 'paid',
                dueDate: new Date(),
                paidDate: new Date(),
                // Store breakdown in metadata or use dedicated fields if available
                // Note: Prisma schema might need updates for these fields, using amount for now
            }
        });

        // 4. Create Payment Record
        await prisma.payment.create({
            data: {
                invoiceId: invoice.id,
                amount: totalAmount,
                method: 'RAZORPAY',
                status: 'completed',
                date: new Date(),
            }
        });

        // 5. Create Order Record
        const order = await prisma.order.create({
            data: {
                customerId: customer.id,
                totalAmount: totalAmount,
                status: 'PAID',
                paymentMethod: 'RAZORPAY',
                razorpayOrderId: razorpay_order_id,
                invoiceId: invoice.id,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.price * item.quantity
                    }))
                }
            }
        });

        res.json({
            status: 'success',
            orderId: order.id,
            invoiceId: invoice.id,
            breakdown: {
                subtotal,
                discount: discountAmount,
                tax: taxAmount,
                total: totalAmount
            }
        });

    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
};
