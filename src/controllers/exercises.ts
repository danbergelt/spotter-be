import HttpError from '../utils/HttpError';
import Exercise from '../models/Exercise';
import asyncExpressFn from '../utils/asyncExpressFn';
import { Exercise as ExerciseInterface } from '../types/models';
import { prs } from '../utils/prs';

// @desc --> create exercise
// @route --> POST /api/auth/exercises
// @access --> Private

export const createExercise = asyncExpressFn(async (req, res, next) => {
  req.body.user = req.id;

  const exercise: Array<ExerciseInterface> = await Exercise.find({
    name: req.body.name,
    user: req.id
  });

  if (exercise.length) {
    return next(new HttpError('Exercise already exists', 400));
  }

  const createdExercise = await Exercise.create(req.body);

  await prs(req.id);

  return res.status(201).json({
    success: true,
    exercise: createdExercise
  });
});

// @desc --> update exercise
// @route --> PUT /api/auth/exercises/:id
// @access --> Private

export const updateExercise = asyncExpressFn(async (req, res) => {
  const exercise: ExerciseInterface | null = await Exercise.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  );

  await prs(req.id);

  return res.status(201).json({
    success: true,
    exercise
  });
});

// @desc --> delete exercise
// @route --> DELETE /api/auth/exercises/:id
// @access --> Private

export const deleteExercise = asyncExpressFn(async (req, res) => {
  const exercise = await Exercise.findByIdAndDelete(req.params.id);

  await prs(req.id);

  return res.status(200).json({
    success: true,
    exercise
  });
});

// @desc --> fetch exercises
// @route --> GET /api/auth/exercises
// @access --> Private

export const getExercises = asyncExpressFn(async (req, res) => {
  const exercises: Array<ExerciseInterface> = await Exercise.find({
    user: req.id
  });

  return res.status(200).json({
    success: true,
    count: exercises.length,
    exercises
  });
});
