import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';

export const getInvoices = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.query;

        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }

        const invoices = await prisma.invoice.findMany({
            where,
            include: {
                customer: true,
                subscription: { include: { plan: true } },
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(invoices);
    } catch (error) {
        console.error('Get invoices error:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
};

export const getInvoice = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                customer: true,
                subscription: { include: { plan: { include: { product: true } } } },
                payments: true,
            },
        });

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        console.error('Get invoice error:', error);
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
};

export const createInvoice = async (req: AuthRequest, res: Response) => {
    try {
        const { subscriptionId, customerId, amount, status, dueDate, paidDate } = req.body;

        const invoice = await prisma.invoice.create({
            data: {
                subscriptionId,
                customerId,
                amount: parseFloat(amount),
                status: status || 'PENDING',
                dueDate: new Date(dueDate),
                paidDate: paidDate ? new Date(paidDate) : null,
            },
            include: {
                customer: true,
                subscription: { include: { plan: true } },
            },
        });

        res.status(201).json(invoice);
    } catch (error) {
        console.error('Create invoice error:', error);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
};

export const updateInvoice = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { amount, status, dueDate, paidDate } = req.body;

        const invoice = await prisma.invoice.update({
            where: { id },
            data: {
                ...(amount !== undefined && { amount: parseFloat(amount) }),
                ...(status && { status }),
                ...(dueDate && { dueDate: new Date(dueDate) }),
                ...(paidDate !== undefined && { paidDate: paidDate ? new Date(paidDate) : null }),
            },
            include: {
                customer: true,
                subscription: { include: { plan: true } },
            },
        });

        res.json(invoice);
    } catch (error) {
        console.error('Update invoice error:', error);
        res.status(500).json({ error: 'Failed to update invoice' });
    }
};

export const updateInvoiceStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['PENDING', 'PAID', 'OVERDUE', 'VOID'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const invoice = await prisma.invoice.update({
            where: { id },
            data: {
                status,
                ...(status === 'PAID' && { paidDate: new Date() }),
            },
            include: {
                customer: true,
                subscription: { include: { plan: true } },
            },
        });

        res.json(invoice);
    } catch (error) {
        console.error('Update invoice status error:', error);
        res.status(500).json({ error: 'Failed to update invoice status' });
    }
};
