import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAutomationLogs = async (req: Request, res: Response) => {
    try {
        const logs = await prisma.automationLog.findMany({
            orderBy: { triggeredAt: 'desc' },
            take: 20
        });
        res.json(logs);
    } catch (error) {
        console.error('Failed to fetch automation logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createAutomationLog = async (req: Request, res: Response) => {
    try {
        const { workflow, action, target, records, status, triggeredAt, duration } = req.body;
        const log = await prisma.automationLog.create({
            data: {
                workflow,
                action,
                target,
                records: records || 0,
                status: status || 'completed',
                triggeredAt: triggeredAt ? new Date(triggeredAt) : new Date(),
                duration
            }
        });
        res.status(201).json(log);
    } catch (error) {
        console.error('Failed to create automation log:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
