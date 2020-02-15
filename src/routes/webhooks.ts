import express, { Router } from 'express';
import { rebuild } from '../controllers/webhooks';

const router: Router = express.Router();

router.route('/rebuild').post(rebuild);

export default router;
