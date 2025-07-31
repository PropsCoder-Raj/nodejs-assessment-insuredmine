const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: 'Hello World!',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
