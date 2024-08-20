const express = require('express');
const morgan = require('morgan');
const companiesRoutes = require('./routes/companies');
const invoicesRoutes = require('./routes/invoices');
const industriesRoutes = require('./routes/industries');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/companies', companiesRoutes);
app.use('/invoices', invoicesRoutes);
app.use('/industries', industriesRoutes);

// Error Handling
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

module.exports = app;

