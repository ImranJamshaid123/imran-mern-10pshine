import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  updateNoteFlags,
} from '../controllers/note.controller.js';
import {
  createNoteValidator,
  updateNoteValidator,
} from '../validators/note.validator.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

// All note routes are protected
router.use(authenticate);

router.post('/', createNoteValidator, validate, createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNoteValidator, validate, updateNote);
router.put('/:id/flags', updateNoteFlags);
router.delete('/:id', deleteNote);
router.patch('/:id/state', updateNoteFlags);
export default router;
