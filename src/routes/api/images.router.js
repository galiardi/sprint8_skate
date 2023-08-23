import { Router } from 'express';
import { createImage } from '../../controllers/images.controller.js';

const router = Router();

router.post('/', createImage);

export default router;
