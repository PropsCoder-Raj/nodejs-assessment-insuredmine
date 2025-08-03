const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

require('./utils/cpu-monitor.utils');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: 'Hello World!',
  });
});

const indexRoutes = require('./routes');
app.use('/api', indexRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
