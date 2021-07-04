"use strict";

const request = require("supertest");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll)
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /jobs", () => {
    test("Anybody can view job listings", async () => {
        const resp = await request(app).get("/jobs");
        expect(resp.status).toBe(200);
        expect(resp.body).toHaveProperty("jobs");
        expect(resp.body.jobs.length).toBe(4);
    });
});

describe("POST /jobs", () => {
    const testJob = {
        company_handle: "c1",
        title: "Porner",
        salary: 69,
        equity: "0.0025"
    }

    test("Admins can create job listings", async () => {
        const resp = await request(app).post("/jobs")
            .set("authorization", `Bearer ${adminToken}`)
            .send(testJob);
        expect(resp.status).toBe(201);
        expect(resp.body.job).toEqual(expect.objectContaining(testJob));
    });

    test("Non admins cannot create job listings", async () => {
        const resp = await request(app).post("/jobs")
            .set("authorization", `Bearer ${u1Token}`)
            .send(testJob);
        expect(resp.status).toBe(401);
    });
    test("Randos cannot create job listings", async () => {
        const resp = await request(app).post("/jobs")
            .send(testJob);
        expect(resp.status).toBe(401);
    });
});

describe("PATCH /jobs", () => {
    const modifications = {
        salary: 9001,
        title: "Stupid job got stupider"
    }

    test("Admins can modify job listings", async () => {
        const allJobs = await request(app).get("/jobs");
        const testJob = allJobs.body.jobs[0];
        const resp = await request(app).patch(`/jobs/${testJob.id}`)
            .set("authorization", `Bearer ${adminToken}`)
            .send(modifications);

        expect(resp.status).toBe(201);
        expect(resp.body.job).toEqual(
            expect.objectContaining(modifications)
        );

        const respCheck = await request(app).get(`/jobs/${testJob.id}`);
        expect(respCheck.body.job).not.toEqual(
            expect.objectContaining(testJob)
        );
    });

    test("Normal users cannot modify job listings", async () => {
        const allJobs = await request(app).get("/jobs");
        const testJob = allJobs.body.jobs[0];
        const resp = await request(app).patch(`/jobs/${testJob.id}`)
            .set("authorization", `Bearer ${u1Token}`)
            .send(modifications);

        expect(resp.status).toBe(401);
    });

    test("Randos cannot modify job listings", async () => {
        const allJobs = await request(app).get("/jobs");
        const testJob = allJobs.body.jobs[0];
        const resp = await request(app).patch(`/jobs/${testJob.id}`)
            .send(modifications);

        expect(resp.status).toBe(401);
    });
});

describe("DELETE /jobs", () => {
    test("Admins can delete job listings", async () => {
        const allJobs = await request(app).get("/jobs");
        const testJob = allJobs.body.jobs[0];
        const resp = await request(app).delete(`/jobs/${testJob.id}`)
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.status).toBe(200);
        expect(resp.body).toEqual({
            deleted: testJob.id.toString()
        });
    });

    test("Regular users cannot delete job listings", async () => {
        const allJobs = await request(app).get("/jobs");
        const testJob = allJobs.body.jobs[0];

        const resp = await request(app).delete(`/jobs/${testJob.id}`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.status).toBe(401);
    });

    test("Randos cannot delete job listings", async () => {
        const allJobs = await request(app).get("/jobs");
        const testJob = allJobs.body.jobs[0];
        const resp = await request(app).delete(`/jobs/${testJob.id}`)
        expect(resp.status).toBe(401);
    });
});