"use strict";

/** Routes for jobs. */
const express = require('express');
const router = new express.Router();

const { ensureIsAdmin, ensureLoggedIn } = require("../middleware/auth");
const jsonschema = require("jsonschema");

const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const { BadRequestError } = require("../expressError");
const Job = require("../models/job");

//If I wanted to, i could have middleware here. with router.use?

router.get("/", async (req, res, next) => {
    try {
        const jobs = await Job.getAll();
        return res.json({jobs});
    } catch (err) {
        return next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const job = await Job.get(req.params.id);
        return res.json({job});
    } catch (err) {
        return next(err);
    }
});

router.post("/", ensureIsAdmin, async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.create(req.body);
        return res.status(201).json({ job });
    } catch (err) {
        return next(err);
    }
});

router.patch("/:id", ensureIsAdmin, async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, jobUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.update(req.params.id, req.body);
        return res.status(201).json({ job });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", ensureIsAdmin, async (req, res, next) => {
    try {
        await Job.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;