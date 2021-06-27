const db = require("../db");
const ExpressError = require("../Handlers");
const express = require("express");
const router = new express.Router();

/**Gets all invoices. */
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query("SELECT * FROM invoices");
        return res.json({ invoices: results.rows });
    } catch (err) {
        return next(err);
    }
});

/**Gets specific invoice. */
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query("SELECT * FROM invoices WHERE id = $1", [id]);
        if(results.rowCount < 1){
            throw new ExpressError(`Invoice ${id} could not be located.`, 404);
        }
        return res.json({ invoice: results.rows[0] });
    } catch (err) {
        return next(err);
    }
});

/**Adds an invoice. */
router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const results = await db.query("INSERT INTO invoices(comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt", [comp_code, amt]);
        return res.json({ invoice: results.rows[0] });
    } catch (err) {
        return next(err);
    }
});

/**Deletes an invoice. */
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query("DELETE FROM invoices WHERE id=$1", [id]);
        if(results.rowCount < 1){
            throw new ExpressError(`Could not find invoice ${id} for deletion.`, 404);
        }
        return res.json({ status: "deleted" });
    } catch (err) {
        return next(err);
    }
});

/**Updates an invoice. */
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt } = req.body;
        const result = await db.query(
            `UPDATE invoices SET amt=$2
            WHERE id=$1 
            RETURNING id, comp_code, amt`,
            [id, amt]
        );
        if (result.rowCount < 1) {
            throw new ExpressError(`Could not find invoice ${id}.`, 404);
        }
        return res.json({ invoice: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;