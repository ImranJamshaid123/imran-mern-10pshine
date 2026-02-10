// Main Router

import express from 'express';
import authRoutes from './auth.Route.js';
import noteRoutes from './note.Route.js';
import userRoutes from './user.route.js';

const router = express.Router();

// Define routes
router.use('/auth', authRoutes);
router.use('/notes', noteRoutes);
router.use('/users', userRoutes);

export default router;
