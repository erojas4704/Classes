"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { generateWhereClause, sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for jobs. */
class Job {
    static async create({ title, salary, equity, company_handle }) {
        const companyCheck = await db.query(
            `SELECT handle
                FROM companies
                WHERE handle = $1`,
            [company_handle]);

        if (companyCheck.numRows < 1) {
            throw new BadRequestError(`Company ${company_handle} does not exist.`);
        }

        const result = await db.query(
            `INSERT INTO jobs
                (title, salary, equity, company_handle)
                VALUES ($1, $2, $3, $4)
                RETURNING title, salary, equity, company_handle`,
            [
                title,
                salary,
                equity,
                company_handle
            ]
        );
        const job = result.rows[0];
        return job;
    }
    
    /**Delete job by id from the database. 
     * 
     * No return value.
     * Throws NotFoundError if the job was not found.
    */
    static async remove(id) {
        const result = await db.query(
          `DELETE
               FROM jobs
               WHERE id = $1
               RETURNING id`,
          [id]);
        const job = result.rows[0];
    
        if (!job) throw new NotFoundError(`No job: ${id}`);
    }

    /**
 * 
 * @param {*} criteria An object containing any of the following optional criteria:
 * title: Job title. 
 * salary: Minimum salary
 * equity; Any value will do.
 * companyName: Name of the company
 */
    static async findByCriteria(criteria) {
        let { whereClause, values } = generateWhereClause(criteria, {
            "title": "ILIKE",
            "company": "ILIKE",
            "salary": ">",
            "equity": ">"
        }, {
            "title": "title",
            "company": "name"
        });

        const jobsRes = await db.query(
            `SELECT 
                title,
                salary,
                equity,
                name as company,
                handle
           FROM jobs
           LEFT JOIN companies
           ON handle=company_handle
           ${whereClause}
           ORDER BY name`, [...values]);

        return jobsRes.rows;
    }
    /**Get all jobs */
    static async getAll(){
        const res = await db.query(`
        SELECT id, title, salary, equity, company_handle
            FROM jobs
        `);
        const jobs = res.rows;
        if (res.rowCount < 1) throw new NotFoundError(`No jobs`);
        return jobs;
    }

    /**Get job by ID */
    static async get(id) {
        const res = await db.query(`
        SELECT id, title, salary, equity, company_handle
            FROM jobs
            WHERE id = $1
        `, [id]);

        const job = res.rows[0];
        if (!job) throw new NotFoundError(`"No job: ${id}`);
        return job;
    }

    /**Update job with data */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data);
        const idVarIndex = "$" + (values.length + 1);

        const querySql = `UPDATE jobs 
                            SET ${setCols} 
                            WHERE id = ${idVarIndex} 
                            RETURNING title, 
                                    salary, 
                                    equity, 
                                    company_handle`;
        const result = await db.query(querySql, [...values, id]);
        const job = result.rows[0];

        if (!job) throw new NotFoundError(`No job: ${id}`);

        return job;
    }
}

module.exports = Job;