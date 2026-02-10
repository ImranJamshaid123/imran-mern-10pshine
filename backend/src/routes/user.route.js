import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
} from '../controllers/user.controller.js';
import {
  updateProfileValidator,
  changePasswordValidator,
} from '../validators/user.validator.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

// All user profile routes are protected
router.use(authenticate);

// Get logged-in user profile
router.get('/me', getMyProfile);

// Update name
router.put('/me', updateProfileValidator, validate, updateMyProfile);

// Change password
router.put(
  '/change-password',
  changePasswordValidator,
  validate,
  changePassword
);

export default router;
