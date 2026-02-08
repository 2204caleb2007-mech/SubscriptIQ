import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';

export const getPlans = async (req: AuthRequest, res: Response) => {
    try {
        const plans = await prisma.plan.findMany({
            include: { product: true, subscriptions: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(plans);
    } catch (error) {
        console.error('Get plans error:', error);
        res.status(500).json({ error: 'Failed to fetch plans' });
    }
};

export const getPlan = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const plan = await prisma.plan.findUnique({
<<<<<<< HEAD
            where: { id: id as string },
=======
            where: { id },
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
            include: { product: true, subscriptions: true },
        });

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        res.json(plan);
    } catch (error) {
        console.error('Get plan error:', error);
        res.status(500).json({ error: 'Failed to fetch plan' });
    }
};

export const createPlan = async (req: AuthRequest, res: Response) => {
    try {
        const { name, productId, billing, price, status } = req.body;

        const plan = await prisma.plan.create({
            data: {
                name,
                productId,
                billing,
                price: parseFloat(price),
                status: status || 'active',
            },
            include: { product: true },
        });

        res.status(201).json(plan);
    } catch (error) {
        console.error('Create plan error:', error);
        res.status(500).json({ error: 'Failed to create plan' });
    }
};

export const updatePlan = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, billing, price, status, subscribers } = req.body;

        const plan = await prisma.plan.update({
<<<<<<< HEAD
            where: { id: id as string },
=======
            where: { id },
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
            data: {
                ...(name && { name }),
                ...(billing && { billing }),
                ...(price && { price: parseFloat(price) }),
                ...(status && { status }),
                ...(subscribers !== undefined && { subscribers: parseInt(subscribers) }),
            },
            include: { product: true },
        });

        res.json(plan);
    } catch (error) {
        console.error('Update plan error:', error);
        res.status(500).json({ error: 'Failed to update plan' });
    }
};

export const deletePlan = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
<<<<<<< HEAD
        await prisma.plan.delete({ where: { id: id as string } });
=======
        await prisma.plan.delete({ where: { id } });
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
        res.json({ message: 'Plan deleted successfully' });
    } catch (error) {
        console.error('Delete plan error:', error);
        res.status(500).json({ error: 'Failed to delete plan' });
    }
};
