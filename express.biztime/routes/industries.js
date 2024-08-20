const express = require('express');
const db = require('../db');
const router = new express.Router();

// Middleware to parse JSON
router.use(express.json());

// GET /industries - List all industries
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT code, industry FROM industries');
    return res.json({ industries: result.rows });
  } catch (err) {
    return next(err);
  }
});

// GET /industries/:code - Get details of a specific industry
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    const result = await db.query(
      `SELECT i.code, i.industry, 
              ARRAY_AGG(c.code) AS company_codes
       FROM industries AS i
       LEFT JOIN company_industries AS ci ON i.code = ci.industry_code
       LEFT JOIN companies AS c ON ci.company_code = c.code
       WHERE i.code = $1
       GROUP BY i.code`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Industry not found' });
    }

    return res.json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// POST /industries - Add a new industry
router.post('/', async (req, res, next) => {
  try {
    const { code, industry } = req.body;

    const result = await db.query(
      'INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry',
      [code, industry]
    );

    return res.status(201).json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// PUT /industries/:code - Update an industry's details
router.put('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const { industry } = req.body;

    const result = await db.query(
      'UPDATE industries SET industry = $1 WHERE code = $2 RETURNING code, industry',
      [industry, code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Industry not found' });
    }

    return res.json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// DELETE /industries/:code - Delete an industry
router.delete('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    const result = await db.query('DELETE FROM industries WHERE code = $1 RETURNING code', [code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Industry not found' });
    }

    return res.json({ status: 'deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
