import express from 'express';
import { path } from '../utils/express';
import { postExercise, deleteExercise, readExercises } from './exercises';
import { contact, login, registration, refresh, logout } from './users';
import { postTag } from './tags';

const router = express.Router();

// all user endpoints
const usersPath = path('/users');
router.post(usersPath('/contact'), contact);
router.post(usersPath('/login'), login);
router.post(usersPath('/registration'), registration);
router.post(usersPath('/refresh'), refresh);
router.post(usersPath('/logout'), logout);

// all exercise endpoints
const exercisesPath = path('/exercises');
router.post(exercisesPath(''), postExercise);
router.get(exercisesPath(''), readExercises);
router.delete(exercisesPath('/:id'), deleteExercise);

// all tag endpoints
const tagsPath = path('/tags');
router.post(tagsPath(''), postTag);

export default router;
