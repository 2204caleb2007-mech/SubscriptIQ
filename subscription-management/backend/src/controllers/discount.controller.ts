import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';

export const getDiscounts = async (req: AuthRequest, res: Response) => {
    try {
        const discounts = await prisma.discount.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(discounts);
    } catch (error) {
        console.error('Get discounts error:', error);
        res.status(500).json({ error: 'Failed to fetch discounts' });
    }
};

export const getDiscount = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const discount = await prisma.discount.findUnique({ where: { id } });

        if (!discount) {
            return res.status(404).json({ error: 'Discount not found' });
        }

        res.json(discount);
    } catch (error) {
        console.error('Get discount error:', error);
        res.status(500).json({ error: 'Failed to fetch discount' });
    }
};

export const createDiscount = async (req: AuthRequest, res: Response) => {
    try {
        const { name, code, type, value, status, maxUses, validUntil } = req.body;

        const discount = await prisma.discount.create({
            data: {
                name,
                code,
                type,
                value: parseFloat(value),
                status: status || 'active',
                maxUses: maxUses ? parseInt(maxUses) : null,
                validUntil: validUntil ? new Date(validUntil) : null,
            },
        });

        res.status(201).json(discount);
    } catch (error) {
        console.error('Create discount error:', error);
        res.status(500).json({ error: 'Failed to create discount' });
    }
};

export const updateDiscount = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, code, type, value, status, usageCount, maxUses, validUntil } = req.body;

        const discount = await prisma.discount.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(code && { code }),
                ...(type && { type }),
                ...(value !== undefined && { value: parseFloat(value) }),
                ...(status && { status }),
                ...(usageCount !== undefined && { usageCount: parseInt(usageCount) }),
                ...(maxUses !== undefined && { maxUses: maxUses ? parseInt(maxUses) : null }),
                ...(validUntil !== undefined && { validUntil: validUntil ? new Date(validUntil) : null }),
            },
        });

        res.json(discount);
    } catch (error) {
        console.error('Update discount error:', error);
        res.status(500).json({ error: 'Failed to update discount' });
    }
};

export const deleteDiscount = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.discount.delete({ where: { id } });
        res.json({ message: 'Discount deleted successfully' });
    } catch (error) {
        console.error('Delete discount error:', error);
        res.status(500).json({ error: 'Failed to delete discount' });
    }
};

export const validateDiscount = async (req: AuthRequest, res: Response) => {
    try {
        const { code } = req.body;

        const discount = await prisma.discount.findUnique({ where: { code } });

        if (!discount) {
            return res.status(404).json({ error: 'Invalid discount code' });
        }

        if (discount.status !== 'active') {
            return res.status(400).json({ error: 'Discount is not active' });
        }

        if (discount.maxUses && discount.usageCount >= discount.maxUses) {
            return res.status(400).json({ error: 'Discount usage limit reached' });
        }

        if (discount.validUntil && new Date() > discount.validUntil) {
            return res.status(400).json({ error: 'Discount has expired' });
        }

        res.json({ valid: true, discount });
    } catch (error) {
        console.error('Validate discount error:', error);
        res.status(500).json({ error: 'Failed to validate discount' });
    }
};
