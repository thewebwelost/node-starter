require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbCon');

const corsOptions = require('./config/corsOptions');

const errorHandler = require('./middleware/errorHandler');
const { logger } = require('./middleware/logEvents');
const verifyJWT = require('./middleware/verifyJwt');
const credentials = require('./middleware/credentials');

const PORT = process.env.PORT || 3500;

// connect to MongoDB
connectDB();

const app = express();

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions()));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// serving static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routing
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/dudes', require('./routes/api/dudes'));
app.all('*', (req, res) => {
  res.status(404);

  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'view', '404.html'));
  } else if (req.accepts('json')) {
    res.send({ error: 'Not Found' });
  } else {
    res.type('txt').send('404 Not found');
  }
});

// error logging
app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
