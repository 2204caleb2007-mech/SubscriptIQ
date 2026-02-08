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
            where: { id },
            include: {
                customer: true,
                plan: { include: { product: true } },
                invoices: true,
            },
        });

        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
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
            where: { id },
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
            where: { id },
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
        await prisma.subscription.delete({ where: { id } });
        res.json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        console.error('Delete subscription error:', error);
        res.status(500).json({ error: 'Failed to delete subscription' });
    }
};
