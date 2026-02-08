import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';

export const getTaxes = async (req: AuthRequest, res: Response) => {
    try {
        const taxes = await prisma.tax.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(taxes);
    } catch (error) {
        console.error('Get taxes error:', error);
        res.status(500).json({ error: 'Failed to fetch taxes' });
    }
};

export const getTax = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const tax = await prisma.tax.findUnique({ where: { id } });

        if (!tax) {
            return res.status(404).json({ error: 'Tax not found' });
        }

        res.json(tax);
    } catch (error) {
        console.error('Get tax error:', error);
        res.status(500).json({ error: 'Failed to fetch tax' });
    }
};

export const createTax = async (req: AuthRequest, res: Response) => {
    try {
        const { name, rate, region, status, appliesTo } = req.body;

        const tax = await prisma.tax.create({
            data: {
                name,
                rate: parseFloat(rate),
                region,
                status: status || 'active',
                appliesTo,
            },
        });

        res.status(201).json(tax);
    } catch (error) {
        console.error('Create tax error:', error);
        res.status(500).json({ error: 'Failed to create tax' });
    }
};

export const updateTax = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, rate, region, status, appliesTo } = req.body;

        const tax = await prisma.tax.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(rate !== undefined && { rate: parseFloat(rate) }),
                ...(region && { region }),
                ...(status && { status }),
                ...(appliesTo && { appliesTo }),
            },
        });

        res.json(tax);
    } catch (error) {
        console.error('Update tax error:', error);
        res.status(500).json({ error: 'Failed to update tax' });
    }
};

export const deleteTax = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.tax.delete({ where: { id } });
        res.json({ message: 'Tax deleted successfully' });
    } catch (error) {
        console.error('Delete tax error:', error);
        res.status(500).json({ error: 'Failed to delete tax' });
    }
};
