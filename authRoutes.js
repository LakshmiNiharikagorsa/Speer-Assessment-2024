// Import required modules
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User = require('./models/user'); // Assume you have a User model
const Note = require('./models/note');

const router = express.Router();

// Apply rate limiting middleware for the signup and login endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

const JWT_SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxODAwMzAwMjdzYWlkbnMiLCJuYW1lIjoiZ29yc2FsYWtzaG1pbmloYXJpa2EiLCJpYXQiOjE1MTYyMzkwMjJ9.8SskyQTWnCfieBWv1kLi0lDqWEZK0fAfXfeVpb6_Ebs';

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Signup endpoint
router.post('/signup', authLimiter,
  [
    check('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Check if the username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Login endpoint
router.post('/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxODAwMzAwMjdzYWlkbnMiLCJuYW1lIjoiZ29yc2FsYWtzaG1pbmloYXJpa2EiLCJpYXQiOjE1MTYyMzkwMjJ9.8SskyQTWnCfieBWv1kLi0lDqWEZK0fAfXfeVpb6_Ebs'
    , { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create a new note for the authenticated user
router.post('/create-note', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const ownerId = req.user.userId; // Assuming you have middleware that sets req.user

  try {
    // Create a new note
    const newNote = new Note({
      title,
      content,
      owner: ownerId,
    });

    // Save the note to the database
    await newNote.save();

    res.status(201).json({ message: 'Note created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
