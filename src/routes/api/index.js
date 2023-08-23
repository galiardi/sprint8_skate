import { Router } from 'express';
import usersRouter from './users.router.js';
import imagesRouter from './images.router.js';

const router = Router();

router.use('/users', usersRouter);
router.use('/images', imagesRouter);

export default router;
