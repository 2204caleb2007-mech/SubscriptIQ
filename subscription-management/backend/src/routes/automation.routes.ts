import { Router } from 'express';
import * as automationController from '../controllers/automation.controller';

const router = Router();

router.get('/logs', automationController.getAutomationLogs);
router.post('/logs', automationController.createAutomationLog);

export default router;
