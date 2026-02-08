import { Router } from 'express';
import { getPayments, getPayment, createPayment, createOrder, verifyPayment } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getPayments);
router.get('/:id', getPayment);
router.post('/', createPayment);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

export default router;
