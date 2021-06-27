process.env.NOD_ENV = "test";
const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testCompany;

beforeEach(async () => {
    let result = await db.query(`
        INSERT INTO companies(code, name, description)
        VALUES ($1, $2, $3)
        RETURNING *;
    `, ["Test", "Testification", "This is a test company"]);
    testCompany = result.rows[0];
});

afterEach(async () => {
    await db.query(`
        DELETE FROM companies
    `);
});

describe("Testing GET routes", () => {
    test("Can we get all companies", async () => {
        let resp = await request(app).get('/companies');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            companies: [testCompany]
        });
    });

    test("Can we get specific company ", async () => {
        let resp = await request(app).get(`/companies/${testCompany.code}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            company: testCompany
        });
    })
});

describe("Testing POST route", () => {
    const testC2 = {
        code: 'fate',
        name: 'test2',
        description: 'A new test company'
    };

    test("Make sure we can create a new company and that it exists.", async () => {
        let resp = await request(app)
            .post('/companies')
            .send(testC2);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            company: testC2
        });

        let vResp = await request(app).get(`/companies/${testC2.code}`);
        expect(vResp.statusCode).toBe(200);
        expect(vResp.body).toEqual({
            company: testC2
        });
    });

    test("Makes sure we get the appropriate error if we try to create an existing company.", async () => {
        let resp = await request(app)
            .post('/companies')
            .send(testCompany);
        expect(resp.statusCode).toEqual(409);
        expect(resp.body).toEqual({
            "error": {
                "message": "Company with that code already exists",
                "status": 409
            }
        });
    });
});

describe("Testing PUT routes", () => {
    let companyEdits = {
        name:"New rebranding!",
        description:"A new image does wonders",
        code: "Test"
    }
    test("Make sure we can edit a company and that the edits stick", async () => {
        let resp = await request(app)
            .put(`/companies/${companyEdits.code}`)
            .send(companyEdits);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            company: companyEdits
        });

        let vResp = await request(app).get(`/companies/${companyEdits.code}`);
        expect(vResp.statusCode).toBe(200);
        expect(vResp.body).toEqual({
            company: companyEdits
        });
    });
});

describe("Testing delete routes", () => {
    test("Make sure we can delete a company", async () => {
        let resp = await request(app).delete(`/companies/${testCompany.code}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            status: "deleted"
        });

        //Check to make sure it no longer exists.
        let vResp = await request(app).get(`/companies/${testCompany.code}`);
        expect(vResp.statusCode).toBe(404);
    });
});

afterAll(async () => {
    await db.end();
});