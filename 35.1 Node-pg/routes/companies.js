const db = require("../db");
const ExpressError = require("../Handlers");
const express = require("express");
const router = new express.Router();


/**Gets all companies. */
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query("SELECT * FROM companies");
        return res.json({ companies: results.rows });
    } catch (err) {
        return next(err);
    }
});

/**Gets a company by code. */
router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query("SELECT * FROM companies WHERE code=$1", [code]);
        if (results.rows.length < 1) {
            throw new ExpressError(`Company with code ${code} not found.`, 404);
        }
        return res.json({ company: results.rows[0] });
    } catch (err) {
        return next(err);
    }
});

/**Creates a company */
router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;

        const currentCompany = await db.query("SELECT * FROM companies WHERE code=$1", [code]);
        if (currentCompany.rows.length > 0) {
            throw new ExpressError("Company with that code already exists", 409);
        }

        const results = await db.query("INSERT INTO companies(code, name, description) VALUES ($1, $2, $3) RETURNING *", [code, name, description]);
        return res.status(201).json({ company: results.rows[0] });
    } catch (err) {
        return next(err);
    }
});

/**Updates a company */
router.put('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const result = await db.query(
            `UPDATE companies SET name=$2, description=$3 
            WHERE code=$1 
            RETURNING code, name, description`,
            [code, name, description]
        );
        if (result.rowCount < 1) {
            throw new ExpressError(`Could not find company with code ${code}.`, 404);
        }
        return res.json({ company: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

/**Deletes a company */
router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const result = await db.query("DELETE FROM companies WHERE code = $1", [code]);
        if (result.rowCount < 1) {
            throw new ExpressError(`Could not find company with code ${code} for deletion.`, 404);
        }

        return res.json({ status: 'deleted' });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;