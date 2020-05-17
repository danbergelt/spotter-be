import express from 'express';
import { path } from '../utils/path';
import { postExercise, delExercise } from './exercises';
import { contact, login, registration, refresh, logout } from './users';

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
router.delete(exercisesPath('/:id'), delExercise);

export default router;
