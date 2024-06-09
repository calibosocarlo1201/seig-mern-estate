import express from 'express'
import { signUp, signIn, google } from '../controllers/auth.controller.js';
import { logoutUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/google', google);
router.get('/signout', logoutUser)

export default router;