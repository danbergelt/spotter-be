import express, { Router } from 'express';
import { createTag, deleteTag, editTag, getTags } from '../controllers/tags';
import { protect } from '../middleware/protect';

const router: Router = express.Router();

// Routes
router
  .route('/')
  .post(protect(), createTag)
  .get(protect(), getTags);

router
  .route('/:id')
  .delete(protect(), deleteTag)
  .put(protect(), editTag);

export default router;
