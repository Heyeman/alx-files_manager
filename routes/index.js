import { Router } from 'express';
import { getStatus, getStats } from '../controllers/AppController';

const router = Router();

router.get('/status', getStatus);
router.get('/stats', getStats);

module.exports = router;
