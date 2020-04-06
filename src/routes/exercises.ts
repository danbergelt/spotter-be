import express from 'express';
import {
  createExercise,
  updateExercise,
  deleteExercise,
  getExercises
} from '../controllers/exercises';
import { protect } from '../middleware/protect';

const router = express.Router();

// Routes
router
  .route('/')
  .post(protect(), createExercise)
  .get(protect(), getExercises);

router
  .route('/:id')
  .put(protect(), updateExercise)
  .delete(protect(), deleteExercise);

export default router;
