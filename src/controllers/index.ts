import { Router } from 'express';
import { path } from '../utils/express';
// import { postExercise, deleteExercise, readExercises } from './exercises';
import { contact, login, registration, refresh, logout } from './users';
// import { postTag, readTags } from './tags';
// import { postWorkout, deleteWorkout, putWorkout } from './workouts';

const router = Router();

// all user endpoints
const users = '/users';
router.post(path([users, '/contact']), contact);
router.post(path([users, '/login']), login);
router.post(path([users, '/registration']), registration);
router.post(path([users, '/refresh']), refresh);
router.post(path([users, '/logout']), logout);

// // all exercise endpoints
// const exercisesPath = path('/exercises');
// router.post(exercisesPath(), postExercise);
// router.get(exercisesPath(), readExercises);
// router.delete(exercisesPath('/:id'), deleteExercise);

// // all tag endpoints
// const tagsPath = path('/tags');
// router.post(tagsPath(), postTag);
// router.get(tagsPath(), readTags);

// // all workout endpoints
// const workoutsPath = path('/workouts');
// router.post(workoutsPath(), postWorkout);
// router.delete(workoutsPath('/:id'), deleteWorkout);
// router.put(workoutsPath('/:id'), putWorkout);

export default router;
