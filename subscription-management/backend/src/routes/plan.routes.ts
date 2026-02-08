import { Router } from 'express';
import { getPlans, getPlan, createPlan, updatePlan, deletePlan } from '../controllers/plan.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getPlans);
router.get('/:id', getPlan);
router.post('/', authorize('ADMIN', 'INTERNAL'), createPlan);
router.put('/:id', authorize('ADMIN', 'INTERNAL'), updatePlan);
router.delete('/:id', authorize('ADMIN'), deletePlan);

export default router;
