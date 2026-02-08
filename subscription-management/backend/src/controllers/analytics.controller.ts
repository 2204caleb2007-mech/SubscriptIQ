import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getDailySpend = async (req: Request, res: Response) => {
    try {
        // Check for requested userId filter
        const targetUserId = req.query.userId as string;
        const user = (req as any).user;

        let customerId: string | undefined;
        let shouldFilterByCustomer = false;

        if (user && user.role === 'CUSTOMER') {
            shouldFilterByCustomer = true;
            // Find customer record for this user
            const customer = await prisma.customer.findUnique({ where: { email: user.email } });
            customerId = customer?.id;
        } else if (targetUserId) {
            shouldFilterByCustomer = true;
            // Admins/Staff can filter by specific user
            // We need to find the Customer associated with this User
            const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
            if (targetUser) {
                const customer = await prisma.customer.findUnique({ where: { email: targetUser.email } });
                customerId = customer?.id;
            }
        }

        if (shouldFilterByCustomer && !customerId) {
            // User requested but no customer record found -> return empty
            return res.json([]);
        }

        const whereClause: any = {
            status: 'completed',
        };

        if (customerId) {
            whereClause.invoice = {
                customerId: customerId
            };
        }

        // Fetch payments
        const payments = await prisma.payment.findMany({
            where: whereClause,
            select: {
                amount: true,
                date: true,
            },
            orderBy: {
                date: 'asc',
            },
        });

        // Group by date (YYYY-MM-DD)
        const dailyMap = new Map<string, number>();

        payments.forEach((p) => {
            const dateStr = new Date(p.date).toISOString().split('T')[0];
            const current = dailyMap.get(dateStr) || 0;
            dailyMap.set(dateStr, current + p.amount);
        });

        // Convert to array
        const result = Array.from(dailyMap.entries()).map(([date, amount]) => ({
            date,
            amount,
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching daily spend:', error);
        res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
};

export const getSubscriptionGrowth = async (req: Request, res: Response) => {
    try {
        // 1. Get monthly revenue (last 12 months)
        const payments = await prisma.payment.findMany({
            where: { status: 'completed' },
            select: { date: true, amount: true }
        });

        // 2. Get monthly new subscriptions
        const subscriptions = await prisma.subscription.findMany({
            select: { createdAt: true }
        });

        // Group by Month (YYYY-MM)
        const statsMap = new Map<string, { revenue: number, newSubs: number }>();
        const months: string[] = [];

        // Generate last 12 months keys
        const today = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            months.push(key);
            statsMap.set(key, { revenue: 0, newSubs: 0 });
        }

        // Aggregate Revenue
        payments.forEach(p => {
            const d = new Date(p.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (statsMap.has(key)) {
                const current = statsMap.get(key)!;
                current.revenue += p.amount;
            }
        });

        // Aggregate Subscriptions (Cumulative?)
        // Chart shows "subscriptions" as total count usually.
        // Let's calculate cumulative.
        // First count NEW subs per month
        subscriptions.forEach(s => {
            const d = new Date(s.createdAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            // For older months not in range, we should count them as initial base?
            // Dataset generated over last 12 months, so mostly covered.
            if (statsMap.has(key)) {
                const current = statsMap.get(key)!;
                current.newSubs += 1;
            }
        });

        // Transform to array with cumulative subs
        let cumulativeSubs = 0;
        // Count subs before the 12 month window start
        const startOfWindow = new Date(today.getFullYear(), today.getMonth() - 11, 1);
        const priorSubs = subscriptions.filter(s => new Date(s.createdAt) < startOfWindow).length;
        cumulativeSubs = priorSubs;

        const result = months.map(key => {
            const stats = statsMap.get(key)!;
            cumulativeSubs += stats.newSubs;

            // Format month name 'Jan', 'Feb' etc.
            const [year, month] = key.split('-');
            const monthName = new Date(parseInt(year), parseInt(month) - 1, 1)
                .toLocaleString('default', { month: 'short' });

            return {
                month: monthName, // e.g., 'Jan'
                fullDate: key,    // YYYY-MM for sorting if needed
                revenue: Math.round(stats.revenue),
                subscriptions: cumulativeSubs,
                churn: Math.floor(Math.random() * 10) // Mock churn for now as we didn't seed churn events
            };
        });

        res.json(result);

    } catch (error) {
        console.error('Error fetching subscription growth:', error);
        res.status(500).json({ error: 'Failed to fetch growth data' });
    }
};
