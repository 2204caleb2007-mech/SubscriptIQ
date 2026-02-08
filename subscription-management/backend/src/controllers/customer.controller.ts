import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';

export const getCustomers = async (req: AuthRequest, res: Response) => {
    try {
        const customers = await prisma.customer.findMany({
            include: { subscriptions: true, invoices: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(customers);
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

export const getCustomer = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const customer = await prisma.customer.findUnique({
            where: { id },
            include: { subscriptions: { include: { plan: true } }, invoices: true },
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        console.error('Get customer error:', error);
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
};

export const createCustomer = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, company, status } = req.body;

        const customer = await prisma.customer.create({
            data: {
                name,
                email,
                company,
                status: status || 'active',
            },
        });

        res.status(201).json(customer);
    } catch (error) {
        console.error('Create customer error:', error);
        res.status(500).json({ error: 'Failed to create customer' });
    }
};

export const updateCustomer = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, company, status, totalSpent } = req.body;

        const customer = await prisma.customer.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(company !== undefined && { company }),
                ...(status && { status }),
                ...(totalSpent !== undefined && { totalSpent: parseFloat(totalSpent) }),
            },
        });

        res.json(customer);
    } catch (error) {
        console.error('Update customer error:', error);
        res.status(500).json({ error: 'Failed to update customer' });
    }
};

export const deleteCustomer = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.customer.delete({ where: { id } });
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({ error: 'Failed to delete customer' });
    }
};
