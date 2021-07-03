const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminToken,
} = require("./_testCommon");
const { createToken } = require("../helpers/tokens");
const Job = require("./job");
const { findAll, findByCriteria, update } = require("./job");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Create new job", () => {
    test("Works", async () => {
        const result = await Job.create({
            title: "Ass eater",
            salary: 69,
            equity: 0,
            company_handle: "c1"
        });
        expect(result).toEqual({
            title: "Ass eater",
            salary: 69,
            equity: "0",
            company_handle: "c1"
        });
    });

    test("Fails with invalid company", async () => {
        try {
            await Job.create({
                title: "Ass eater",
                salary: 69,
                equity: 0,
                company_handle: "not a real company"
            });
            fail();
        } catch (err) {
            expect(err.code).toBe("23503");
        }
    });
});

describe("Get jobs", () => {
    test("find", async () => {
        let res = await findAll();
        expect(res.length).toEqual(5);
    });
});

describe("Update values on jobs", () => {
    test("Change the price on a job", async () => {
        let jobSearch = await Job.findByCriteria({company: "c1"});
        let job = jobSearch[0];
        let res = await update(job.id, {
            salary: 666
        });
        expect(res).toEqual({
            title: "Test Chub",
            salary: 666,
            equity: "0",
            company: "C1",
            handle: "c1"
        })
    });
});

describe("Search for jobs using criteria", () => {
    test("Find the test job in company c1 by company.", async () => {
        let res = await Job.findByCriteria({
            company: "c1"
        });
        expect(res.length).toEqual(1);
        expect(res[0]).toEqual({
            title: "Test Chub",
            salary: 45,
            equity: "0",
            company: "C1",
            handle: "c1"
        });
    });

    test("Find jobs that pay more than 40 dollars a year", async () => {
        let res = await Job.findByCriteria({
            salary: 40
        });
        
        expect(res.length).toEqual(3);
        expect(res).toEqual([{
            title: "Test Chub",
            salary: 45,
            equity: "0",
            company: "C1",
            handle: "c1"
        },
        {
            title: "Micro Center Shill",
            salary: 69,
            equity: "0",
            company: "C3",
            handle: "c3"
        },
        {
            title: "Coño Mega Puto",
            salary: 78,
            equity: "0",
            company: "C3",
            handle: "c3"
        }])
    });
})