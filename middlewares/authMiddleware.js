const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const JWT_SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxODAwMzAwMjdzYWlkbnMiLCJuYW1lIjoiZ29yc2FsYWtzaG1pbmloYXJpa2EiLCJpYXQiOjE1MTYyMzkwMjJ9.8SskyQTWnCfieBWv1kLi0lDqWEZK0fAfXfeVpb6_Ebs'; // Replace with your actual secret key

// Rate limiting middleware
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

const authenticateUser = (req, res, next) => {
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

module.exports = {
  authenticateUser,
  authLimiter,
};
