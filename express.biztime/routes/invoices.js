const express = require('express');
const db = require('../db');
const router = new express.Router();

// Middleware to parse JSON
router.use(express.json());

// GET /invoices - List all invoices
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, comp_code FROM invoices');
    return res.json({ invoices: result.rows });
  } catch (err) {
    return next(err);
  }
});

// GET /invoices/:id - Get details of a specific invoice
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoiceResult = await db.query(
      `SELECT i.id, i.amt, i.paid, i.add_date, i.paid_date,
              c.code AS comp_code, c.name, c.description
       FROM invoices AS i
       JOIN companies AS c ON i.comp_code = c.code
       WHERE i.id = $1`,
      [id]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    return res.json({ invoice: invoiceResult.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// POST /invoices - Add a new invoice
router.post('/', async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;

    const result = await db.query(
      'INSERT INTO invoices (comp_code, amt, paid, add_date) VALUES ($1, $2, FALSE, CURRENT_DATE) RETURNING id, comp_code, amt, paid, add_date, paid_date',
      [comp_code, amt]
    );

    return res.status(201).json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// PUT /invoices/:id - Update an invoice
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amt, paid } = req.body;

    const result = await db.query(
      'SELECT paid, paid_date FROM invoices WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoice = result.rows[0];
    const paidDate = paid ? new Date().toISOString().split('T')[0] : null;

    const updatedResult = await db.query(
      'UPDATE invoices SET amt = $1, paid = $2, paid_date = $3 WHERE id = $4 RETURNING id, comp_code, amt, paid, add_date, paid_date',
      [amt, paid, paidDate, id]
    );

    return res.json({ invoice: updatedResult.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// DELETE /invoices/:id - Delete an invoice
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM invoices WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    return res.json({ status: 'deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

