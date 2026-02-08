import { Router } from 'express';
import {
    getSubscriptions,
    getSubscription,
    createSubscription,
    updateSubscription,
    updateSubscriptionStatus,
    deleteSubscription,
} from '../controllers/subscription.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getSubscriptions);
router.get('/:id', getSubscription);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.patch('/:id/status', updateSubscriptionStatus);
router.delete('/:id', authorize('ADMIN'), deleteSubscription);

export default router;
