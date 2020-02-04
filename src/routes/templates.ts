import express, { Router } from 'express';
import {
  getTemplatesByUserId,
  addTemplate,
  editTemplate,
  deleteTemplate
} from '../controllers/templates';
import { protect } from '../middleware/auth';

const router: Router = express.Router();

router
  .route('/')
  .get(protect, getTemplatesByUserId)
  .post(protect, addTemplate);

router
  .route('/:id')
  .put(protect, editTemplate)
  .delete(protect, deleteTemplate);

export default router;
