import express from 'express';
import { getDailySpend, getSubscriptionGrowth } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Get daily spend analytics
router.get('/daily-spend', authenticate, getDailySpend);
router.get('/subscription-growth', authenticate, getSubscriptionGrowth);

export default router;
