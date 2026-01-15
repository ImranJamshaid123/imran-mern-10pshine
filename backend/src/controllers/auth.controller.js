import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/database.js';

// User Registration

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

// Login User

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!users.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};


// Forgot Password

export const forgotPassword = async (req, res, next) => {
    
  try {

    if (!req.body || !req.body.email) {
      return res.status(400).json({
        message: 'Email is required',
      });
    }
    
    const { email } = req.body;

    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await pool.query(
      'UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?',
      [resetToken, expiry, email]
    );

    res.json({
      message: 'Password reset token generated',
      resetToken, // (In real apps, send via email)
    });
  } catch (err) {
    next(err);
  }
};



// Password Reset

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const [users] = await pool.query(
      'SELECT * FROM users WHERE reset_token=? AND reset_token_expiry > NOW()',
      [token]
    );

    if (!users.length) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password=?, reset_token=NULL, reset_token_expiry=NULL WHERE id=?',
      [hashedPassword, users[0].id]
    );

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

