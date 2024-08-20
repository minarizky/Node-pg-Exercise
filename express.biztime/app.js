const express = require('express');
const app = express();
const companiesRoutes = require('./routes/companies');
const invoicesRoutes = require('./routes/invoices');
const db = require('./db');

app.use(express.json()); // Middleware to parse JSON bodies

// Use routes
app.use('/companies', companiesRoutes);
app.use('/invoices', invoicesRoutes);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

