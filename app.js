const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { authenticateUser, authLimiter } = require('./middlewares/authMiddleware'); 
const authController = require('./controllers/authController'); 
const noteController = require('./controllers/noteController'); 
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.json());

// Authentication Endpoints with Rate Limiting
app.post('/api/auth/signup', authLimiter, authController.signup);
app.post('/api/auth/login', authLimiter, authController.login);

// Note Endpoints with Authentication Middleware
app.get('/api/notes', authenticateUser, noteController.getAllNotes);
app.get('/api/notes/:id', authenticateUser, noteController.getNoteById);
app.post('/api/notes', authenticateUser, noteController.createNote);
app.put('/api/notes/:id', authenticateUser, noteController.updateNote);
app.delete('/api/notes/:id', authenticateUser, noteController.deleteNote);
app.post('/api/notes/:id/share', authenticateUser, noteController.shareNote);

// Search Endpoint with Authentication Middleware
app.get('/api/search', authenticateUser, noteController.searchNotes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
