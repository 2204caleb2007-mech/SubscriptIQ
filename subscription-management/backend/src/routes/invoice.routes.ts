import { Router } from 'express';
import {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    updateInvoiceStatus,
} from '../controllers/invoice.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.post('/', authorize('ADMIN', 'INTERNAL'), createInvoice);
router.put('/:id', authorize('ADMIN', 'INTERNAL'), updateInvoice);
router.patch('/:id/status', updateInvoiceStatus);

export default router;
