const hex = require('is-hexcolor'); // eslint-disable-line
const stringify = require('csv-stringify'); // eslint-disable-line
import Workout from '../models/Workout';
import asyncHandler from '../utils/asyncHandler';
import { promisify } from 'util';
import HttpError from '../utils/HttpError';
import fs from 'fs';
import path from 'path';
import { Workout as WorkoutInterface, Tag } from '../types/models';
import { prs } from '../utils/prs';

// @desc --> get all workouts by user id
// @route --> GET /api/auth/workouts
// @access --> Private

export const getWorkoutsByUserId = asyncHandler(async (req, res) => {
  const pagination: { page: number; limit: number } = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 10
  };

  const workouts: Array<WorkoutInterface> = await Workout.find({
    user: req.user._id
  })
    .skip(pagination.page * pagination.limit)
    .limit(pagination.limit);

  return res
    .status(200)
    .json({ success: true, count: workouts.length, workouts });
});

// @desc --> get time sorted list of workouts by user id
// @route --> POST /api/auth/workouts/range
// @access --> Private

export const workoutRangeByUserId = asyncHandler(async (req, res, next) => {
  if (!req.body.range) {
    return next(new HttpError('Please supply a date range', 400));
  }

  const workouts: Array<WorkoutInterface> = await Workout.find({
    user: req.user._id,
    date: { $in: req.body.range }
  }).sort({ date: 1 });

  res.status(200).json({ success: true, count: workouts.length, workouts });

  next();
});

// @desc --> add workout
// @route --> POST /api/auth/workouts
// @access --> Private

export const addWorkout = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;

  // validate the tag colors
  let colorValidate: Array<Tag | false> = [];

  if (req.body.tags && req.body.tags.length) {
    colorValidate = req.body.tags.map((el: Tag) => hex(el.color));
  }

  if (colorValidate.includes(false)) {
    return next(new HttpError('Invalid color detected', 400));
  }

  const workout: WorkoutInterface = await Workout.create(req.body);

  await prs(req.user._id);

  return res.status(201).json({
    success: true,
    workout
  });
});

// @desc --> edit workout
// @route --> PUT /api/auth/workouts/:id
// @access --> Private

export const editWorkout = asyncHandler(async (req, res) => {
  const workout: WorkoutInterface | null = await Workout.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  );

  await prs(req.user._id);

  return res.status(200).json({
    success: true,
    workout
  });
});

// @desc --> delete workout
// @route --> DELETE /api/auth/workouts/:id
// @access --> Private

export const deleteWorkout = asyncHandler(async (req, res) => {
  const workout: WorkoutInterface | null = await Workout.findByIdAndDelete(
    req.params.id
  );

  await prs(req.user._id);

  res.status(200).json({
    success: true,
    workout
  });
});

// @desc --> download workout data as a CSV
// @route --> DELETE /api/auth/workouts/download
// @access --> Private

export const downloadWorkoutData = asyncHandler(async (req, res, next) => {
  // fetch all workouts by the user id
  const workouts: Array<WorkoutInterface> = await Workout.find({
    user: req.user._id
  });

  // convert the workouts to JSON
  let jsonWorkouts;
  try {
    jsonWorkouts = JSON.parse(JSON.stringify(workouts));
  } catch (_) {
    return next(new HttpError('Could not download, an error occurred', 500));
  }

  // constants for saving the file locally
  const filename = `download-${req.user._id}-workouts.csv`;
  const absPath: string = path.join(__dirname, '/static/', filename);

  // promisify csv converter and FS functions
  const csv = promisify(stringify);
  const write = promisify(fs.writeFile);

  // create CSV string output
  const csvWorkouts = await csv(jsonWorkouts, { header: true });

  // write to a CSV file in a local static path (temporary)
  await write(absPath, csvWorkouts);

  // download the file to the user
  return res.download(absPath, err => {
    if (err) {
      if (res.headersSent) {
        // log the err to the console (this should not happen, should default to the below response)
        console.log(err);
      } else {
        return next(
          new HttpError('Could not download, an error occurred', 400)
        );
      }
    }

    // remove the temporary file from the local static path
    fs.unlink(absPath, err => {
      if (err) {
        // Occurs after file is downloaded, so no need to send error response
        // This should not happen: log unlink err to console for debugging purposes
        console.log(`Unlink error: ${err}`);
      }
    });
  });
});
