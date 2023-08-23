import { Router } from 'express';
import {
  registerUser,
  registerAdmin,
  login,
  recoverPassword,
  getAllUsers,
  updateUser,
  updateState,
  deleteUser,
} from '../../controllers/users.controller.js';
import { verifyUserToken } from '../../middlewares/verifyUserToken.js';
import { verifyAdminToken } from '../../middlewares/verifyAdminToken.js';
import { verifyOwnership } from '../../middlewares/verifyOwnership.js';

const router = Router();

router.post('/register', registerUser);
router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.post('/recover-password', recoverPassword);
router.get('/', getAllUsers);
router.put('/:userId', verifyUserToken, verifyOwnership, updateUser);
router.put('/update-state/:userId', verifyAdminToken, updateState);
router.delete('/:userId', verifyUserToken, verifyOwnership, deleteUser);

export default router;
