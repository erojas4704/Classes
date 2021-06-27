const db = require("../db");
const ExpressError = require("../Handlers");
const express = require("express");
const router = new express.Router();

/**Gets all industries. */
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`
            SELECT i.code as icode, i.industry, c.code, c.name 
            FROM industries AS i
            LEFT JOIN
                comp_industries AS ci
            ON i.code = ci.industry_code
            LEFT JOIN
                companies as c
            ON ci.comp_code = c.code`
        );
        let industryDict = {};
        results.rows.forEach(r => {
            if (!industryDict[r.icode]) {
                industryDict[r.icode] = {
                    industry: r.industry,
                    code: r.icode,
                    companies: []
                };
            }

            let ind = industryDict[r.icode];
            if (r.code) {
                ind.companies.push({
                    code: r.code,
                    name: r.name
                });
            }
        });

        return res.json({ industries: Object.values(industryDict) });
    } catch (err) {
        return next(err);
    }
});

/**Gets specific industry. */
router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`
            SELECT i.code as icode, i.industry, c.code, c.name 
            FROM industries AS i
            LEFT JOIN
                comp_industries AS ci
            ON i.code = ci.industry_code
            LEFT JOIN
                companies as c
            ON ci.comp_code = c.code
            WHERE i.code = $1`,
            [code]
        );
        if (results.rowCount < 1) {
            throw new ExpressError(`Industry ${code} could not be located.`, 404);
        }
        debugger;
        let industry = {
            industry: results.rows[0].industry,
            icode: results.rows[0].icode
        }

        industry.companies = results.rows.map(r => {
            return {
                name: r.name,
                code: r.code
            }
        });

        return res.json({ industry });
    } catch (err) {
        return next(err);
    }
});

/**Adds an industry. */
router.post('/', async (req, res, next) => {
    try {
        //TODO error for duplicate handler.
        const { code, industry } = req.body;
        const results = await db.query("INSERT INTO industries(code, industry) VALUES ($1, $2) RETURNING code, industry", [code, industry]);
        return res.json({ industry: results.rows[0] });
    } catch (err) {
        return next(err);
    }
});

/**Adds an industry to a company */
router.post('/assign', async (req, res, next) => {
    try {
        const { companyCode, industryCode } = req.body;
        const results = await db.query(`
            INSERT INTO comp_industries(comp_code, industry_code) 
            VALUES ($1, $2) RETURNING id, comp_code, industry_code`,
            [companyCode, industryCode]
        );
        return res.json({ industry: results.rows[0] });
    } catch (err) {
        //Workaround by parsing the pg error.
        if (err.message.includes("duplicate key value violates")) {
            return next(new ExpressError("That company is already assigned to that industry", 500))
        }

        return next(new ExpressError("Invalid company or industry.", 404))
    }
});

module.exports = router;