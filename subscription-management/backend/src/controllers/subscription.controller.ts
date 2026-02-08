import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';

export const getSubscriptions = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.query;

        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }

        // Role-based filtering: Customers only see their own subscriptions
        if (req.user?.role === 'CUSTOMER') {
            const customer = await prisma.customer.findUnique({
                where: { email: req.user.email }
            });
            if (customer) {
                where.customerId = customer.id;
            } else {
                return res.json([]);
            }
        }

        const subscriptions = await prisma.subscription.findMany({
            where,
            include: {
                customer: true,
                plan: { include: { product: true } },
                invoices: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(subscriptions);
    } catch (error) {
        console.error('Get subscriptions error:', error);
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
};

export const getSubscription = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const subscription = await prisma.subscription.findUnique({
            where: { id: id as string },
            include: {
                customer: true,
                plan: { include: { product: true } },
                invoices: true,
            },
        });

        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        // Role-based authorization: Customers can only see their own subscription
        if (req.user?.role === 'CUSTOMER') {
            const customer = await prisma.customer.findUnique({
                where: { email: req.user.email }
            });
            if (!customer || subscription.customerId !== customer.id) {
                return res.status(403).json({ error: 'Access denied to this subscription' });
            }
        }

        res.json(subscription);
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ error: 'Failed to fetch subscription' });
    }
};

export const createSubscription = async (req: AuthRequest, res: Response) => {
    try {
        const { customerId, planId, status, startDate, nextBilling, mrr } = req.body;

        const subscription = await prisma.subscription.create({
            data: {
                customerId,
                planId,
                status: status || 'DRAFT',
                startDate: startDate ? new Date(startDate) : null,
                nextBilling: nextBilling ? new Date(nextBilling) : null,
                mrr: parseFloat(mrr),
            },
            include: {
                customer: true,
                plan: { include: { product: true } },
            },
        });

        res.status(201).json(subscription);
    } catch (error) {
        console.error('Create subscription error:', error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
};

export const updateSubscription = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, startDate, nextBilling, mrr } = req.body;

        const subscription = await prisma.subscription.update({
            where: { id: id as string },
            data: {
                ...(status && { status }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(nextBilling && { nextBilling: new Date(nextBilling) }),
                ...(mrr !== undefined && { mrr: parseFloat(mrr) }),
            },
            include: {
                customer: true,
                plan: { include: { product: true } },
            },
        });

        res.json(subscription);
    } catch (error) {
        console.error('Update subscription error:', error);
        res.status(500).json({ error: 'Failed to update subscription' });
    }
};

export const updateSubscriptionStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['DRAFT', 'QUOTATION', 'ACTIVE', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const subscription = await prisma.subscription.update({
            where: { id: id as string },
            data: { status },
            include: {
                customer: true,
                plan: { include: { product: true } },
            },
        });

        res.json(subscription);
    } catch (error) {
        console.error('Update subscription status error:', error);
        res.status(500).json({ error: 'Failed to update subscription status' });
    }
};

export const deleteSubscription = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.subscription.delete({ where: { id: id as string } });
        res.json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        console.error('Delete subscription error:', error);
        res.status(500).json({ error: 'Failed to delete subscription' });
    }
};
