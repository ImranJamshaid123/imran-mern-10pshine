import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();

// All note routes are protected
router.use(authenticate);

router.get('/', (req, res) => {
  res.json({ message: 'Get all notes', user: req.user });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create note', user: req.user });
});

export default router;
