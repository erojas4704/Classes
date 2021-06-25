process.env.NODE_ENV = "test";

const request = require("supertest");
const axios = require("axios");
const app = require("../app")


describe("Trying to gather information on users ", () => {
    test("Try to get information on several users.", async () => {
        let resp = await request(app)
            .post('/')
            .send({
                developers: ['joelburton', 'elie']
            });

        expect(resp.statusCode).toBe(200);
        expect(resp.body[0]).toHaveProperty("name", "Joel Burton");
        expect(resp.body[0].bio).toContain("Open source developer. Former dev at Apple");
        expect(resp.body[1]).toHaveProperty("name", "Elie Schoppik");
        expect(resp.body[1].bio).toContain("Co-founder + Lead Instructor @rithmschool");
    });
});

describe("Making sure we handle errors appropriately", () => {
    test("Try to cause a POST error.", async () => {
        let resp = await request(app)
            .post('/')
            .send({
                developers: ['barriguabnt', 'elie']
            });

        expect(resp.body[0]).toHaveProperty("error")
    });
});