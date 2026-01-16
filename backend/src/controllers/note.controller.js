import pool from '../config/database.js';

// Create Note
export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [userId, title, content]
    );

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      noteId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Notes (for logged-in user)
export const getNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [notes] = await pool.query(
      'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Note
export const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [notes] = await pool.query(
      'SELECT * FROM notes WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!notes.length) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.json({
      success: true,
      note: notes[0],
    });
  } catch (error) {
    next(error);
  }
};

// Update Note
export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      'UPDATE notes SET title=?, content=? WHERE id=? AND user_id=?',
      [title, content, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized or note not found',
      });
    }

    res.json({
      success: true,
      message: 'Note updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete Note
export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await pool.query(
      'DELETE FROM notes WHERE id=? AND user_id=?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized or note not found',
      });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
