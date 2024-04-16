const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

const connectToMongo = require('./db');
connectToMongo();

const authRoutes = require('./routes/auth'); // Import the auth routes
const notesRoutes = require('./routes/notes'); // Import other routes if needed

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/api/v1/login', (req, res) => {
  res.send('Login Page');
});
app.get('/api/v1/signup', (req, res) => {
  res.send('SignUp Page');
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
